# ScanReady

**A calm, patient-side AI guide that gets someone from an imaging referral to actually having the scan.**

Built for the Devpost **Build With AI: Basics** hackathon, using the plan-first skill pack end to end: *start → scope → PRD → spec → build → ship*.

> ScanReady is a demo built on fictional documents. It is not medical advice and is not a medical device.

---

## The problem

Imagine Anita, 40, who has been told she needs an MRI. She is worried, a little confused, and she has five papers: a referral, an appointment email, a prep guide, an accessibility sheet and an insurance letter. Somewhere across them is *when to arrive, what to do beforehand, and what could stop her from getting there*. A scan can slip away over something small, such as an unclear instruction, a language barrier or a mobility need nobody asked about, even when the patient cares a great deal.

## What ScanReady does

1. **Reads the documents** (the sample bundle in [`docs/`](docs)) and builds **Your plan**: the appointment headline, a short list of tasks, and the things that might block her. **Every item quotes the document it came from.**
2. **Spots disagreements between documents.** In the demo bundle the email says to arrive at 10:00 AM while the prep guide says 30 minutes before 10:30 AM. ScanReady flags it as *worth double-checking* instead of picking one silently.
3. **Turns a blocker into action.** Anita says what is making it hard (wheelchair access, another language, transport and so on) and ScanReady **drafts a plain request to the imaging center**, with the source quotes it is based on and a copy button. It never sends anything for her.
4. **Answers questions honestly.** Ask "Do I need to fast?" and get a cited answer. Ask about medication, a pacemaker or a contrast allergy and, because the documents are silent, ScanReady says so and **hands her the exact question to ask the center**. It will not guess at medical instructions.

The look is calm on purpose: mostly white, one teal accent, large text, status labels that use text as well as icons, keyboard and screen-reader friendly, and usable on a phone.

## Why you can trust the output (the safety design)

The safety rules are enforced in **code**, not only in the prompt:

| Rule | Where it's enforced |
|---|---|
| Every task, blocker and citation must quote text that really exists in its source document, or it is dropped | `backend/app/plan.py` → `_grounded`, `_norm` |
| If the model says the documents don't answer, or no citation matches, the answer is replaced by a fixed "I can't safely tell from your documents" reply plus a question for the center | `backend/app/ask.py` → `WONT_GUESS` |
| Drafted requests *ask the center to confirm*; they never state medical facts | `backend/app/draft.py` |
| If the live AI call fails, a clearly labeled saved plan is shown so the demo never breaks | `backend/app/plan.py` → `build_plan`, `backend/cache/plan.json` |

---

## How we used the Devpost skills (the main point of this project)

The hackathon's goal was to learn to build with AI **plan-first**: decide *what* and *why* before any code. We followed the skill pack's six stages in order, and each stage left a reviewed artifact in [`devpost/`](devpost). Nothing was built until the plan before it was approved.

| Stage | What the skill did | What we produced |
|---|---|---|
| **1. Start** | Interviewed us about experience, goal and how we like to review work | A private learner profile (kept out of the repo) |
| **2. Scope** | Forced a single "unique kernel" and a real patient | [`devpost/scope.md`](devpost/scope.md) |
| **3. PRD** | Turned the scope into screens, behaviors, states and acceptance criteria, including the *won't-guess* safety rule and accessibility basics | [`devpost/prd.md`](devpost/prd.md) |
| **4. Spec** | Chose the stack and architecture (FastAPI, PyMuPDF, Pydantic, OpenAI `gpt-5.4-mini`, plain HTML/CSS/JS) and defined each component | [`devpost/spec.md`](devpost/spec.md) |
| **5. Build** | Cut the spec into **5 vertical slices**, each with a mechanical verification step and its own commit | [`devpost/checklist.md`](devpost/checklist.md) and the git history |
| **6. Ship** | README, license, secrets check, publishing | This repository |

### Plan first, then build in verified slices

The build checklist is the real record of the process. Each slice names the PRD and spec sections it implements, how it was verified, and its commit:

