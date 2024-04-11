import structlog

from deskroom.common.supabase import create_supabase_async_client
from deskroom.knowledge_base import service
from deskroom.worker import JobContext, task

logger = structlog.get_logger()


@task("knowledge_base.create")
async def create_knowledge_base_create_job(
    ctx: JobContext, org_key: str, user_id: str
) -> None:
    supabase = await create_supabase_async_client()
    job_id = ctx.get("job_id")

    if not job_id:
        raise ValueError("Job ID is not found")

    create_job = await service.create_knowledge_base_create_job(
        supabase, job_id, org_key, user_id
    )
    # TODO: do something with prompt
    df = await service.read_xlsx_from_azure_blob_storage("", ...)
    processed_df = await service.process_xlsx_for_kb_create(df)

    create_knowledge_base_response = (
        await supabase.table("knowledge_base")
        .insert(
            [
                {
                    "org_key": org_key,
                    "question": processed_df["Question"].tolist()[row_num],
                    "answer": processed_df["Answer"].tolist()[row_num],
                }
                for row_num in processed_df
            ]
        )
        .execute()
    )

    if create_knowledge_base_response.data:
        await service.mark_create_job_done(supabase, create_job.job_id)
