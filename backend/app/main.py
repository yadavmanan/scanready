from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles

from . import ai
from .documents import load_documents

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


app.mount("/", StaticFiles(directory=FRONTEND, html=True), name="frontend")
