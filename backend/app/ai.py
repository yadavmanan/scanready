import os
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

MODEL = os.getenv("OPENAI_MODEL", "gpt-5.4-mini")


class Ping(BaseModel):
    ok: bool
    message: str


def client() -> OpenAI:
    if not os.getenv("OPENAI_API_KEY"):
        raise RuntimeError("OPENAI_API_KEY is not set in backend/.env")
    return OpenAI()


def parse(system: str, user: str, schema: type[BaseModel]):
    response = client().responses.parse(
        model=MODEL,
        input=[
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        text_format=schema,
    )
    return response.output_parsed


def check() -> dict:
    result = parse("Reply with ok=true and a short greeting.", "ping", Ping)
    return {"model": MODEL, "reply": result.model_dump()}
