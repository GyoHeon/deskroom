"""
This module is inspired by polar's worker module.
https://github.com/polarsource/polar/blob/main/server/polar/worker.py
"""

import contextvars
import uuid
from collections.abc import AsyncIterator, Awaitable, Callable
from contextlib import asynccontextmanager
from datetime import datetime
from functools import wraps
from typing import Any, ParamSpec, TypeAlias, TypedDict, TypeVar, cast

import structlog
from arq import func
from arq.connections import ArqRedis, RedisSettings
from arq.connections import create_pool as arq_create_pool
from arq.cron import CronJob
from arq.typing import SecondsTimedelta
from arq.worker import Function

from deskroom.config import settings
from deskroom.logging import Logger


class WorkerContext(TypedDict):
    redis: ArqRedis


class JobContext(WorkerContext):
    job_id: str
    job_try: int
    enqueue_time: datetime
    score: int


logger: Logger = structlog.get_logger()
JobToEnqueue: TypeAlias = tuple[str, tuple[Any], dict[str, Any]]
_jobs_to_enqueue = contextvars.ContextVar[list[JobToEnqueue]](
    "deskroom_worker_jobs_to_enqueue", default=[]
)

Params = ParamSpec("Params")
ReturnValue = TypeVar("ReturnValue")


def enqueue_job(name: str, *args: Any, **kwargs: Any) -> None:
    # ctx = ExecutionContext.current()
    # polar_context = PolarWorkerContext(
    #     is_during_installation=ctx.is_during_installation,
    # )
    #
    # request_correlation_id = structlog.contextvars.get_contextvars().get(
    #     "correlation_id"
    # )

    # Prefix job ID by task name by default
    _job_id = kwargs.pop("_job_id", f"{name}:{uuid.uuid4().hex}")

    kwargs = {
        # "request_correlation_id": request_correlation_id,
        # "polar_context": polar_context,
        **kwargs,
        "_job_id": _job_id,
    }

    _jobs_to_enqueue_list = _jobs_to_enqueue.get([])
    _jobs_to_enqueue_list.append((name, args, kwargs))
    _jobs_to_enqueue.set(_jobs_to_enqueue_list)

    logger.debug("deskroom.worker.job_enqueued", name=name, args=args, kwargs=kwargs)


async def flush_enqueued_jobs(arq_pool: ArqRedis) -> None:
    if _jobs_to_enqueue_list := _jobs_to_enqueue.get([]):
        logger.debug("deskroom.worker.flush_enqueued_jobs")
        for name, args, kwargs in _jobs_to_enqueue_list:
            await arq_pool.enqueue_job(name, *args, **kwargs)
            logger.debug(
                "deskroom.worker.job_flushed", name=name, args=args, kwargs=kwargs
            )
        _jobs_to_enqueue.set([])


def task_hooks(
    f: Callable[Params, Awaitable[ReturnValue]],
) -> Callable[Params, Awaitable[ReturnValue]]:
    @wraps(f)
    async def wrapper(*args: Params.args, **kwargs: Params.kwargs) -> ReturnValue:
        job_context = cast(JobContext, args[0])
        # structlog.contextvars.bind_contextvars(
        #     correlation_id=generate_correlation_id(),
        #     job_id=job_context["job_id"],
        #     job_try=job_context["job_try"],
        #     enqueue_time=job_context["enqueue_time"].isoformat(),
        #     score=job_context["score"],
        # )

        request_correlation_id = kwargs.pop("request_correlation_id", None)
        # if request_correlation_id is not None:
        #     structlog.contextvars.bind_contextvars(
        #         request_correlation_id=request_correlation_id
        #     )

        logger.info("deskroom.worker.job_started")

        r = await f(*args, **kwargs)

        arq_pool = job_context["redis"]
        await flush_enqueued_jobs(arq_pool)

        logger.info("deskroom.worker.job_ended")
        # structlog.contextvars.unbind_contextvars(
        #     "correlation_id",
        #     "request_correlation_id",
        #     "job_id",
        #     "job_try",
        #     "enqueue_time",
        #     "score",
        # )

        return r

    return wrapper


def task(
    name: str,
    *,
    keep_result: SecondsTimedelta | None = None,
    timeout: SecondsTimedelta | None = None,
    keep_result_forever: bool | None = None,
    max_tries: int | None = None,
) -> Callable[
    [Callable[Params, Awaitable[ReturnValue]]], Callable[Params, Awaitable[ReturnValue]]
]:
    def decorator(
        f: Callable[Params, Awaitable[ReturnValue]],
    ) -> Callable[Params, Awaitable[ReturnValue]]:
        wrapped = task_hooks(f)
        new_task = func(
            wrapped,  # type: ignore
            name=name,
            keep_result=keep_result,
            timeout=timeout,
            keep_result_forever=keep_result_forever,
            max_tries=max_tries,
        )
        WorkerSettings.functions.append(new_task)

        return wrapped

    return decorator


class WorkerSettings:
    functions: list[Function] = []
    cron_jobs: list[CronJob] = []

    redis_settings = RedisSettings().from_dsn(settings.REDIS_URL)

    @staticmethod
    async def on_startup(ctx: WorkerContext) -> None:
        logger.info("deskroom.worker.startup")

    @staticmethod
    async def on_shutdown(ctx: WorkerContext) -> None:
        logger.info("deskroom.worker.shutdown")


@asynccontextmanager
async def worker_lifespan() -> AsyncIterator[ArqRedis]:
    arq_pool = await arq_create_pool(WorkerSettings.redis_settings)
    yield arq_pool
    await arq_pool.close(True)
