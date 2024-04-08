from supabase._async.client import (
    AsyncClient,
)
from supabase._async.client import (
    create_client as create_async_client,
)
from supabase._sync.client import SyncClient as Client
from supabase._sync.client import create_client

from deskroom.config import settings


def _create_supabase_client(url: str, key: str) -> Client:
    return create_client(
        url,
        key,
    )


async def create_supabase_client() -> Client:
    return _create_supabase_client(
        url=settings.SUPABASE_URL, key=settings.SUPABASE_ANON_KEY
    )


async def _create_supabase_async_client(url: str, key: str) -> AsyncClient:
    return await create_async_client(
        url,
        key,
    )


async def create_supabase_async_client() -> AsyncClient:
    return await _create_supabase_async_client(
        url=settings.SUPABASE_URL, key=settings.SUPABASE_ANON_KEY
    )
