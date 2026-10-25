from . import ai
from .documents import load_documents
from .models import Answer
from .plan import _norm

WONT_GUESS = (
    "I can't safely determine this from the instructions you uploaded, so I won't guess. "
    "Here is the exact question to ask your imaging center or your referring clinician."
)

SYSTEM = """You answer a patient's question about their imaging appointment using ONLY the documents provided.
You are not a clinician and you must never give medical advice.

Rules:
- Set answered_by_documents=true ONLY if the documents directly state the answer. Then write a short, plain answer that
  restates only what the documents say, and give 1-3 citations, each with source_doc_id and a quote copied EXACTLY,
  word for word, from that document.
- If the documents do not directly answer the question, set answered_by_documents=false, leave answer empty and
  citations empty. This applies to ANY question about medication, contrast, implants or devices being safe, allergies,
  pregnancy, symptoms, diagnosis, results, or anything clinical that the documents do not explicitly state.
  Do not use general medical knowledge. Do not reassure or advise.
- question_for_center: always write one clear, polite question the patient can ask their imaging center or clinician
  about exactly what they asked. Use the patient's own concern; do not add facts.
"""


def ask(question: str) -> dict:
    question = question.strip()[:500]
    if not question:
        raise ValueError("Empty question")
    docs = load_documents()
    docs_by_id = {d["id"]: d for d in docs}
    corpus = "\n\n".join(f"=== DOCUMENT id={d['id']} title={d['title']} ===\n{d['text']}" for d in docs)
    result = ai.parse(SYSTEM, f"{corpus}\n\n=== PATIENT QUESTION ===\n{question}", Answer)

    citations = [
        {"source_doc_id": c.source_doc_id, "title": docs_by_id[c.source_doc_id]["title"], "quote": c.quote}
        for c in result.citations
        if c.source_doc_id in docs_by_id and _norm(c.quote) in _norm(docs_by_id[c.source_doc_id]["text"])
    ]
    if result.answered_by_documents and result.answer.strip() and citations:
        return {"answered": True, "answer": result.answer, "citations": citations, "question_for_center": result.question_for_center}
    return {"answered": False, "answer": WONT_GUESS, "citations": [], "question_for_center": result.question_for_center}
