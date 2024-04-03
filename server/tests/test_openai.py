from pathlib import Path

from deskroom.common.openai import read_prompt
from deskroom.constants import PROMPT_PATH


def test_openai_read_prompt_should_load_prompt(tmpdir: Path) -> None:
    with open(PROMPT_PATH / tmpdir / "hello.txt", "w") as file:
        file.write("Hello, World!")
        file.write("This is a test prompt.")

    prompt = read_prompt(tmpdir / "hello.txt")
    assert "Hello, World!" in prompt
    assert "This is a test prompt." in prompt
