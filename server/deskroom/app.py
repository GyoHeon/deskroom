from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from typing import TypedDict

from arq.connections import ArqRedis
from fastapi import FastAPI
from structlog import get_logger

from deskroom.api import router
from deskroom.common.openai import download_prompts
from deskroom.config import settings
from deskroom.logging import Logger
from deskroom.middlewares import FlushEnqueuedWorkerJobsMiddleware
from deskroom.worker import worker_lifespan

logger: Logger = get_logger()


class State(TypedDict):
    count: int
    arq_pool: ArqRedis


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[State]:
    async with worker_lifespan() as arq_pool:
        logger.info("Downloading Prompts")
        if not settings.is_local() and not settings.is_test():
            download_prompts()
        logger.info("Creating app")
        yield State(count=0, arq_pool=arq_pool)
        logger.info("Destroying app")


def create_app() -> FastAPI:
    app = FastAPI(lifespan=lifespan)

    @app.on_event("startup")
    async def on_startup() -> None:
        logger.info("Starting up")

    @app.on_event("shutdown")
    async def on_shutdown() -> None:
        logger.info("Shutting down")

    # TODO: Add routes, middlewares here
    app.include_router(router)
    app.add_middleware(FlushEnqueuedWorkerJobsMiddleware)

    configure_sentry(app)

    return app


def configure_sentry(app: FastAPI | None = None) -> None:
    if settings.SENTRY_ENABLED:
        import sentry_sdk  # noqa

        from sentry_sdk.integrations.asgi import SentryAsgiMiddleware

        sentry_sdk.init(
            dsn=settings.SENTRY_DSN,
            traces_sample_rate=1.0,
            environment=settings.ENV,
            release=settings.VERSION,
            debug=settings.is_development(),
        )

        if app:
            app.add_middleware(SentryAsgiMiddleware)


app = create_app()
