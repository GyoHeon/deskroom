from tempfile import NamedTemporaryFile
from typing import IO

import pandas as pd

from deskroom.common.openai import create_openai_client, read_prompt


async def save_file(file: IO):
    with NamedTemporaryFile("wb", delete=False) as tempfile:
        tempfile.write(file.read())
        return tempfile.name


async def process_raw_file(df: pd.DataFrame):
    chatids = []
    persontypes = []
    utterances = []

    df = df.dropna()

    current_chat = ""

    for chat_id in list(df["chatId"].unique()):
        df_ = df.loc[df["chatId"] == chat_id]
        current_speaker = ""
        current_text = ""
        for idx in range(len(df_)):
            speaker = df_.iloc[idx]["personType"]
            txt_str = df_.iloc[idx]["plainText"]

            if speaker != current_speaker:
                if current_speaker != "":
                    utterances.append(current_text)
                    persontypes.append(current_speaker)
                    chatids.append(chat_id)
                current_speaker = speaker
                current_text = txt_str
            else:
                current_text += f" {txt_str}"

        utterances.append(current_text)
        persontypes.append(current_speaker)
        chatids.append(chat_id)

    out_df = pd.DataFrame(
        {"chatId": chatids, "person_types": persontypes, "utterances": utterances}
    )
    return out_df


async def generate_discovery_string(df: pd.DataFrame):
    strings = "chatId | person_types | utterances\n"
    for idx in range(len(df)):
        try:
            row_instance = df.iloc[idx]
            chat_id = row_instance["chatId"]
            person_type = row_instance["person_types"]
            utterance = row_instance["utterances"]
            tmp_str = f"{chat_id} | {person_type} | {utterance}\n"
            strings += tmp_str
        except BaseException:
            pass
    return strings


async def generate_qa_string(df: pd.DataFrame, chatid: str):
    tmp_df = df[df["chatId"] == chatid]

    conversation_str = "speaker | utterance\n"
    for idx in range(len(tmp_df)):
        tmp_str = (
            f"{tmp_df.iloc[idx]['person_types']} | {tmp_df.iloc[idx]['utterances']}\n"
        )
        conversation_str += tmp_str

    return conversation_str


async def create_policy(chat_logs: str):
    prompt = read_prompt("create_policy.txt")
    openai_client = create_openai_client(asynchronous=True)
    response = await openai_client.chat.completions.create(
        model="gpt-4-turbo-preview",
        messages=[
            {
                "role": "system",
                "content": prompt % (chat_logs),
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


async def create_qa(policy: str, conversation: str):
    prompt = read_prompt("create_qa.txt")
    openai_client = create_openai_client(asynchronous=True)
    response = await openai_client.chat.completions.create(
        model="gpt-4-turbo-preview",
        messages=[
            {
                "role": "system",
                "content": prompt % (policy, conversation),
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
