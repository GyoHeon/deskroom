from datetime import datetime

from pydantic import BaseModel, ConfigDict


class Schema(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class ModelSchema(Schema):
    id: int | None
    created_at: datetime | None
    updated_at: datetime | None
