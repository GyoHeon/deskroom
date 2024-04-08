from deskroom.common.schema import Schema


class KnowledgeQueryIn(Schema):
    organization_name: str
    question: str


class KnowledgeQueryInWithCategory(KnowledgeQueryIn):
    category: str


class KnowledgeQueryRetrieved(Schema):
    answer: str
    category: str


class KnowledgeQueryOut(KnowledgeQueryIn):
    cleansed_question: str
    retrieved_messages: list[KnowledgeQueryRetrieved]
