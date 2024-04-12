import structlog
from fastapi import APIRouter, Depends
from supabase._async.client import AsyncClient

from deskroom.common.supabase import create_supabase_async_client
from deskroom.logging import Logger
from deskroom.worker import enqueue_job

from .schema import (
    KnowledgeBase,
    KnowledgeBaseCreateJobByUploadIn,
    KnowledgeBaseFetch,
)

logger: Logger = structlog.get_logger()

router = APIRouter(tags=["knowledge_base"], prefix="/knowledge")


@router.post("/")
async def get_knowledge_base(
    item: KnowledgeBaseFetch,
    supabase: AsyncClient = Depends(create_supabase_async_client),
) -> list[KnowledgeBase]:
    response = (
        await supabase.table("knowledge_base")
        .select("*, organizations(company_info_policy)")
        .eq("org_key", item.organization_key)
        .execute()
    )

    return response.data


@router.post("/upload/{org_key}")
async def create_knowledge_base_by_upload(
    org_key: str,
    job_in: KnowledgeBaseCreateJobByUploadIn,
) -> dict[str, str]:
    enqueue_job(
<<<<<<< HEAD
        "knowledge_base.create",
        org_key,
        job_in.user_id,
        job_in.file_urls,
        job_in.tone_manner,
        job_in.categories,
=======
        "knowledge_base.create", org_key, job_in.user_id, job_in.file_urls, job_in.type_
>>>>>>> 4ec3435 (feat(server): add upload type)
    )
    return {"message": "job created"}
