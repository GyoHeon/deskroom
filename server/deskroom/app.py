from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from typing import TypedDict

from arq.connections import ArqRedis
from fastapi import FastAPI
from structlog import get_logger

from deskroom.api import router
from deskroom.logging import Logger
from deskroom.worker import worker_lifespan

logger: Logger = get_logger()


class State(TypedDict):
    count: int
    arq_pool: ArqRedis


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[State]:
    async with worker_lifespan() as arq_pool:
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

    return app


app = create_app()
