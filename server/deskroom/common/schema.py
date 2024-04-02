from datetime import datetime
from pydantic import BaseModel, ConfigDict


class Schema(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class ModelSchema(Schema):
    id: int
    created_at: datetime
    updated_at: datetime
