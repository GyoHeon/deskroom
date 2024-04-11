from deskroom.common.schema import Schema


class UploadSourcesOut(Schema):
    files: list[str]
    org_key: str
