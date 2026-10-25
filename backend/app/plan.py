import json
import re
from pathlib import Path

from . import ai
from .documents import load_documents
from .models import Plan

CACHE = Path(__file__).resolve().parents[1] / "cache" / "plan.json"

SYSTEM = """You are ScanReady, a calm assistant that helps a patient get to a diagnostic imaging appointment.
You reorganize the patient's documents into a plan. You never add medical knowledge of your own.

Rules:
- Use ONLY facts stated in the documents. If the documents do not say it, do not include it.
- Every task and blocker needs source_doc_id (the document id, e.g. 03_mri_preparation_guide.pdf) and a quote:
  a short passage copied EXACTLY, word for word, from that document.
- Write in plain, warm, short sentences for a worried person. No medical advice, no diagnosis.
- tasks: the concrete things the patient must do or know before and on the day (arrival, what to bring, clothing,
  food/drink rules exactly as stated (including when no fasting is required), safety screening, insurance approval, transportation if mentioned).
  status: "Needs action" for things the patient must do, "Waiting" for things pending with someone else,
  "Completed" for things already done, "Needs human confirmation" when the center must confirm.
- blockers: non-clinical barriers that could stop this patient reaching the scan, given what the documents say about
  the patient (language, mobility, communication), the center's accessibility info (things offered only on request,
  must be confirmed in advance), and insurance (pending approval, possible cost). Use status "Needs human confirmation"
  or "Needs action". Do not invent barriers unsupported by the documents.
- discrepancies: places where documents give different or differently worded information (e.g. arrival times).
  Include source_doc_ids for each. Leave empty if none.
- headline: study, date, time of appointment, and arrive_by, as stated in the appointment email.
"""


def _norm(text: str) -> str:
    return re.sub(r"\s+", " ", text.replace("\u2019", "'").replace("\u201c", '"').replace("\u201d", '"')).strip().casefold()


def _grounded(items, docs_by_id):
    kept = []
    for item in items:
        doc = docs_by_id.get(item.source_doc_id)
        if doc and item.quote and _norm(item.quote) in _norm(doc["text"]):
            kept.append(item)
    return kept


def _live_plan() -> Plan:
    docs = load_documents()
    docs_by_id = {d["id"]: d for d in docs}
    corpus = "\n\n".join(f"=== DOCUMENT id={d['id']} title={d['title']} ===\n{d['text']}" for d in docs)
    plan = ai.parse(SYSTEM, corpus, Plan)
    plan.tasks = _grounded(plan.tasks, docs_by_id)
    plan.blockers = _grounded(plan.blockers, docs_by_id)
    plan.discrepancies = [x for x in plan.discrepancies if x.source_doc_ids and all(i in docs_by_id for i in x.source_doc_ids)]
    return plan


def build_plan() -> dict:
    last_error = None
    for _ in range(2):
        try:
            plan = _live_plan()
            data = plan.model_dump()
            CACHE.parent.mkdir(exist_ok=True)
            CACHE.write_text(json.dumps(data, indent=2), encoding="utf-8")
            return {"source": "live", "plan": data}
        except Exception as exc:
            last_error = exc
    if CACHE.exists():
        return {"source": "saved", "plan": json.loads(CACHE.read_text(encoding="utf-8")), "note": f"{type(last_error).__name__}"}
    raise last_error
