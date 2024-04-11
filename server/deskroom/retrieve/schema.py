from typing import Any

from deskroom.common.schema import Schema


class KnowledgeQueryIn(Schema):
    organization_name: str
    question: str


class KnowledgeQueryInWithCategory(KnowledgeQueryIn):
    category: str


class KnowledgeQueryRetrieved(Schema):
    answer: str
    category: str


class KnowledgeQueryOutWithCategory(KnowledgeQueryInWithCategory):
    cleansed_question: str
    retrieved_messages: list[dict[str, Any]]


class KnowledgeQueryOut(KnowledgeQueryIn):
    cleansed_question: str
    retrieved_messages: list[dict[str, Any]]
