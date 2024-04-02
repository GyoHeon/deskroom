import structlog
from fastapi import APIRouter, Depends, File, UploadFile
from supabase._async.client import AsyncClient

from deskroom.common.supabase import create_supabase_async_client
from deskroom.logging import Logger

from .schema import KnowledgeBaseCreate, KnowledgeBaseFetch, KnowledgeBaseUpdate
from typing import TypedDict

logger: Logger = structlog.get_logger()

router = APIRouter(tags=["knowledge_base"], prefix="/knowledge")


@router.get("/")
async def get_knowledge_base(
    item: KnowledgeBaseFetch,
    supabase: AsyncClient = Depends(create_supabase_async_client),
):
    response = (
        await supabase.table("knowledge_base")
        .select("*")
        .eq("org_key", item.organization_key)
        .execute()
    )
    return response.data
