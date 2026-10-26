# ScanReady — 3-Minute Demo Script

Target length: **2:55**, including a 30-second AI-generated opening. Leave a few seconds of buffer. Record the app in a phone-width browser window (about 390px wide); a face camera is optional.

The opening is a short story about the problem and the solution. The rest of the video switches to the real working app and briefly explains how it works.

---

## Before you record

1. Start the server from `backend/`: `.venv\Scripts\python.exe -m uvicorn app.main:app --port 8010`
2. Open `http://localhost:8010` at phone width. Set browser zoom around 110% so the screen is readable in the recording.
3. Click **Build my plan** once to confirm the live service works. Trim the waiting time in the final edit.
4. Close unrelated tabs, silence notifications, and make sure no API key or private information is visible.
5. Prepare the README's **How we used the Devpost skills** section, `devpost/checklist.md`, and `devpost/app-map.html` for the final process section.
6. Record the generated opening separately from the live app walkthrough. Use the same Anita, clothing, room, and lighting across all three generated scenes.

### AI video opening: three scenes, 30 seconds total

Generate three 10-second clips in a realistic, gentle cinematic style. Use a consistent character: Anita, a 40-year-old woman, ordinary everyday clothes, natural appearance. Keep the tone empathetic rather than frightening. No hospital emergency imagery, visible medical procedures, or dramatic MRI-machine shots. Do not ask the video generator to create readable text, logos, or document details; add titles and document labels as editing overlays.

#### Scene 1 — The worry (0:00–0:10)

**Video prompt:** A quiet morning in a modest, warmly lit home. Anita, 40, sits at a kitchen table, looking worried but composed. A clinic appointment reminder is beside her; she looks at it, takes a breath, and glances toward a closed folder. Medium shot, then a slow, subtle push-in. Natural daylight, realistic documentary cinematography, restrained emotion, no legible writing, no logos, no medical equipment.

**Edit:** Add a small opening title, **“ScanReady”**, during the final two seconds. Keep it clean and readable.

**Narrator:** “Anita is 40. She’s been told she needs an MRI, and she’s nervous about what comes next.”

#### Scene 2 — Five papers, no clear next step (0:10–0:20)

**Video prompt:** Overhead view of Anita opening the folder on the same kitchen table. She lays out five different-looking pages and letters, scans between them, and pauses, unsure which instruction to follow. Show paper variety and visual complexity, but keep every page blank or softly out of focus so no text is generated. Slow camera move across the papers, ending on Anita’s hand hovering over them. Same character, clothes, home, and lighting as the previous scene. Realistic, calm, empathetic, not melodramatic.

**Edit:** Add five simple overlays, one at a time: **Referral**, **Appointment**, **Prep guide**, **Accessibility**, **Insurance**. Use a light highlight or underline to suggest conflicting details, without inventing readable source text.

**Narrator:** “Five documents hold pieces of the answer, but the important steps and conflicting instructions are hard to find when you’re already worried.”

#### Scene 3 — A calmer path (0:20–0:30)

**Video prompt:** Anita picks up her smartphone and opens a clean, accessible appointment-preparation app. Her expression becomes more settled as she reads. Over-the-shoulder view of the phone, then a close-up of her relaxed expression. The phone screen should be a neutral, simple interface with no readable text or logos; leave the screen unobstructed so real app footage can be composited in later. Same Anita and home, natural light, gentle hopeful ending, realistic cinematic style.

**Edit:** Composite a brief real recording of ScanReady’s **My Scan** screen onto the phone if practical. Otherwise cut directly from the generated phone shot to the real app at 0:30. Add the title overlay **“One clear plan. Sources you can check. No guessing.”**

**Narrator:** “ScanReady turns the documents into a step-by-step plan, shows its sources, and flags what Anita should confirm with the imaging center.”

---

## Live app walkthrough and voiceover

### 0:30–1:05 — My Scan → Build my plan

**Show:** Cut to the real app at phone width. Show the five listed sample documents. Click one document title to open its PDF in a new tab, then return to the app. Tap **Build my plan**; trim the loading wait.

**Say:**
> “These five sample PDFs are included in the project. Anita can open any document to read the original. The backend extracts their text and sends it to the AI to organize into an appointment plan. She taps Build my plan.”

