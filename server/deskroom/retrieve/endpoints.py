from ast import literal_eval

import structlog
from fastapi import APIRouter, Depends, HTTPException
from supabase._async.client import AsyncClient

from deskroom.common.supabase import create_supabase_async_client
from deskroom.logging import Logger
from deskroom.retrieve.utils import retrieve_qns

from .schema import (
    KnowledgeQueryIn,
    KnowledgeQueryInWithCategory,
    KnowledgeQueryOut,
    KnowledgeQueryOutWithCategory,
)

logger: Logger = structlog.get_logger()

router = APIRouter(tags=["retrieve"], prefix="/retrieve")


async def retrieve_and_process(
    qn: str,
    knowledge_base: list[dict[str, str]],
) -> list[dict[str, str]]:
    cleansed_question = qn
    company_policy = ""
    input_samples = {}
    for idx in range(len(knowledge_base)):
        input_samples[f"Q{idx + 1}"] = knowledge_base[idx]["question"]

    retrieved = await retrieve_qns(
        company_policy, str(input_samples), cleansed_question
    )

    output = literal_eval(str(retrieved))
    retrieved_msgs = []
    for retrieve_num in range(1, 4):
        try:
            predicted = output[f"Similar {retrieve_num}"]

            if predicted is not None:
                predicted_num = int(predicted.replace("Q", ""))

                predicted_category, predicted_ans = (
                    knowledge_base[predicted_num - 1]["category"],
                    [i["answer"] for i in knowledge_base][predicted_num - 1],
                )

                if not predicted_category:
                    predicted_category = "공통"

                retrieved_msgs.append(
                    {"category": predicted_category, "answer": predicted_ans}
                )

        except (KeyError, ValueError):
            pass

    return retrieved_msgs


@router.post("/category/")
async def get_knowledge_with_category_filter(
    knowledge_query_in: KnowledgeQueryInWithCategory,
    supabase: AsyncClient = Depends(create_supabase_async_client),
) -> KnowledgeQueryOutWithCategory:
    supabase_response = (
        await supabase.table("knowledge_base")
        .select("*, organizations(company_info_policy)")
        .eq("org_key", knowledge_query_in.organization_name)
        .eq("category", knowledge_query_in.category)
        .execute()
    )
    if not supabase_response.data:
        raise HTTPException(status_code=400, detail="Data Not Found.")
    retrieved_msgs = await retrieve_and_process(
        qn=knowledge_query_in.question, knowledge_base=supabase_response.data
    )
    return KnowledgeQueryOutWithCategory(
        organization_name=knowledge_query_in.organization_name,
        question=knowledge_query_in.question,
        cleansed_question=knowledge_query_in.question,
        retrieved_messages=retrieved_msgs,
        category=knowledge_query_in.category,
    )


@router.post("/")
async def get_nearest_knowledge_item(
    knowledge_query_in: KnowledgeQueryIn,
    supabase: AsyncClient = Depends(create_supabase_async_client),
) -> KnowledgeQueryOut:
    company_policy = ""

    supabase_response = (
        await supabase.table("knowledge_base")
        .select("*, organizations(company_info_policy)")
        .eq("org_key", knowledge_query_in.organization_name)
        .execute()
    )
    retrieved_msgs = await retrieve_and_process(
        qn=knowledge_query_in.question, knowledge_base=supabase_response.data
    )
    return KnowledgeQueryOut(
        organization_name=knowledge_query_in.organization_name,
        question=knowledge_query_in.question,
        cleansed_question=knowledge_query_in.question,
        retrieved_messages=retrieved_msgs,
    )
