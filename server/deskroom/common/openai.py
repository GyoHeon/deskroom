import os
from pathlib import Path

from openai import AsyncAzureOpenAI, AsyncOpenAI, AzureOpenAI, OpenAI

from deskroom.config import settings
from deskroom.constants import PROMPT_PATH

from .azure import create_azure_service_client


def create_azure_openai_async_client(
    api_key: str, azure_endpoint: str, api_version: str
) -> AsyncAzureOpenAI:
    return AsyncAzureOpenAI(
        api_key=api_key, azure_endpoint=azure_endpoint, api_version=api_version
    )


def create_azure_openai_sync_client(
    api_key: str, azure_endpoint: str, api_version: str
) -> AzureOpenAI:
    return AzureOpenAI(
        api_key=api_key, azure_endpoint=azure_endpoint, api_version=api_version
    )


def create_openai_async_client(api_key: str) -> AsyncOpenAI:
    return AsyncOpenAI(api_key=api_key)


def create_openai_sync_client(api_key: str) -> OpenAI:
    return OpenAI(api_key=api_key)


def create_openai_client(asynchronous: bool = False) -> AsyncOpenAI | OpenAI:
    if asynchronous:
        return create_openai_async_client(api_key=settings.OPENAI_API_KEY)
    return create_openai_sync_client(api_key=settings.OPENAI_API_KEY)


def create_azure_openai_client(
    asynchronous: bool = False,
) -> AsyncAzureOpenAI | AzureOpenAI:
    if asynchronous:
        return create_azure_openai_async_client(
            api_key=settings.AZURE_OPENAI_API_KEY,
            azure_endpoint=settings.AZURE_OPENAI_ENDPOINT,
            api_version=settings.AZURE_OPENAI_API_VERSION,
        )
    return create_azure_openai_sync_client(
        api_key=settings.AZURE_OPENAI_API_KEY,
        azure_endpoint=settings.AZURE_OPENAI_ENDPOINT,
        api_version=settings.AZURE_OPENAI_API_VERSION,
    )


def download_prompts() -> None:
    blob_service_client = create_azure_service_client()

    container_client = blob_service_client.get_container_client(container="prompts")
    prompt_list = container_client.list_blobs()
    for prompt in prompt_list:
        blob_client = blob_service_client.get_blob_client(
            container="prompts", blob=prompt["name"]
        )
        with open(file=PROMPT_PATH / prompt["name"], mode="wb") as prompt_blob:
            download_stream = blob_client.download_blob()
            prompt_blob.write(download_stream.readall())


def read_prompt(txt_file_from_prompts_dir: str | Path) -> str:
    if not os.path.exists(PROMPT_PATH / txt_file_from_prompts_dir):
        raise FileNotFoundError(f"{txt_file_from_prompts_dir} Prompt File Not Found")
    else:
        with open(PROMPT_PATH / txt_file_from_prompts_dir) as file:
            prompt_file = file.readlines()
        prompt = "\n".join(prompt_file)

    return prompt
