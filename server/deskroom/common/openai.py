from pathlib import Path

from openai import AsyncAzureOpenAI, AsyncOpenAI, AzureOpenAI, OpenAI

from deskroom.config import settings
from deskroom.constants import PROMPT_PATH

from .azure import create_azure_container_client


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


def read_prompt(txt_file_from_prompts_dir: str | Path) -> str:
    if settings.ENV == "local":
        with open(PROMPT_PATH / txt_file_from_prompts_dir) as file:
            prompt_file = file.readlines()
        prompt = "\n".join(prompt_file)
    else:
        container_client = create_azure_container_client("prompts")
        byte_data = container_client.download_blob(str(txt_file_from_prompts_dir))
        prompt = byte_data.readall().decode("utf-8")

    return prompt
