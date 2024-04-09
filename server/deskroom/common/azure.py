from azure.storage.blob import BlobServiceClient, ContainerClient

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
