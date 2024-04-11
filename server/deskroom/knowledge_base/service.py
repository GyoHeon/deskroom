# TODO: add service

from supabase._async.client import AsyncClient

from deskroom.knowledge_base.schema import KnowledgeBaseCreateJob


async def create_knowledge_base_create_job(
    supabase: AsyncClient, name: str, org_key: str
) -> KnowledgeBaseCreateJob:
    response = await (
        supabase.table("jobs")
        .insert(
            {
                "name": name,
                "status": 0,
                "type": "knowledge_base_create",
                "org_key": org_key,
            }
        )
        .execute()
    )

    return KnowledgeBaseCreateJob.model_validate(response.data[0])


async def mark_create_job_done(
    supabase: AsyncClient, job_id: int
) -> KnowledgeBaseCreateJob:
    response = await (
        supabase.table("jobs").update({"status": 1}).eq("id", job_id).execute()
    )

    return KnowledgeBaseCreateJob.model_validate(response.data[0])
