import structlog

from deskroom.common.supabase import create_supabase_async_client
from deskroom.config import settings
from deskroom.knowledge_base import service
from deskroom.worker import JobContext, task

logger = structlog.get_logger()


@task("knowledge_base.create")
async def create_knowledge_base_create_job(ctx: JobContext, org_key: str) -> None:
    logger.info(f"supabase_url: ${settings.SUPABASE_URL}")
    supabase = await create_supabase_async_client()
    job_id = ctx.get("job_id")

    if not job_id:
        raise ValueError("Job ID is not found")

    create_job = await service.create_knowledge_base_create_job(
        supabase, job_id, org_key
    )
    # TODO: do something with prompt
    # TODO: notify slack
    await service.mark_create_job_done(supabase, create_job.job_id)
