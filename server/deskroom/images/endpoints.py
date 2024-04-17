from azure.core.exceptions import ResourceExistsError
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile
from fastapi.responses import JSONResponse

from deskroom.common.azure import ContainerClient
from deskroom.common.supabase import AsyncClient, create_supabase_async_client
from deskroom.config import settings
from deskroom.images.schema import UploadImageError, UploadImageOut
from deskroom.sources.dependencies import (
    SOURCE_CONTAINER_NAME,
    create_source_azure_container_client,
)

router = APIRouter(prefix="/images", tags=["images"])


@router.post(
    "/upload",
    responses={404: {"model": UploadImageError}},
    response_model=UploadImageOut,
)
async def upload_image(
    org_key: str,
    file: UploadFile,
    knowledge_base_id: str = Query(..., alias="question_id"),
    azure_container_client: ContainerClient = Depends(
        create_source_azure_container_client
    ),  # TODO: replace this with async client
    supabase: AsyncClient = Depends(create_supabase_async_client),
) -> UploadImageOut | JSONResponse:
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")

    image_response = (
        await supabase.table("knowledge_images")
        .select("*")
        .eq("org_key", org_key)
        .eq("file_name", file.filename)
        .execute()
    )
    if len(image_response.data) > 0:
        return image_response.data[0]

    insert_image_response = (
        await supabase.table("knowledge_images")
        .insert(
            [
                {
                    "org_key": org_key,
                    "file_name": file.filename,
                    "status": "CREATED",
                    "question_id": knowledge_base_id,
                }
            ]
        )
        .execute()
    )

    if not insert_image_response.data:
        return JSONResponse(
            status_code=404,
            content={
                "file_name": image_response.data[0]["file_name"],
                "org_key": org_key,
                "error": "Failed to insert image",
            },
        )

    container_path = f"{org_key}/sources"

    path = f"{container_path}/{file.filename}"
    try:
        azure_container_client.upload_blob(path, file.file)
    except ResourceExistsError as e:
        mark_image_failed_response = (
            await supabase.table("knowledge_images")
            .update({"status": "FAILED"})
            .eq("org_key", org_key)
            .eq("file_name", file.filename)
            .execute()
        )
        return JSONResponse(
            status_code=404,
            content={
                "file_name": mark_image_failed_response.data[0]["file_name"],
                "org_key": org_key,
                "error": f"Failed to upload image {e.message}",
            },
        )

    update_image_response = (
        await supabase.table("knowledge_images")
        .update(
            {
                "image_url": f"{settings.AZURE_ACCOUNT_URL}/{SOURCE_CONTAINER_NAME}/{path}",
                "status": "DONE",
            }
        )
        .eq("org_key", org_key)
        .eq("file_name", file.filename)
        .execute()
    )

    return update_image_response.data[0]
