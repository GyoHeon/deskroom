from supabase._async.client import (
    AsyncClient,
)
from supabase._async.client import (
    create_client as create_async_client,
)
from supabase._sync.client import SyncClient as Client
from supabase._sync.client import create_client

from deskroom.config import settings


def create_supabase_client(url: str, key: str) -> Client:
    return create_client(
        url,
        key,
    )


async def create_supabase_async_client(
    url: str = settings.SUPABASE_URL, key: str = settings.SUPABASE_ANON_KEY
) -> AsyncClient:
    return await create_async_client(
        url,
        key,
    )


supabase_sync_client = create_supabase_client(
    url=settings.SUPABASE_URL, key=settings.SUPABASE_ANON_KEY
)
