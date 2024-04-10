from pydantic import Field

from deskroom.common.schema import ModelSchema, Schema


class KnowledgeBase(ModelSchema):
    org_id: int
    org_key: str | None
    org_name: str | None
    category: str | None
    intent: str | None
    question: str | None
    similar_questions: str | None
    answer: str | None


class KnowledgeBaseUpdate(Schema):
    org_id: int | None = Field(None)
    # org_key: str | None = Field(None)
    org_name: str | None = Field(None)
    category: str | None = Field(None)
    intent: str | None = Field(None)
    question: str | None = Field(None)
    similar_questions: str | None = Field(None)
    answer: str | None = Field(None)


class KnowledgeBaseCreate(Schema):
    org_key: str | None = Field(None)
    question: str | None = Field(None)
    answer: str | None = Field(None)


class KnowledgeBaseFetch(Schema):
    organization_id: int | None = Field(None)
    organization_key: str | None = Field(None)
    category: str | None = Field(None)
    page: int | None = Field(None)
    offset: int | None = Field(None)


class KnowledgeBaseCreateJob(Schema):
    job_id: str = Field(alias="id")
    status: int | None = Field(None)
