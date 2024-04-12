from ast import literal_eval
from urllib.parse import urlparse

import pandas as pd
import structlog
import requests
from supabase._async.client import AsyncClient

from deskroom.common.azure import ContainerClient
from deskroom.knowledge_base.schema import KnowledgeBaseCreateJob
from deskroom.config import settings

from .utils import (
    create_policy,
    create_qa,
    generate_discovery_string,
    process_raw_file,
)

logger = structlog.get_logger()


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


def read_xlsx_from_azure_blob_storage(
    blob_storage_url: str, client: ContainerClient, sheet_name: str | None = None
) -> pd.DataFrame:
    obj = urlparse(blob_storage_url)
    [container, *blob_names] = obj.path[1:].split("/")
    logger.info(f"{container=}, {blob_names=}")

    blob_name = "/".join(blob_names)
    logger.info(blob_name)

    if not blob_name.endswith(".xlsx"):
        raise ValueError("Invalid file format. Please upload an xlsx file.")
    blob_client = client.get_blob_client(blob_name)
    download = blob_client.download_blob()

    if sheet_name:
        return pd.read_excel(download.readall(), sheet_name, engine="openpyxl")

    return pd.read_excel(download.readall(), engine="openpyxl")


async def process_xlsx_for_kb_create(
    df: pd.DataFrame, tone_manner: str | None, categories: str | None
) -> pd.DataFrame:
    questions = []
    answers = []
    qn_categories = []

    raw_df = df.dropna()
    processed_df = await process_raw_file(raw_df)

    discovery_str = await generate_discovery_string(processed_df)

    company_policy = await create_policy(discovery_str)
    chat_ids = list(processed_df["chatId"].unique())
    for chat_id in chat_ids[:1]:
        try:
            query_df = processed_df[processed_df["chatId"] == chat_id]
            discovered = await create_qa(
                company_policy,
                tone_manner,
                categories,
                query_df,
            )

            discovered_ = literal_eval(discovered)
            for qa in list(discovered_.values()):
                questions.append(qa["Qn"])
                answers.append(qa["Ans"])
                qn_categories.append(qa["Category"])
        except (ValueError, KeyError):
            continue
    return pd.DataFrame(
        {"Question": questions, "Answer": answers, "Category": qn_categories}
    )


LINEAR_DEFAULT_TEAM_ID = "fbe153f9-16d2-4865-ade6-f7d3471086e7"
LINEAR_GRAPHQL_API_URL = "https://api.linear.app/graphql"


def create_linear_issue(
    title: str, description: str, team_id=LINEAR_DEFAULT_TEAM_ID
) -> str:
    headers = {
        "Content-Type": "application/json",
        "Authorization": settings.LINEAR_API_KEY,
    }

    mutation = """ 
    mutation IssueCreate {
    issueCreate(
        input: {
            title: "%s"
            description: "%s"
            teamId: "%s"
        }
    ) {
        success
        issue {
            id
            title
        }
    }
    }
    """ % (title, description, team_id)  # noqa
    logger.info(mutation)

    response = requests.post(
        LINEAR_GRAPHQL_API_URL, headers=headers, json={"query": mutation}
    )
    if not response.ok:
        logger.error(
            "knowledge_base.service.create_linear_issue",
            extra={"response": response, "message": response.json()["errors"]},
        )
        raise Exception("linear error")

    return response.json()
