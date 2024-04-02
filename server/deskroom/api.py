from fastapi import APIRouter

from deskroom.knowledge_base.endpoints import router as KnowledgeBaseRouter

router = APIRouter(prefix="/v1")

router.include_router(KnowledgeBaseRouter)
