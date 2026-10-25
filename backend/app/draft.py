from . import ai
from .documents import load_documents
from .models import DraftRequest
from .plan import _norm

BARRIERS = [
    "I cannot read this easily",
    "I need another language",
    "I use a wheelchair or mobility aid",
    "I have hearing or communication needs",
    "I have trouble remembering multi-step instructions",
    "I need transportation help",
    "I don't understand the insurance requirement",
    "I am not sure what the center is asking me to do",
    "Other",
]

SYSTEM = """You help a worried patient write a short, polite message to their imaging center about one barrier
that could stop them from getting their scan. Write in the first person as the patient, in plain, warm language.

Rules:
- Mention the appointment (study, date, time) so the center knows which visit this is.
- Describe the patient's need and ASK the center to confirm what they can provide. Never claim or assume the center
  is accessible or already provides something; only ask, and you may mention what the center's own documents say it offers.
- Use ONLY facts in the documents. Do not add medical advice, clinical details, diagnoses, or insurance numbers.
- If the documents show a contact route (phone, email, deadline for requests), mention it so the patient knows where to send it.
- grounding: 1-3 items, each with source_doc_id and a quote copied EXACTLY, word for word, from that document,
  showing what the request relies on. If nothing in the documents supports the request, return an empty list.
- Keep the body under 120 words. subject is a short line.
"""


def draft_request(barrier: str, details: str = "") -> dict:
    if barrier not in BARRIERS:
        raise ValueError("Unknown barrier")
    docs = load_documents()
    docs_by_id = {d["id"]: d for d in docs}
    corpus = "\n\n".join(f"=== DOCUMENT id={d['id']} title={d['title']} ===\n{d['text']}" for d in docs)
    note = f"\nExtra detail from the patient: {details.strip()[:300]}" if details.strip() else ""
    user = f"{corpus}\n\n=== BARRIER ===\n{barrier}{note}"
    result = ai.parse(SYSTEM, user, DraftRequest)
    grounding = [
        g
        for g in result.grounding
        if g.source_doc_id in docs_by_id and _norm(g.quote) in _norm(docs_by_id[g.source_doc_id]["text"])
    ]
    data = result.model_dump()
    data["grounding"] = [
        {"source_doc_id": g.source_doc_id, "title": docs_by_id[g.source_doc_id]["title"], "quote": g.quote} for g in grounding
    ]
    return data
