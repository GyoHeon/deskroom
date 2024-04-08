from deskroom.common.openai import create_openai_client
from deskroom.common.openai import read_prompt


async def retrieve_qns(policy: str, qa_db: str, user_qn: str) -> str:
    prompt = read_prompt(txt_file_from_prompts_dir="retrieval_prompt.txt")
    openai_client = create_openai_client(asynchronous=True)
    response = await openai_client.chat.completions.create(
        model="gpt-4-turbo-preview",
        messages=[
            {
                "role": "system",
                "content": prompt % (policy, qa_db, user_qn),
            }
        ],
        temperature=0,
        max_tokens=2024,
        top_p=1,
        frequency_penalty=0.0,
        presence_penalty=0.0,
        # stop = ["\n"]
    )
    return response.choices[0].message.content
