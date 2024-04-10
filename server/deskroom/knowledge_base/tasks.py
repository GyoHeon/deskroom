from deskroom.common.supabase import create_supabase_async_client
from deskroom.knowledge_base import service
from deskroom.worker import JobContext, task


@task("knowledge_base.create")
async def create_knowledge_base_create_job(ctx: JobContext) -> None:
    # Create a job to create a knowledge base
    supabase = await create_supabase_async_client()
    create_job = await service.create_knowledge_base_create_job(
        supabase, ctx.get("job_id")
    )
    # TODO: do something with prompt
    # TODO: notify slack
    await service.mark_create_job_done(supabase, create_job.job_id)
