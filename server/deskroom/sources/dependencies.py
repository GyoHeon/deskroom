from deskroom.common.azure import (
    ContainerClient,
    create_azure_container_client,
)

SOURCE_CONTAINER_NAME = "deskroom-files"


def create_source_azure_container_client() -> ContainerClient:
    return create_azure_container_client(container_name=SOURCE_CONTAINER_NAME)