### 1:05–1:35 — One plan, with sources

**Show:** Show the appointment headline and insurance item under **What needs your attention**. Pause on a source quote; its document title also opens the PDF. Scroll to **Before you go**, check one task, and show the updated completion count. Uncheck it if needed.

**Say:**
> “Appointment details and things needing attention come first. Tasks and blockers show source quotes checked against the extracted text, with links to the original PDFs. Anita checks off preparation tasks as she goes; progress stays in this browser. These are personal checkmarks, not confirmation from the center. Anything needing human confirmation still needs that conversation.”

### 1:35–2:00 — Ask, and don’t guess

**Show:** Ask **“Do I need to fast?”** and show the cited answer. Then ask **“Can I take my usual medication?”** and show the safe response and suggested question for the center.

**Say:**
> “She can ask a question in plain language. When the documents directly answer it, ScanReady shows the answer with a checked citation. When they don’t, it won’t fill the gap with general medical advice. For medication, it says it can’t safely determine the answer from these documents and gives Anita a question to ask her care team.”

### 2:00–2:20 — Make the next step easier

**Show:** Tap **What’s making this hard?**, select **I use a wheelchair or mobility aid**, show the drafted request and its source, then tap **Copy this request**.

**Say:**
> “Anita can also choose a practical barrier. ScanReady drafts a short message asking the center to confirm what support is available, using relevant information from the center’s documents. She reviews and sends it herself; the app never contacts the center.”

### 2:20–2:50 — How it works and how we built it

**Show:** Start on a source quote in the app, then switch to the README skills table. Briefly show the five-slice checklist and the app map.

**Say:**
> “Under the hood, a Python backend extracts text from the PDFs and asks the AI for structured data: appointment details, tasks, questions, and source references. The app checks citations against the original extracted text, and uses a saved sample plan if the live AI service is unavailable. We planned the project with the Devpost skills in order: start, scope, PRD, spec, then build in five verified slices. The no-guessing rule came from the requirements and is enforced in the question flow.”

### 2:50–2:55 — Close

**Show:** Return to the plan screen, then end on a title card with the repository URL.

**Say:**
> “ScanReady: a clearer path to the scan, with people still in control.”

---

## Recording notes

### Small demo moments (within the existing time slots)

- **Before you go:** check a task to move the progress bar, then toggle **Only unfinished tasks** to focus the list. Turn it off to show the full plan again.
- **Ask:** choose **Do I need to fast?** from **Common questions**, then press **Ask**. Selecting a question does not submit it automatically.
- **Take the plan along:** use **Print plan / Save PDF** for a printable copy with sources. Checked tasks are included even when the screen is filtered. Skip opening the print dialog in the recording if time is tight.
- **Back to documents:** return to **My Scan** to open a PDF, then use **Return to your plan** without another AI request.
- Checklist progress is personal to this browser, not a confirmation from the imaging center. Do not describe checked items as medical clearance.

| Situation | What to do |
|---|---|
| The live plan takes too long | Trim the wait in editing. The app can show a saved sample plan if the live service is unavailable; keep its saved-result label visible. |
| The AI wording differs from the script | Describe what is actually on screen. The live plan can vary. |
| A result does not match the expected demo | Re-run once and verify the displayed source. Do not claim a citation is present unless it is visible. |
| You are over time | Shorten the process section and remove the checklist/app-map flashes before cutting the safety example. |
| The generated phone screen looks wrong | Do not use it as evidence of the product. Cut to the real app recording at 0:30. |

## Three things to remember

1. **Problem:** a worried patient has five documents and no clear next step.
2. **Solution:** one plan, checkable sources, and no guessing when the documents are silent.
3. **How it works:** extract PDF text, organize it with AI, validate source quotes, and keep the patient in control.

## Upload checklist

- [ ] Video is under 3 minutes and shows the real project working
- [ ] Uploaded publicly or unlisted, and the link works while logged out
- [ ] No API key, token, or private information is visible
- [ ] GitHub repository is public and the README renders correctly
- [ ] Submit before **26 Oct 2026, 5:00 PM EDT**
