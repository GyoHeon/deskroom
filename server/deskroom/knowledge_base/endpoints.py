import structlog
from fastapi import APIRouter, Depends
from supabase._async.client import AsyncClient

from deskroom.common.supabase import create_supabase_async_client
from deskroom.logging import Logger
from fastapi import APIRouter, File, UploadFile
import pandas as pd
from .schema import KnowledgeBase, KnowledgeBaseFetch
from .utils import (
    process_raw_file,
    generate_discovery_string,
    generate_qa_string,
    create_policy,
    create_qa,
)
from ast import literal_eval

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
async def make_knowledge_base(
    org_key,
    file: UploadFile = File(...),
    supabase: AsyncClient = Depends(create_supabase_async_client),
):
    questions = []
    answers = []

    raw_df = pd.read_excel(
        file.file.read(), engine="openpyxl", sheet_name="Message data"
    )

    org_info = (
        supabase.table("organizations").select("*").eq("key", org_key).execute().data[0]
    )

    raw_df = raw_df.dropna()
    processed_df = process_raw_file(raw_df)

    discovery_str = generate_discovery_string(processed_df)
    company_policy = create_policy(discovery_str)
    chat_ids = list(processed_df["chatId"].unique())
    for chat_id in chat_ids:
        try:

            qa_string = generate_qa_string(processed_df, chat_id)
            discovered = create_qa(company_policy, qa_string)
            discovered_ = literal_eval(discovered)
            for qa in list(discovered_.values()):
                questions.append(qa["Question"])
                answers.append(qa["Answer"])
        except:
            pass
    update_df = pd.DataFrame({"Question": questions, "Answer": answers})
    updated_data = []
    for _ in range(len(update_df)):
        updated_files = {
            "org_id": org_info["org_id"],
            "org_name": org_info["org_name"],
            "org_key": org_key,
            "question": update_df["Question"].tolist()[_],
            "answer": update_df["Answer"].tolist()[_],
        }
        data = supabase.table("knowledge_base").insert(updated_files).execute()
        updated_data.append(data)
    return updated_data
