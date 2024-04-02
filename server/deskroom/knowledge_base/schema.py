from pydantic import Field

from deskroom.common.schema import Schema


class KnowledgeBaseUpdate(Schema):
    org_id: int | None = Field(None)
    # org_key: str = Field(None)
    org_name: str | None = Field(None)
    category: str = Field(None)
    intent: str = Field(None)
    question: str = Field(None)
    similar_questions: str = Field(None)
    answer: str = Field(None)


class KnowledgeBaseCreate(Schema):
    org_key: str = Field(None)
    question: str = Field(None)
    answer: str = Field(None)


class KnowledgeBaseFetch(Schema):
    organization_id: int = Field(None)
    organization_key: str = Field(None)
    category: str = Field(None)
    page: int | None = Field(None)
    offset: int | None = Field(None)
