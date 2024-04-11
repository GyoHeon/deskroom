from starlette.types import ASGIApp, Receive, Scope, Send

from deskroom.config import settings
from deskroom.worker import flush_enqueued_jobs


class FlushEnqueuedWorkerJobsMiddleware:
    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        await self.app(scope, receive, send)

        if not settings.is_test():
            await flush_enqueued_jobs(scope["state"]["arq_pool"])
