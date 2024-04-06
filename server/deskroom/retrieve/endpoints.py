import structlog
from fastapi import APIRouter, Depends

from ast import literal_eval
from supabase._async.client import AsyncClient
from deskroom.common.supabase import create_supabase_async_client
from deskroom.logging import Logger
from .schema import KnowledgeQueryIn, KnowledgeQueryOut
from deskroom.retrieve.utils import retrieve_qns

logger: Logger = structlog.get_logger()

router = APIRouter(tags=["retrieve"], prefix="/retrieve")


@router.post("/")
async def get_nearest_knowledge_item(
    knowledge_query_in: KnowledgeQueryIn,
    supabase: AsyncClient = Depends(create_supabase_async_client),
) -> KnowledgeQueryOut:

    company_policy = ""

    response = (
        await supabase.table("knowledge_base")
        .select("*, organizations(company_info_policy)")
        .eq("org_key", knowledge_query_in.organization_name)
        .execute()
    )
    knowledge_base = response.data

    cleansed_question = knowledge_query_in.question

    input_samples = {}
    for idx in range(len(knowledge_base)):
        input_samples[f"Q{idx + 1}"] = knowledge_base[idx]["question"]
    retrieved = await retrieve_qns(
        company_policy, str(input_samples), cleansed_question
    )

    output = literal_eval(retrieved)
    retrieved_msgs = []
    for retrieve_num in range(1, 4):
        try:
            predicted = output[f"Similar {retrieve_num}"]

            if predicted is not None:
                predicted_num = int(predicted.replace("Q", ""))
                print(predicted_num)
                predicted_category, predicted_ans = (
                    knowledge_base[predicted_num - 1]["category"],
                    [i["answer"] for i in knowledge_base][predicted_num - 1],
                )
                print(predicted_category)
                if not predicted_category:
                    predicted_category = "공통"

                retrieved_msgs.append(
                    {"category": predicted_category, "answer": predicted_ans}
                )

        except:
            pass
    return KnowledgeQueryOut(
        organization_name=knowledge_query_in.organization_name,
        question=knowledge_query_in.question,
        cleansed_question=cleansed_question,
        retrieved_messages=retrieved_msgs,
    )
