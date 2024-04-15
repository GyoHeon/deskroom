from ast import literal_eval

import pandas as pd
import structlog
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from supabase._async.client import AsyncClient

from deskroom.common.supabase import create_supabase_async_client
from deskroom.logging import Logger
from deskroom.worker import enqueue_job

from .schema import KnowledgeBase, KnowledgeBaseCreateJobIn, KnowledgeBaseFetch
from .utils import (
    create_policy,
    create_qa,
    generate_discovery_string,
    process_raw_file,
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


@router.post("/create")
async def create_knowledge_base(
    item: KnowledgeBaseCreateJobIn,
) -> None:
    enqueue_job("knowledge_base.create", item.org_key)


@router.post("/upload/{org_key}")
async def make_knowledge_base(
    org_key: str,
    tone_manner: str,
    categories: str,
    file: UploadFile = File(...),
    supabase: AsyncClient = Depends(create_supabase_async_client),
) -> list[KnowledgeBase]:
    questions = []
    answers = []
    qn_categories = []

    raw_df = pd.read_excel(
        file.file.read(), engine="openpyxl", sheet_name="Message data"
    )

    supabase_response = await (
        supabase.table("organizations")
        .select("id", "name_eng")
        .eq("key", org_key)
        .execute()
    )
    if not supabase_response.data:
        raise HTTPException(status_code=404, detail="Item Not Found")

    raw_df = raw_df.dropna()
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
    update_df = pd.DataFrame(
        {"Question": questions, "Answer": answers, "Category": qn_categories}
    )
    supabase_update_response = (
        await supabase.table("knowledge_base")
        .insert(
            [
                {
                    "org_id": supabase_response.data[0]["id"],
                    "org_name": supabase_response.data[0]["name_eng"],
                    "org_key": org_key,
                    "question": update_df["Question"].tolist()[row_num],
                    "answer": update_df["Answer"].tolist()[row_num],
                    "category": update_df["Category"].tolist()[row_num],
                }
                for row_num in range(len(update_df))
            ]
        )
        .execute()
    )
    return supabase_update_response.data
