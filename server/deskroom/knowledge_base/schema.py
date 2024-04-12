from enum import Enum

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


class KnowledgeBaseCreateJobIn(Schema):
    name: str
    org_key: str


class UploadJobStatus(str, Enum):
    CREATED = "CREATED"
    PENDING = "PENDING"
    DONE = "DONE"
    FAILED = "FAILED"


class UploadType(str, Enum):
    CHANNELTALK = "CHANNELTALK"
    NAVER_SMART_STORE = "NAVER_SMART_STORE"
    KAKAO_CHANNEL = "KAKAO_CHANNEL"
    UNKNOWN = "UNKNOWN"


class KnowledgeBaseCreateJob(ModelSchema):
    job_id: str
    status: UploadJobStatus
    user_id: str
    org_key: str


class KnowledgeBaseCreateJobByUploadIn(Schema):
    user_id: str
    file_urls: list[str]
    tone_manner: str | None
    categories: str | None
    type_: UploadType = Field(alias="type")


class CreateLinearIssueOut(Schema):
    id: str
    title: str
