from deskroom.worker import JobContext, task


@task("knowledge_base.create")
async def create_knowledge_base_create_job(ctx: JobContext) -> None:
    # Create a job to create a knowledge base
    ...
