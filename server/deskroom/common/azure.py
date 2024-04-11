from azure.storage.blob import BlobServiceClient, ContainerClient
from azure.storage.blob.aio import (
    BlobServiceClient as AsyncBlobServiceClient,
)
from azure.storage.blob.aio import (
    ContainerClient as AsyncContainerClient,
)

from deskroom.config import settings


def create_azure_service_client() -> BlobServiceClient:
    return BlobServiceClient(
        account_url=settings.AZURE_ACCOUNT_URL,
        credential=settings.AZURE_ACCOUNT_CREDENTIAL,
    )


def create_azure_container_client(
    container_name: str,
) -> ContainerClient:
    blob_client = create_azure_service_client()
    return blob_client.get_container_client(container_name)


async def create_azure_async_container_client(
    container_name: str,
) -> AsyncContainerClient:
    async with AsyncBlobServiceClient(
        account_url=settings.AZURE_ACCOUNT_URL,
        credential=settings.AZURE_ACCOUNT_CREDENTIAL,
    ) as client:
        return client.get_container_client(container_name)

__all__ = [
    "create_azure_container_client",
    "create_azure_service_client",
    "ContainerClient",
    "BlobServiceClient",
    "AsyncContainerClient",
    "AsyncBlobServiceClient",
]
