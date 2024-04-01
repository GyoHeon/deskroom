from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from typing import TypedDict

from fastapi import FastAPI
from structlog import get_logger

from deskroom.logging import Logger

logger: Logger = get_logger()


class State(TypedDict):
    count: int


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[State]:
    yield {"count": 0}


def create_app() -> FastAPI:
    app = FastAPI(lifespan=lifespan)

    @app.on_event("startup")
    async def on_startup() -> None:
        logger.info("Starting up")

    @app.on_event("shutdown")
    async def on_shutdown() -> None:
        logger.info("Shutting down")

    # TODO: Add routes, middlewares here

    return app


app = create_app()
