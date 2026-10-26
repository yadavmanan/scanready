const $ = (id) => document.getElementById(id);

const STATUS_ICONS = {
  "Completed": "\u2714",
  "Waiting": "\u23F3",
  "Needs action": "\u2757",
  "Needs human confirmation": "\u260E",
};

const state = { docs: [], plan: null };

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function show(screen) {
  for (const s of document.querySelectorAll("main > section")) s.hidden = s.id !== `screen-${screen}`;
  const heading = document.querySelector(`#screen-${screen} h1`);
  if (heading) heading.focus();
  window.scrollTo(0, 0);
}

function docTitle(id) {
  const doc = state.docs.find((d) => d.id === id);
  return doc ? doc.title : id;
}

function statusBadge(status) {
  const badge = el("span", "badge");
  badge.dataset.status = status;
  badge.append(el("span", "icon", STATUS_ICONS[status] || ""), document.createTextNode(` ${status}`));
  return badge;
}

function sourceLine(docId, quote) {
  const p = el("p", "source");
  p.append(el("strong", null, "Source: "), documentLink(docId), document.createTextNode(` \u2014 \u201C${quote}\u201D`));
  return p;
}

function documentLink(id) {
  const link = el("a", "document-link", docTitle(id));
  link.href = `/documents/${encodeURIComponent(id)}`;
  link.target = "_blank";
  link.rel = "noopener";
  link.setAttribute("aria-label", `${docTitle(id)} (PDF, opens in a new tab)`);
  return link;
}

async function loadDocuments() {
  const list = $("doc-list");
  $("build-plan").disabled = true;
  $("retry-documents").hidden = true;
  list.textContent = "Loading documents...";
  try {
    const res = await fetch("/api/documents");
    if (!res.ok) throw new Error("Documents unavailable");
    state.docs = await res.json();
    list.innerHTML = "";
    for (const d of state.docs) {
      const item = el("li");
      item.append(documentLink(d.id), el("span", "file-type", "PDF"));
      list.appendChild(item);
    }
    $("doc-count").textContent = `${state.docs.length} files`;
    $("build-plan").disabled = !state.docs.length;
    if (!state.docs.length) list.textContent = "No documents are available yet.";
  } catch {
    list.textContent = "Your documents could not be loaded. Please try again.";
    $("retry-documents").hidden = false;
  }
}

function updateTaskProgress() {
  const tasks = [...$("task-list").children];
  const checked = tasks.filter((item) => item.querySelector("input").checked).length;
  $("task-progress").textContent = tasks.length ? `${checked} of ${tasks.length} checked off` : "No checklist items.";
  $("task-meter").max = tasks.length || 1;
  $("task-meter").value = checked;
  for (const item of tasks) {
    const done = item.querySelector("input").checked;
    item.classList.toggle("task-done", done);
    item.hidden = $("unfinished-only").checked && done;
  }
  $("tasks-empty").hidden = !tasks.length || !$("unfinished-only").checked || checked !== tasks.length;
}

function renderPlan(result) {
  const { plan, source } = result;
  state.plan = plan;
  $("return-plan").hidden = false;
  $("build-plan").textContent = "Rebuild my plan";
  $("plan-origin").textContent = source === "saved" ? "Saved sample plan" : "Built from your documents";

  const note = $("plan-note");
  note.hidden = source !== "saved";
  note.textContent = source === "saved" ? "Showing a saved sample result because the live service could not be reached." : "";

  const h = plan.headline;
  const headline = $("plan-headline");
  headline.innerHTML = "";
  headline.append(el("p", "eyebrow", h.study), el("p", "when", `${h.date}, ${h.time}`), el("p", "arrive", `Arrive by ${h.arrive_by}`));

  const n = plan.blockers.length;
  $("plan-summary").textContent = n
    ? `You don't need to solve everything at once. ${n} ${n === 1 ? "thing needs" : "things need"} your attention.`
    : "Nothing is blocking you right now.";

  const disc = $("plan-discrepancies");
  disc.innerHTML = "";
  for (const d of plan.discrepancies) {
    const box = el("div", "callout");
    box.append(el("strong", null, "Worth double-checking: "), document.createTextNode(d.summary));
    const sources = el("p", "source", "Documents: ");
    d.source_doc_ids.forEach((id, index) => {
      if (index) sources.append(document.createTextNode(", "));
      sources.append(documentLink(id));
    });
    box.append(sources);
    disc.appendChild(box);
  }

  const blockers = $("blocker-list");
  blockers.innerHTML = "";
  for (const b of plan.blockers) {
    const li = el("li");
    li.append(el("h3", null, b.title), statusBadge(b.status), el("p", null, b.why), sourceLine(b.source_doc_id, b.quote));
    blockers.appendChild(li);
  }
  if (!plan.blockers.length) blockers.appendChild(el("li", null, "No blockers identified in these documents."));

  const tasks = $("task-list");
  tasks.innerHTML = "";
  for (const t of plan.tasks) {
    const li = el("li");
    const label = el("label", "task-check");
    const checkbox = el("input");
    checkbox.type = "checkbox";
    const key = `scanready-task:${JSON.stringify([h, t.source_doc_id, t.quote, t.title])}`;
    checkbox.checked = t.status === "Completed";
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) checkbox.checked = saved === "true";
    } catch {}
    checkbox.addEventListener("change", () => {
      try { localStorage.setItem(key, String(checkbox.checked)); } catch {}
      updateTaskProgress();
    });
    label.append(checkbox, el("span", "task-title", t.title));
    li.append(label, statusBadge(t.status), el("p", null, t.detail), sourceLine(t.source_doc_id, t.quote));
    tasks.appendChild(li);
  }
  updateTaskProgress();
}

