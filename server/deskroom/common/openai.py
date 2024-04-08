from pathlib import Path
import os
from openai import AsyncOpenAI, OpenAI

from deskroom.config import settings
from deskroom.constants import PROMPT_PATH, AZURE_PROMPT_PATH
from azure.storage.blob import BlobClient


def create_openai_async_client(api_key: str) -> AsyncOpenAI:
    return AsyncOpenAI(api_key=api_key)


def create_openai_sync_client(api_key: str) -> OpenAI:
    return OpenAI(api_key=api_key)


def create_openai_client(asynchronous: bool = False) -> AsyncOpenAI | OpenAI:
    if asynchronous:
        return create_openai_async_client(api_key=settings.OPENAI_API_KEY)
    return create_openai_sync_client(api_key=settings.OPENAI_API_KEY)


def read_prompt(txt_file_from_prompts_dir: str | Path) -> str:
    if os.path.exists(txt_file_from_prompts_dir):
        with open(PROMPT_PATH / txt_file_from_prompts_dir) as file:
            prompt_file = file.readlines()
        prompt = "\n".join(prompt_file)
    else:
        blob_client = BlobClient.from_blob_url(
            f"{AZURE_PROMPT_PATH}/{txt_file_from_prompts_dir}?{settings.AZURE_PROMPT_TOKEN}"
        )
        byte_data = blob_client.download_blob()
        prompt = byte_data.readall().decode("utf-8")

    return prompt