1. **Run and read**: the app serves the page, lists the five PDFs, confirms OpenAI works.
2. **Your plan (the kernel)**: a grounded, cited plan. Verified by checking zero ungrounded quotes and the arrival-time discrepancy being caught, and by forcing an invalid key to prove the saved fallback works.
3. **Blockers**: a chosen barrier becomes a drafted request. Verified for three barriers and the 400 on an unknown one.
4. **Safety**: cited answers and the won't-guess path. Verified with fasting and arrival-time questions (answered with citations) and medication, pacemaker and contrast-allergy questions (declined safely).
5. **Calm, accessible look**: verified with a keyboard-only walkthrough, accessible names on every control, phone width and 200% text size. The 200% check found long email addresses overflowing the cards at 320px; we fixed it with word wrapping and re-checked.

### What the process caught

- **A real inconsistency in the inputs.** Because the PRD said "plan with citations", the plan step surfaced the 10:00 vs 10:30 arrival-time conflict instead of hiding it.
- **A deployment mismatch.** Port 8000 was already taken on the build machine, so the dev port moved to 8010; this was recorded under *Revisions* in the checklist and in the spec rather than left as silent drift.
- **A skipped step, stated honestly.** The early hands-on checkpoint after slice 2 was skipped in fast mode and is noted as such in the checklist.

### Deferred on purpose (scope control)

Written down in the PRD so they were decisions, not omissions: trusted-person sharing, handling blurry or unreadable files, real uploads, and persistence between sessions.

### App map

[`devpost/app-map.html`](devpost/app-map.html) is a standalone, offline page that shows how one action ("Build my plan") flows through the code, where to start to change things, and a reusable practice from this project. Open it in any browser.

---

## Architecture

```
frontend/ (HTML, CSS, JS)        backend/app/ (FastAPI)                 external
┌──────────────────────┐   ┌─────────────────────────────────────┐   ┌──────────────┐
│ app.js: screens,     │──▶│ main.py   routes under /api         │   │ OpenAI       │
│ fetch, render, copy  │   │ documents.py  PyMuPDF text from PDFs │──▶│ gpt-5.4-mini │
│ styles.css: look     │◀──│ plan.py   prompt + grounding filter  │   │ (structured  │
└──────────────────────┘   │ draft.py  barrier → drafted request  │◀──│  output)     │
                           │ ask.py    cited answer / won't-guess │   └──────────────┘
                           │ ai.py, models.py  client + schemas   │
                           └─────────────────────────────────────┘
                                         docs/*.pdf  (fictional sample bundle)
```

| Endpoint | Purpose |
|---|---|
| `GET /api/documents` | List the sample documents |
| `POST /api/plan` | Build the grounded plan |
| `GET /api/barriers` | Barrier choices |
| `POST /api/request` | Draft a request for a barrier |
| `POST /api/ask` | Cited answer or won't-guess reply |
| `GET /api/ai-check` | Confirm the OpenAI connection |

## Run it locally

Requires Python 3.13 and an OpenAI API key.

```powershell
cd backend
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt
copy .env.example .env        # then put your own key in .env
.venv\Scripts\python.exe -m uvicorn app.main:app --port 8010
```

Open <http://localhost:8010>, then press **Build my plan**.

On macOS or Linux, use `.venv/bin/python` and `cp` instead. The `.env` file is git-ignored; never commit a key. With no valid key, the plan screen falls back to the saved plan in `backend/cache/plan.json` and labels it as saved.

## Run with Docker

From the repository root, build and run the combined frontend/backend container:

```powershell
docker build -t scanready .
docker run --rm -p 8010:8010 --env-file backend/.env scanready
```

Open <http://localhost:8010>. The container serves the frontend, API, and sample PDFs together. The API key is read at runtime from `backend/.env`; it is excluded from the Docker build context and is not copied into the image. If you do not have a key, omit `--env-file backend/.env`; the plan screen can use the labeled saved fallback.

## Try the demo

1. Open **My Scan** and press **Build my plan**. Note the headline, the discrepancy and the cited tasks.
2. Ask "Do I need to fast?" and then "Can I take my usual medication?" to see a cited answer and then the safe refusal.
3. Choose **What's making this hard?**, pick a barrier, and copy the drafted request.

## Repository layout

```
backend/app/     FastAPI app, AI calls, grounding and safety logic
backend/cache/   saved plan used as a labeled fallback
frontend/        plain HTML, CSS and JS
docs/            five fictional sample PDFs for the demo patient
devpost/         scope, PRD, spec, build checklist, app map (the plan-first record)
```

## License

[MIT](LICENSE)
