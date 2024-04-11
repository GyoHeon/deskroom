from ast import literal_eval

import pandas as pd
from supabase._async.client import AsyncClient

from deskroom.common.azure import AsyncContainerClient
from deskroom.knowledge_base.schema import KnowledgeBaseCreateJob

from .utils import (
    create_policy,
    create_qa,
    generate_discovery_string,
    generate_qa_string,
    process_raw_file,
)


async def create_knowledge_base_create_job(
    supabase: AsyncClient, job_id: str, org_key: str, user_id: str
) -> KnowledgeBaseCreateJob:
    response = await (
        supabase.table("uploads")
        .insert(
            {
                "job_id": job_id,
                "status": "CREATED",
                "user_id": user_id,
                "org_key": org_key,
            }
        )
        .execute()
    )

    return KnowledgeBaseCreateJob.model_validate(response.data[0])


async def mark_create_job_done(
    supabase: AsyncClient, job_id: str
) -> KnowledgeBaseCreateJob:
    response = await (
        supabase.table("uploads")
        .update({"status": "DONE"})
        .eq("job_id", job_id)
        .execute()
    )

    return KnowledgeBaseCreateJob.model_validate(response.data[0])


async def read_xlsx_from_azure_blob_storage(
    blob_storage_url: str, client: AsyncContainerClient
) -> pd.DataFrame:
    # raw_df = pd.read_excel(
    #     file.file.read(), engine="openpyxl", sheet_name="Message data"
    # )
    ...


async def process_xlsx_for_kb_create(df: pd.DataFrame) -> pd.DataFrame:
    questions = []
    answers = []

    processed_df = await process_raw_file(df)

    discovery_str = await generate_discovery_string(processed_df)
    company_policy = await create_policy(discovery_str)
    chat_ids = list(processed_df["chatId"].unique())
    for chat_id in chat_ids:
        try:
            qa_string = await generate_qa_string(processed_df, chat_id)
            discovered = await create_qa(company_policy, qa_string)
            discovered_ = literal_eval(discovered)
            for qa in list(discovered_.values()):
                questions.append(qa["Question"])
                answers.append(qa["Answer"])
        except (ValueError, KeyError):
            continue
    return pd.DataFrame({"Question": questions, "Answer": answers})
