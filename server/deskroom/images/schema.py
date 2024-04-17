from pydantic import Field

from deskroom.common.schema import ModelSchema, Schema


class UploadImageOut(ModelSchema):
    file_url: str | None = Field(alias="image_url")
    file_name: str
    org_key: str
    status: str


class UploadImageError(Schema):
    file_name: str
    org_key: str
    error: str
