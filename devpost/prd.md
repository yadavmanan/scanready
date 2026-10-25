---
doc: prd
status: approved
---

# ScanReady — Product Requirements

A calm, patient-side guide that turns a bundle of imaging-appointment documents into a short, source-cited plan, finds what is blocking the patient, and drafts the request that fixes it. Built for a scared, confused patient (demo patient: Anita, 40) on a phone.
Source: `scope.md > The Unique Kernel`, `scope.md > Who It's For`.

## The Core Journey
Source: `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`.

1. Anita opens ScanReady on her phone and sees **My Scan**: a short, reassuring welcome and a way to add her appointment documents. The demo uses the fictional bundle in `docs/` (referral, appointment email, prep guide, accessibility info, insurance letter).
2. She adds the documents. ScanReady reads them and shows **Your plan**: "MRI: Thursday 29 Oct, 10:30 AM", with the things she needs to do, each linked to the document it came from.
3. ScanReady summarizes: "You don't need to solve all of this. You have N blockers." Each blocker is a card with a status label.
4. In **What's blocking you?** she says what is making this hard (e.g. wheelchair access, needing another language, transportation).
5. In **Fix the blocker**, ScanReady drafts a plain request to the imaging center for that blocker. She can copy it.
6. At any point she can ask a question. If the documents answer it, ScanReady answers with a citation. If not (e.g. medication), it says it can't safely tell from the documents and gives the exact question to ask the imaging center.
7. Success: she ends with a plan she understands, at least one drafted request, and a clear view of what is done, waiting, and still needs action.

## Screens and Layout
Source: playbook section 5 (screens 1-4) and section 13 (care-journey layout); `scope.md > Inspiration & Identity`.

Mobile-first, single column, one action per card. Four screens:

1. **My Scan**: welcome line, the list of documents added, and one primary button to build the plan.
2. **Your plan**: appointment headline, then task cards (what to do, source citation). Includes the blocker count and an "Ask a question" entry. Care-journey status summary at top (e.g. "2 blockers, 5 completed").
3. **What's blocking you?**: a short list of selectable barriers (cannot read this easily; need another language; wheelchair or mobility aid; hearing or communication needs; trouble remembering multi-step instructions; need transportation help; do not understand the insurance requirement; not sure what the center is asking; other).
4. **Fix the blocker**: for the chosen blocker, the drafted request and a copy button, plus the document it is grounded in.

Navigation: forward through the screens with a clear back action. No chat-box home screen.

## Look and Feel
Source: learner answer during `3-prd`; playbook section 13.

- Mostly white and light, with one accent color. Clean, uncluttered, calm.
- No chat box as the main interaction, no floating AI orb, no generic purple gradients.
- Large, readable text; high contrast.
- Status shown with a text label and an icon, never color alone.
- Tone: reassuring, plain language, never alarming.
- Accent color and typeface are not chosen yet; `4-spec` proposes them within this direction.

## Features and Behavior

### Document intake
Source: `scope.md > The POC Boundary`.
- As Anita, I want to add my appointment documents in one place so I don't have to read five separate files.
  - [ ] The app can load the five sample documents from `docs/` and lists them by name on My Scan.
  - [ ] A button builds the plan from the documents shown.

### Grounded action plan
Source: `scope.md > The Unique Kernel`.
- As Anita, I want a short list of what I must do, so I know exactly what's next.
  - [ ] The plan headline shows the study, date, time, and arrival time from the documents (MRI, Thursday 29 Oct, 10:30 AM, arrive by 10:00 AM).
  - [ ] Every task card names the source document it came from.
  - [ ] No task contains information that is not in the documents.
  - [ ] Where documents conflict or differ (e.g. arrival time wording), the plan shows the discrepancy rather than choosing silently.

### Blocker detection and fix
Source: `scope.md > The Core Loop`.
- As Anita, I want ScanReady to find what could stop me from getting the scan, and help me fix it.
  - [ ] The plan shows a blocker count and each blocker as its own card with a status label.
  - [ ] Choosing a barrier in "What's blocking you?" opens a drafted request for that barrier.
  - [ ] The drafted request asks the center to confirm; it never claims the center is accessible.
  - [ ] The drafted request can be copied to the clipboard.

### Safety: won't guess
Source: `scope.md > The Unique Kernel`, `scope.md > Explicitly Cut`.
- As Anita, I want honest answers, so I can trust it.
  - [ ] Asking "Can I take my medication before this MRI?" returns a reply that the documents don't answer this, that ScanReady won't guess, and the exact question to ask the imaging center.
  - [ ] Asking something the documents do answer (e.g. "Do I need to fast?") returns the answer with a source citation.
  - [ ] ScanReady never gives diagnosis, medication, contrast, implant, or fasting advice beyond what the documents state.

### Accessibility basics
Source: `scope.md > Inspiration & Identity`.
  - [ ] Everything on every screen can be used with a keyboard.
  - [ ] Interactive elements have screen-reader labels.
  - [ ] Text stays usable at 200% scaling.
  - [ ] Status is understandable without color.

## States and Boundaries
- **First use / before building** — My Scan shows the documents list and the build button; no plan exists yet.
- **Normal use** — Plan, blockers, and drafted requests appear as described above.
- **No blockers selected** — "What's blocking you?" lets the user continue without picking; no request is drafted.
- **Question the documents can't answer** — Safety reply as above, with a suggested question for the center.
- **Persistence** — Nothing is saved between sessions in the POC (see Deferred).
- **Data boundary** — Fictional documents only; no real patient data.

## Product Decisions
- Patient-first, calm, plain-language experience — the learner wants patients who are scared and confused to have "someone calm and better to deal with".
- The playbook defines the product (screens, task cards, citations, safety rule) — the learner said everything is defined there.
- Trusted-person sharing is out of the POC — learner: "leave this part, to be implemented later".
- Handling unreadable or blurry uploads is out of the POC — learner: not needed currently.
- Sample documents live in `docs/` — learner asked for a `docs/` directory of sample PDFs.
- Look: mostly white with one accent color, clean and uncluttered — learner's direction.
- Demo patient age is 40 — learner's statement (playbook said 61).

## What We're Building
- My Scan, Your plan, What's blocking you?, and Fix the blocker screens.
- Reading the five sample documents into a source-cited plan.
- Blocker cards and drafted, copyable requests to the imaging center.
- Question answering with the "won't guess" path.
- Accessibility basics and the light, clean visual direction.

## Deferred From the POC
- Trusted-person sharing of one blocked task (the playbook's "I still need help" screen): deferred by the learner.
- Handling blurry, unreadable, or incomplete uploads: deferred by the learner.
- Uploading arbitrary user files or taking photos: the POC uses the sample bundle.
- Saving anything between sessions: not needed to prove the core loop.

## Possible Later Enhancements
- Translation and read-aloud.
- Sending requests by email and tracking replies.
- Insurance and cost help.
- Multiple appointments over time.

## Non-Goals
- No diagnosis, medication, contrast, implant, or fasting advice (clinical risk).
- No hospital system integration or insurance portal automation (time and demo dependency).
- No real patient data (privacy and safety).

## Open Questions
- **Own files vs. sample bundle only** — Assumption: the POC uses the sample bundle from `docs/`. Can be settled in `4-spec`.
- **Accent color and typeface** — To be proposed in `4-spec` within the stated direction. Can wait.
