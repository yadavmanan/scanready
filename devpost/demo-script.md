# ScanReady — 3-Minute Demo Script

Target length: **2:50** (leave a buffer; judges don't have to watch past 3:00).
Format: screen recording of the app in a **phone-width browser window** (about 390px wide), with your voice over it. A face camera is optional.

---

## Before you record (5 minutes)

1. Start the server from `backend/`: `.venv\Scripts\python.exe -m uvicorn app.main:app --port 8010`
2. Open `http://localhost:8010` in a browser window narrowed to phone width (DevTools device mode, or drag the window narrow). Zoom the browser to about 110% so text is readable in the video.
3. Run **Build my plan once** before recording to confirm your OpenAI key works. The live call takes a few seconds; you can trim the wait when editing.
4. Close other tabs, silence notifications, and hide any bookmarks bar or tokens.
5. Have these ready in separate tabs or windows:
   - `README.md` rendered on GitHub (the "How we used the Devpost skills" table)
   - `devpost/checklist.md` (the five ticked slices)
   - `devpost/app-map.html`
6. Practice the script out loud twice. Speak slowly and calmly. The product is about calm, so your voice should be too.

Recording tip: record the app in one take, and the README/checklist section separately. Join them in editing.

---

## The script

### 0:00–0:20 — The hook (show: title card, then the 5 PDFs)

**Show:** A plain title card "ScanReady" for 3 seconds, then open the `docs/` folder with the five PDFs visible.

**Say:**
> "This is Anita. She's 40, she's scared, and she's been told she needs an MRI. She has five papers: a referral, an email, a prep guide, an accessibility sheet and an insurance letter. Somewhere in there is what she must do, and what could stop her from getting to the scan. ScanReady helps her figure that out, calmly."

---

### 0:20–0:50 — My Scan → Build my plan (show: app, phone width)

**Show:**
1. The **My Scan** screen: "Hi Anita. Let's get you ready for your scan, one step at a time." with the five documents listed.
2. Click **Build my plan**. (Wait for the result; trim the wait when editing.)

**Say:**
> "Anita opens ScanReady on her phone. It already has her five documents. She presses one button: Build my plan."

---

### 0:50–1:30 — Your plan (show: scroll slowly through the plan screen)

**Show:**
1. The headline: **MRI, Thursday 29 October, 10:30 AM, arrive by 10:00 AM**.
2. The **Worth double-checking** card (arrival time conflict).
3. Scroll to **What needs your attention**: the insurance approval card with its **Needs human confirmation** label and the **Source** quote.

**Say:**
> "In seconds, she has one clear answer: her appointment, and when to arrive. And ScanReady noticed something she would have missed. The email says arrive at 10:00, but the prep guide says thirty minutes before. It doesn't pick one silently. It tells her to double-check.
>
> Every card shows the exact quote it came from, and which document. If the quote isn't really in the document, we throw the item away in code. Nothing is made up."

*Pause one second on a Source quote so viewers can read it.*

---

### 1:30–2:00 — Ask a question and the safety rule (show: the ask panel)

**Show:**
1. Type **"Do I need to fast?"** and submit. Show the cited answer.
2. Type **"Can I take my usual medication?"** and submit. Show the safe reply with the suggested question for the center.

**Say:**
> "She can ask anything. 'Do I need to fast?' The answer comes with its citation.
>
> Now the important one: 'Can I take my usual medication?' The documents say nothing, so ScanReady refuses to guess. It tells her it can't safely say from her documents and gives her the exact question to ask the imaging center. In a medical setting, an honest 'I don't know' is the feature."

---

### 2:00–2:25 — Fix the blocker (show: barriers → drafted request)

**Show:**
1. Click **What's making this hard?**
2. Choose **I use a wheelchair or mobility aid**.
3. Show the drafted request, then click **Copy this request** and show the "Copied" message.

**Say:**
> "Anita uses a wheelchair. She taps that, and ScanReady writes the request to the center for her: asking them to confirm transfer assistance, with the center's own accessibility text as the reason. She copies it, and sends it herself. ScanReady never contacts anyone for her."

---

### 2:25–2:50 — How we built it (show: README table, then checklist, then app map)

**Show:**
1. Switch to the GitHub README, scroll to **How we used the Devpost skills** (the stage table).
2. Flash `devpost/checklist.md` with five ticked slices (3 seconds).
3. Flash `devpost/app-map.html` (2 seconds).

**Say:**
> "We built this plan-first, using the Devpost skills in order: start, scope, PRD, spec, then build in five verified slices, each with its own commit. The scope, the product requirements and the spec were all approved before a line of code. The safety rule, no guessing about medical instructions, was written into the PRD first, then enforced in code and tested with real questions."

---

### 2:50–3:00 — Close (show: app on the plan screen or title card)

**Say:**
> "ScanReady: the scan should be reachable for everyone. Thank you."

**Show:** Title card with the GitHub URL.

---

## If something goes wrong while recording

| Problem | What to do |
|---|---|
| The plan takes too long | Cut the wait in editing. The saved fallback plan loads instantly and is labeled as saved, so you can mention it as resilience. |
| The AI wording differs from this script | Normal; plans vary slightly between live runs. Describe what is on screen rather than reading the script word for word. |
| An answer comes back different from what you expected | Re-run the question once. Medication, pacemaker and contrast-allergy questions should all give the safe reply. |
| You run over 3:00 | Cut the checklist and app-map flash first, then shorten the fasting question. |

## What to say if you only remember three things

1. **Problem:** a scared patient, five confusing papers.
2. **Magic moment:** it cites every claim, and refuses to guess about medication.
3. **Process:** we planned first with the Devpost skills, then built in verified slices.

## Upload checklist

- [ ] Video is under 3 minutes and shows the project actually working
- [ ] Uploaded to YouTube, Vimeo or similar, set to public or unlisted, link works while logged out
- [ ] No API key, token or private info visible anywhere in the recording
- [ ] GitHub repo is public and the README renders correctly
- [ ] Submit before **26 Oct 2026, 5:00 PM EDT**
