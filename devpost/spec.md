---
doc: spec
status: approved
---

# ScanReady — Technical Spec

## How This Works, In Plain Language
ScanReady is one small Python program (the **backend**) that also serves a plain HTML/CSS/JS web page (the **frontend**). The backend reads the five sample PDFs in `docs/`, pulls out their text, and sends that text to OpenAI's `gpt-5.4-mini` with strict instructions: only use what is in the documents, cite which document each fact came from, and say "I can't tell from these documents" otherwise. OpenAI's reply is returned as structured data (a plan, a list of blockers, a drafted request, or an answer), and the web page shows it as calm cards.

The OpenAI key stays on the backend in a local `.env` file, never in the web page and never in the repo. Nothing is saved between sessions: the page holds the current plan in memory.

Why this shape: one process, no database, no build step, and the AI is used only for the parts that need language understanding.

## The Core Journey Through the System
PRD ref: `prd.md > The Core Journey`.

1. Anita opens the page. The page asks the backend for the document list (`GET /api/documents`) and shows it on **My Scan**.
2. She presses build. The page calls `POST /api/plan`. The backend extracts text from each PDF, sends it to OpenAI, validates the structured reply, and returns the plan: headline, task cards with citations, discrepancies, and blockers.
3. **Your plan** renders the headline, cards, and blocker count.
4. In **What's blocking you?** she picks a barrier. The page calls `POST /api/request`; the backend asks OpenAI to draft a grounded request and returns it, shown in **Fix the blocker** with a copy button.
5. At any point she asks a question (`POST /api/ask`). The backend returns either a cited answer or the "won't guess" reply with a suggested question for the center.

## Stack
- **Frontend:** plain HTML, CSS, and JavaScript, served as static files (learner's choice, no framework or build step).
- **Backend:** Python 3.13 in the virtual environment `backend/.venv` (learner's choice).
- **Web framework:** FastAPI with Uvicorn, a recommendation (small, serves static files and JSON in one process). Docs: https://fastapi.tiangolo.com/
- **PDF text:** PyMuPDF, a recommendation. Docs: https://pymupdf.readthedocs.io/
- **AI:** OpenAI API, model `gpt-5.4-mini` (learner's choice), via the official `openai` Python SDK with structured outputs. Docs: https://platform.openai.com/docs
- **Validation:** Pydantic models for every AI reply.

Unverified: the exact model identifier `gpt-5.4-mini` and its structured-output support must be checked in the first build step against the learner's key.

## Where It Runs and How Someone Tries It
- Runs locally, in the browser, against a local backend. Requires Python 3.13, the virtual environment, and an OpenAI API key in `backend/.env` (`OPENAI_API_KEY=...`). A secret-free `backend/.env.example` is committed.
- Start (exact command confirmed in build): from `backend/`, `.venv\Scripts\python.exe -m uvicorn app.main:app --port 8000`, then open `http://localhost:8000`.
- The demo video is recorded from this local run. Submission needs a short demo video and a public GitHub repository. Deployment is optional and not planned.

## Look and Feel
PRD ref: `prd.md > Look and Feel`.
- White and very light grey surfaces with one calm accent color (proposed: a soft teal-blue). Final accent and typeface are proposed in the first UI build step for the learner's approval.
- Typeface: a clear, friendly sans-serif with large base size (about 18px) and generous spacing.
- Mobile-first single column, one action per card, spacious and calm.
- Status labels are text plus icon: Completed, Waiting, Needs action, Needs human confirmation.
- Copy is reassuring and plain; no chat-box home, no AI orb, no purple gradients.
- Accessibility: semantic HTML, visible focus states, labeled controls, usable at 200% zoom.

## Components

### Document loader
Lists `docs/*.pdf` and extracts text per document.
PRD ref: `prd.md > Document intake`.

### Plan extractor
Sends document text to OpenAI and returns a validated plan: headline (study, date, time, arrival), task cards each with a source document and quote, discrepancies, and blockers.
PRD ref: `prd.md > Grounded action plan`.

### Blocker resolver and request drafter
Given a chosen barrier and the documents, drafts a request that asks the center to confirm, with the grounding document.
PRD ref: `prd.md > Blocker detection and fix`.

### Question answerer (safety path)
Answers only from the documents with a citation. If the documents don't answer, returns the fixed "won't guess" reply and the exact question to ask. A fixed system prompt forbids diagnosis, medication, contrast, implant, and fasting advice beyond the documents.
PRD ref: `prd.md > Safety: won't guess`.

### Frontend screens
My Scan, Your plan, What's blocking you?, Fix the blocker, plus the ask-a-question panel.
PRD ref: `prd.md > Screens and Layout`, `prd.md > Accessibility basics`.

## Data Model
- **Documents:** the five PDFs in `docs/`, read from disk on each plan build.
- **Plan, blockers, drafted requests:** JSON returned by the backend and held in browser memory. Closing the page clears it (PRD: nothing persists).
- **Fallback plan:** `backend/cache/plan.json`, a saved copy of one real live result (see Failure Modes). Labeled as a saved sample result in the UI when used.

## File Structure
```
2/
├── docs/                  # Fictional sample PDFs
├── devpost/               # Devpost learning workspace
├── backend/
│   ├── .venv/             # Virtual environment (git-ignored)
│   ├── .env               # Local API key (git-ignored)
│   ├── .env.example       # Secret-free template
│   ├── requirements.txt
│   ├── cache/plan.json    # Saved fallback result
│   └── app/
│       ├── main.py        # FastAPI app, routes, static serving
│       ├── documents.py   # Document loader
│       ├── ai.py          # OpenAI calls and prompts
│       └── models.py      # Pydantic schemas
└── frontend/
    ├── index.html
    ├── styles.css
    └── app.js
```

## External Services and Dependencies
- **OpenAI API** (`gpt-5.4-mini`): called by the backend with document text. Needs an API key. Usage costs apply and rate limits exist. Docs: https://platform.openai.com/docs
- Python packages: fastapi, uvicorn, openai, pymupdf, pydantic, python-dotenv.
- Privacy note: only the fictional sample documents are sent to OpenAI.

## Important Failure Modes
- **OpenAI call fails or no key** → the UI shows a calm message and, for the plan, loads the saved fallback result, clearly labeled as a saved sample.
- **AI returns data that doesn't match the schema** → one retry; then the same calm message.
- **AI invents something not in the documents** → every task requires a source document and quote; the backend drops items whose quote isn't found in the source text.

## What Was Simplified and Why
- **Fixed sample bundle** instead of arbitrary uploads — matches the PRD decision and avoids upload and bad-file handling.
- **No database or accounts** — nothing needs to persist to prove the core loop.
- **Request drafts are copied, not sent** — no email integration in the POC.
- **Trusted-person sharing omitted** — deferred in PRD and scope.

## Decisions and Open Issues
Decisions:
- Plain HTML/CSS/JS frontend — learner's choice.
- Python backend in a virtual environment — learner's choice.
- OpenAI `gpt-5.4-mini` — learner's choice.
- FastAPI, PyMuPDF, Pydantic, and live extraction with a saved fallback — my recommendations, accepted by the learner at spec review ("good").

Learner uncertainty: not identified; none recorded.

Open:
- Verify the `gpt-5.4-mini` identifier and structured-output support in the first build step.
- Accent color and typeface: proposed in the first UI step, per `prd.md > Open Questions`.
