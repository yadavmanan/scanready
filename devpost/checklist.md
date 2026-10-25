---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

- [x] **1. The app runs, lists the five sample documents, and confirms OpenAI works**
  Becomes usable: Starting the server and opening `http://localhost:8000` shows My Scan with the five documents listed and a button, and a backend check confirms `gpt-5.4-mini` answers with structured output using your key.
  Why now: This is the riskiest unknown (model name, structured output, key setup, PDF text extraction), so we prove it first. Bootstrapping lives here, not in its own step.
  PRD ref: `prd.md > Document intake`, `prd.md > Screens and Layout` (My Scan)
  Spec ref: `spec.md > File Structure`, `spec.md > Document loader`, `spec.md > External Services and Dependencies`
  Build: Install fastapi, uvicorn, openai, pymupdf, pydantic, python-dotenv into `backend/.venv`; add `requirements.txt`, `.env.example`, `app/main.py` (static serving, `GET /api/documents`), `app/documents.py`, a minimal `frontend/index.html` for My Scan, and a small OpenAI connectivity check.
  Verify (mechanical): Start the server with no errors; `GET /api/documents` returns the five PDFs with non-empty extracted text; the OpenAI check returns a valid structured reply from `gpt-5.4-mini`.
  Learner check: Put your key in `backend/.env`, start the server, open the page, and see the five documents listed.
  Commit: `Add backend scaffold, document loader and My Scan`

- [x] **2. Your plan: a grounded, cited plan from the documents (the kernel)**
  Becomes usable: Pressing the button on My Scan shows Your plan: the MRI headline, task cards each naming its source document, any discrepancies, and a blocker count.
  Why now: The unique kernel (reorganizing real instructions without inventing any) comes early. Everything else builds on this plan.
  PRD ref: `prd.md > Grounded action plan`, `prd.md > The Core Journey` (steps 1-3)
  Spec ref: `spec.md > Plan extractor`, `spec.md > Data Model`, `spec.md > Important Failure Modes`
  Build: Add Pydantic schemas, the plan prompt and `POST /api/plan`, drop any item whose source quote isn't found in the document text, save one real result to `backend/cache/plan.json` and use it as a labeled fallback; render Your plan in the page.
  Verify (mechanical): `POST /api/plan` returns a schema-valid plan with headline Thursday 29 Oct, 10:30 AM, arrive by 10:00 AM; every task has a source document and a quote found in that document; forcing an API failure returns the labeled fallback.
  Learner check: Press build and check that each card's source is correct and nothing appears that isn't in the documents.
  Commit: `Add grounded plan extraction and Your plan screen`

- [x] **3. Blockers: choose a barrier and get a drafted request**
  Becomes usable: From Your plan you open What's blocking you?, pick a barrier, and Fix the blocker shows a drafted request to the imaging center that you can copy.
  Why now: This is the second half of the core loop and the main way ScanReady helps beyond reading documents.
  PRD ref: `prd.md > Blocker detection and fix`, `prd.md > Screens and Layout`
  Spec ref: `spec.md > Blocker resolver and request drafter`
  Build: Add `POST /api/request`, the barrier list screen, and the Fix the blocker screen with copy button and grounding document; requests ask the center to confirm and never claim accessibility.
  Verify (mechanical): For the wheelchair-access and language barriers, the endpoint returns a request that asks for confirmation and cites the accessibility document; the copy button puts the text on the clipboard.
  Learner check: Pick "wheelchair or mobility aid", read the drafted request, and copy it.
  Commit: `Add blocker selection and drafted requests`

- [x] **4. Safety: ask a question and get an honest answer**
  Becomes usable: You can ask a question; if the documents answer it you get a cited answer, and if not, ScanReady says it won't guess and gives the exact question to ask the center.
  Why now: This is the trust moment in the demo and the guardrail for everything above.
  PRD ref: `prd.md > Safety: won't guess`
  Spec ref: `spec.md > Question answerer (safety path)`
  Build: Add `POST /api/ask` with a fixed safety prompt and the ask-a-question panel on Your plan; unanswered questions return the fixed won't-guess reply plus a suggested question.
  Verify (mechanical): "Do I need to fast?" returns "no fasting required" with a citation to the prep guide; "Can I take my medication before this MRI?" returns the won't-guess reply with a suggested question and no medical advice.
  Learner check: Ask both questions and say whether the answers feel trustworthy.
  Commit: `Add cited answers and won't-guess safety path`

- [x] **5. Calm, accessible look and feel**
  Becomes usable: The whole journey looks the way you described: mostly white, clean, one accent color, large readable text, text-plus-icon status labels, keyboard and screen-reader friendly.
  Why now: Functionality is proven by now, so styling can be judged on the real screens.
  PRD ref: `prd.md > Look and Feel`, `prd.md > Accessibility basics`
  Spec ref: `spec.md > Look and Feel`, `spec.md > Frontend screens`
  Build: Propose an accent color and typeface for your approval, then style all screens mobile-first; add focus states, labels, status icons with text, and 200% zoom support.
  Verify (mechanical): Walk the full journey by keyboard only; check that every control has an accessible label; confirm the layout works at a phone width and at 200% zoom.
  Learner check: Go through the whole demo on your phone-sized window and say what feels cluttered or unclear.
  Commit: `Apply calm accessible styling`

## Hands-on Checkpoints

- [ ] Early usable behavior explored: after slice 2 (the plan, the kernel)
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: not started
Route and stops: not started
Edit outcome: not started
Reflection: not started
Activity mode: not started

## Revisions

- Dev server runs on port 8010 instead of 8000 — another unrelated process already listens on port 8000 on this machine.
