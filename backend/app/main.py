from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from . import ai
from .ask import ask as answer_question
from .documents import load_documents
from .draft import BARRIERS, draft_request
from .plan import build_plan

FRONTEND = Path(__file__).resolve().parents[2] / "frontend"

app = FastAPI(title="ScanReady")


@app.get("/api/documents")
def documents(include_text: bool = False):
    docs = load_documents()
    if include_text:
        return docs
    return [{"id": d["id"], "title": d["title"], "characters": len(d["text"])} for d in docs]


@app.get("/api/ai-check")
def ai_check():
    try:
        return ai.check()
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"{type(exc).__name__}: {exc}")


@app.post("/api/plan")
def plan():
    try:
        return build_plan()
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"{type(exc).__name__}: {exc}")


class RequestBody(BaseModel):
    barrier: str
    details: str = ""


@app.get("/api/barriers")
def barriers():
    return BARRIERS


@app.post("/api/request")
def request_draft(body: RequestBody):
    if body.barrier not in BARRIERS:
        raise HTTPException(status_code=400, detail="Unknown barrier")
    try:
        return draft_request(body.barrier, body.details)
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"{type(exc).__name__}: {exc}")


class AskBody(BaseModel):
    question: str


@app.post("/api/ask")
def ask_endpoint(body: AskBody):
    if not body.question.strip():
        raise HTTPException(status_code=400, detail="Please type a question")
    try:
        return answer_question(body.question)
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"{type(exc).__name__}: {exc}")


app.mount("/", StaticFiles(directory=FRONTEND, html=True), name="frontend")