async function buildPlan() {
  const button = $("build-plan");
  const status = $("scan-status");
  button.disabled = true;
  status.textContent = "Reading your documents\u2026 this takes a few seconds.";
  try {
    const res = await fetch("/api/plan", { method: "POST" });
    if (!res.ok) throw new Error((await res.json()).detail || res.statusText);
    renderPlan(await res.json());
    status.textContent = "";
    show("plan");
  } catch (err) {
    status.textContent = "Sorry, I couldn't build your plan just now. Please try again in a moment.";
  } finally {
    button.disabled = false;
  }
}

$("build-plan").addEventListener("click", buildPlan);

async function openBarriers() {
  const list = $("barrier-list");
  $("open-barriers").disabled = true;
  try {
    if (!list.children.length) {
      const res = await fetch("/api/barriers");
      if (!res.ok) throw new Error("Barriers unavailable");
      for (const name of await res.json()) {
        const li = el("li");
        const btn = el("button", "option", name);
        btn.type = "button";
        btn.addEventListener("click", () => chooseBarrier(name));
        li.appendChild(btn);
        list.appendChild(li);
      }
    }
    $("other-box").hidden = true;
    $("barrier-status").textContent = "";
    show("barriers");
  } catch {
    $("ask-result").textContent = "Support options could not be loaded. Please try again.";
  } finally {
    $("open-barriers").disabled = false;
  }
}

async function chooseBarrier(name, details = "") {
  if (name === "Other" && !details) {
    $("other-box").hidden = false;
    $("other-text").focus();
    return;
  }
  const status = $("barrier-status");
  const buttons = [...$("screen-barriers").querySelectorAll("button")];
  buttons.forEach((button) => { button.disabled = true; });
  status.textContent = "Writing your request\u2026";
  try {
    const res = await fetch("/api/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ barrier: name, details }),
    });
    if (!res.ok) throw new Error((await res.json()).detail || res.statusText);
    renderRequest(name, await res.json());
    status.textContent = "";
    show("fix");
  } catch (err) {
    status.textContent = "Sorry, I couldn't write that request just now. Please try again in a moment.";
  } finally {
    buttons.forEach((button) => { button.disabled = false; });
  }
}

function renderRequest(barrier, req) {
  $("fix-barrier").textContent = `For: ${barrier}`;
  $("fix-subject").textContent = req.subject;
  $("fix-body").textContent = req.body;
  $("copy-status").textContent = "";
  const list = $("fix-grounding");
  list.innerHTML = "";
  if (!req.grounding.length) {
    list.appendChild(el("li", null, "Your documents don't cover this, so the request simply asks the center to confirm."));
  }
  for (const g of req.grounding) {
    const li = el("li");
    li.append(el("strong", null, g.title), sourceLine(g.source_doc_id, g.quote));
    list.appendChild(li);
  }
}

async function copyRequest() {
  const text = `${$("fix-subject").textContent}\n\n${$("fix-body").textContent}`;
  try {
    await navigator.clipboard.writeText(text);
    $("copy-status").textContent = "Copied. You can paste it into an email or read it out on the phone.";
  } catch (err) {
    $("copy-status").textContent = "I couldn't copy it automatically. Please select the text above and copy it.";
  }
}

$("open-barriers").addEventListener("click", openBarriers);

async function askQuestion(event) {
  event.preventDefault();
  const input = $("ask-input");
  const question = input.value.trim();
  const out = $("ask-result");
  if (!question) return;
  if ($("ask-submit").disabled) return;
  $("ask-submit").disabled = true;
  $("ask-submit").textContent = "Checking...";
  out.innerHTML = "";
  out.appendChild(el("p", null, "Checking your documents\u2026"));
  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    if (!res.ok) throw new Error((await res.json()).detail || res.statusText);
    renderAnswer(await res.json());
  } catch (err) {
    out.innerHTML = "";
    out.appendChild(el("p", null, "Sorry, I couldn't check that just now. Please try again in a moment."));
  } finally {
    $("ask-submit").disabled = false;
    $("ask-submit").textContent = "Ask";
  }
}

function renderAnswer(r) {
  const out = $("ask-result");
  out.innerHTML = "";
  const card = el("div", r.answered ? "answer" : "answer wont-guess");
  card.appendChild(statusBadge(r.answered ? "Completed" : "Needs human confirmation"));
  card.appendChild(el("p", null, r.answer));
  for (const c of r.citations) card.appendChild(sourceLine(c.source_doc_id, c.quote));
  if (!r.answered) {
    card.appendChild(el("p", "ask-label", "Question to ask your imaging center:"));
    card.appendChild(el("p", "draft-body", r.question_for_center));
  }
  out.appendChild(card);
}

$("ask-form").addEventListener("submit", askQuestion);
$("retry-documents").addEventListener("click", loadDocuments);
$("unfinished-only").addEventListener("change", updateTaskProgress);
$("print-plan").addEventListener("click", () => window.print());
$("suggested-question").addEventListener("change", (event) => {
  if (!event.target.value) return;
  $("ask-input").value = event.target.value;
  $("ask-input").focus();
});
$("other-go").addEventListener("click", () => chooseBarrier("Other", $("other-text").value.trim() || "Not specified"));
$("copy-request").addEventListener("click", copyRequest);
document.addEventListener("click", (e) => {
  const go = e.target.closest("[data-go]");
  if (go) show(go.dataset.go);
});

loadDocuments();
