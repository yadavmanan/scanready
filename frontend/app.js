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
  badge.append(el("span", "icon", STATUS_ICONS[status] || ""), document.createTextNode(` ${status}`));
  return badge;
}

function sourceLine(docId, quote) {
  const p = el("p", "source");
  p.append(el("strong", null, "Source: "), document.createTextNode(`${docTitle(docId)} \u2014 \u201C${quote}\u201D`));
  return p;
}

async function loadDocuments() {
  const res = await fetch("/api/documents");
  state.docs = await res.json();
  const list = $("doc-list");
  list.innerHTML = "";
  for (const d of state.docs) list.appendChild(el("li", null, d.title));
}

function renderPlan(result) {
  const { plan, source } = result;
  state.plan = plan;

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
    box.append(el("p", "source", `Documents: ${d.source_doc_ids.map(docTitle).join(", ")}`));
    disc.appendChild(box);
  }

  const blockers = $("blocker-list");
  blockers.innerHTML = "";
  for (const b of plan.blockers) {
    const li = el("li");
    li.append(el("h3", null, b.title), statusBadge(b.status), el("p", null, b.why), sourceLine(b.source_doc_id, b.quote));
    blockers.appendChild(li);
  }

  const tasks = $("task-list");
  tasks.innerHTML = "";
  for (const t of plan.tasks) {
    const li = el("li");
    li.append(el("h3", null, t.title), statusBadge(t.status), el("p", null, t.detail), sourceLine(t.source_doc_id, t.quote));
    tasks.appendChild(li);
  }
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
  if (!list.children.length) {
    const res = await fetch("/api/barriers");
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
}

async function chooseBarrier(name, details = "") {
  if (name === "Other" && !details) {
    $("other-box").hidden = false;
    $("other-text").focus();
    return;
  }
  const status = $("barrier-status");
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
$("other-go").addEventListener("click", () => chooseBarrier("Other", $("other-text").value.trim() || "Not specified"));
$("copy-request").addEventListener("click", copyRequest);
document.addEventListener("click", (e) => {
  const go = e.target.closest("[data-go]");
  if (go) show(go.dataset.go);
});

loadDocuments();
