from fastapi import APIRouter

from deskroom.knowledge_base.endpoints import router as KnowledgeBaseRouter
from deskroom.retrieve.endpoints import router as RetrievalRouter

router = APIRouter(prefix="/v1")

router.include_router(KnowledgeBaseRouter)
router.include_router(RetrievalRouter)
