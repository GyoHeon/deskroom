import structlog

from deskroom.common.azure import create_azure_container_client
from deskroom.common.supabase import create_supabase_async_client
from deskroom.knowledge_base import service
from deskroom.knowledge_base.schema import UploadType
from deskroom.worker import JobContext, task

logger = structlog.get_logger()


@task("knowledge_base.create")
async def create_knowledge_base_create_job(
    ctx: JobContext,
    org_key: str,
    user_id: str,
    file_urls: list[str],
    tone_manner: str | None,
    categories: str | None,
) -> None:
    supabase = await create_supabase_async_client()
    azure_client = create_azure_container_client("deskroom-files")

    first_file_url = next(iter(file_urls), None)  # TODO: find a better way
    if not first_file_url:
        return

    job_id = ctx.get("job_id")

    if not job_id:
        raise ValueError("Job ID is not found")

    create_job = await service.create_knowledge_base_create_job(
        supabase, job_id, org_key, user_id
    )

    if type_ != UploadType.CHANNELTALK:
        # TODO: implement for other types
        pass

    df = service.read_xlsx_from_azure_blob_storage(
        first_file_url, azure_client, sheet_name="Message data"
    )  # TODO: convert to async
    processed_df = await service.process_xlsx_for_kb_create(df, tone_manner, categories)

    create_knowledge_base_response = (
        await supabase.table("knowledge_base")
        .insert(
            [
                {
                    "org_key": org_key,
                    "question": processed_df["Question"].tolist()[row_num],
                    "answer": processed_df["Answer"].tolist()[row_num],
                    "category": processed_df["Category"].tolist()[row_num],
                }
                for row_num in range(len(processed_df))
            ]
        )
        .execute()
    )

    if create_knowledge_base_response.data:
        await service.mark_create_job_done(supabase, create_job.job_id)
