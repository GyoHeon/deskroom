from azure.core.exceptions import ResourceExistsError
from fastapi import APIRouter, Depends, HTTPException, UploadFile

from deskroom.common.azure import ContainerClient
from deskroom.config import settings
from deskroom.sources.dependencies import (
    SOURCE_CONTAINER_NAME,
    create_source_azure_container_client,
)
from deskroom.sources.schema import UploadSourcesOut

router = APIRouter(prefix="/sources", tags=["sources"])


@router.get("/")
async def list_sources() -> list[str]:
    return []  # TODO: implement


@router.post("/upload", response_model=UploadSourcesOut)
async def upload_sources(
    org_key: str,
    files: list[UploadFile],
    azure_container_client: ContainerClient = Depends(
        create_source_azure_container_client
    ),  # TODO: replace this with async client
) -> dict[str, str | list[str]]:
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")

    container_path = f"{org_key}/sources"

    uploaded_files = []
    for file in files:
        # TODO: wrap this in a service
        path = f"{container_path}/{file.filename}"
        try:
            azure_container_client.upload_blob(path, file.file)
        except ResourceExistsError as e:
            raise HTTPException(
                status_code=400, detail=f"Upload failed for {path}: {e.message}"
            )
        uploaded_files.append(path)

    return {
        "files": [
            f"{settings.AZURE_ACCOUNT_URL}/{SOURCE_CONTAINER_NAME}/{upload_file}"
            for upload_file in uploaded_files
        ],  # TODO: return the full path
        "org_key": org_key,
    }
