from pathlib import Path

from openai import AsyncOpenAI, OpenAI

from deskroom.config import settings
from deskroom.constants import PROMPT_PATH


def create_openai_async_client(api_key: str):
    return AsyncOpenAI(api_key=api_key)


def create_openai_sync_client(api_key: str):
    return OpenAI(api_key=api_key)


def create_openai_client(asynchronous: bool = False):
    if asynchronous:
        return create_openai_async_client(api_key=settings.OPENAI_API_KEY)
    return create_openai_sync_client(api_key=settings.OPENAI_API_KEY)


def read_prompt(txt_file_from_prompts_dir: str | Path) -> str:
    with open(PROMPT_PATH / txt_file_from_prompts_dir) as file:
        prompt_file = file.readlines()
    prompt = "\n".join(prompt_file)
    return prompt
