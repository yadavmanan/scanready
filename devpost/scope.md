---
doc: scope
status: approved
---

# ScanReady

A calm, patient-side AI guide that helps someone get from an imaging referral to actually having the scan.

## The Unique Kernel
The unit of intelligence is not the document, it is the patient's ability to complete the diagnostic journey. ScanReady turns a messy bundle of appointment papers into a few source-cited tasks, finds the specific blockers (accessibility, language, transport, unclear prep), drafts the request to fix each one, and never guesses at medical instructions. If the documents don't answer a question, it says so and gives the exact question to ask the imaging center.

> "Healthcare has optimized the scan. ScanReady optimizes the patient's ability to reach it."

## Who It's For
A patient around 40 who has to start treatment and needs imaging first. They are scared and a bit confused, and they're on their phone. Today they have fragmented documents (appointment email, prep PDF, accessibility page, insurance letter), several calls to make, and nobody calm to walk them through it. They want "someone calm and better to deal with."

The demo patient is **Anita**, from the playbook: limited English, mobility limitations, trouble with dense written instructions, and no family available during work hours. Her age is set to 40 here, since the playbook's 61 differs from what the learner said.

## The Core Loop
1. Upload or photograph the appointment documents.
2. See a simple plan, e.g. "MRI, Thursday 10:30", with each item cited to its source document.
3. See "You don't need to solve all 7 things. You have 2 blockers."
4. Pick what's making it hard, and ScanReady drafts a grounded request to the imaging center.
5. For what's still unresolved, optionally share only that one task with a trusted person.

They come back because the plan shows what's done, what's waiting, and what still needs action.

## Inspiration & Identity
Calm, plain-language, one action per card. This is a task-oriented care-journey view (e.g. "Your care journey: MRI Thursday, 2 blockers, 5 completed"), not a chat box or AI orb. Status uses text and icons, never color alone. It is keyboard- and screen-reader-friendly with large text, and voice is optional. Tone: reassuring and never alarming.

## Why This Matters to the Learner
Patients who are scared and confused deserve someone calm to deal with. The learner's main goal is a working ScanReady demo. They work in healthcare AI/ML and noticed the scan can be ready while the patient is still blocked by everything around it.

## What "Working" Looks Like
A user uploads a small bundle of realistic (fictional) documents and receives a grounded imaging action plan with source citations. They identify a blocker and get a drafted request. They can share only the blocked task with a trusted person.

The "oh, that's cool" beat is two moments. First, five documents, seven actions, and three places to call become "2 blockers." Second, when asked a clinical question the documents don't answer (e.g. about medication), ScanReady replies, "I can't safely determine this from the provided instructions," and gives the exact question to ask the center.

## The POC Boundary
In:
- Document upload (fictional demo bundle) and extraction into source-cited tasks
- Accessible, personalized plan screen
- Blocker selection and a drafted request to the imaging center
- The "won't guess" safety path for unanswered clinical questions
- Accessibility basics: keyboard use, screen-reader labels, large text, high contrast

## Later
- Trusted-person share of one blocked task (deferred by the learner during `3-prd`)
- Translation and read-aloud beyond the basics
- Real email or sending integration
- Insurance and cost-coverage help
- Tracking status over time across multiple appointments

## Explicitly Cut
- AI radiology diagnosis: clinically risky and unnecessary for the access story.
- FHIR/PACS/DICOM or hospital integration: too much time and a demo dependency.
- Real insurance portal automation or phone automation: out of POC reach.
- Real patient data: privacy and safety; the demo uses fictional documents only.
- Medical advice (medication, contrast, implant safety, fasting rules): ScanReady must route these to the care team.
