from fastapi import APIRouter

from deskroom.knowledge_base.endpoints import router as KnowledgeBaseRouter
from deskroom.retrieve.endpoints import router as RetrievalRouter
from deskroom.sources.endpoints import router as SourcesRouter

router = APIRouter(prefix="/v1")

router.include_router(KnowledgeBaseRouter)
router.include_router(RetrievalRouter)
router.include_router(SourcesRouter)
