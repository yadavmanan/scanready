async function loadDocuments() {
  const list = document.getElementById("doc-list");
  const res = await fetch("/api/documents");
  const docs = await res.json();
  list.innerHTML = "";
  for (const d of docs) {
    const li = document.createElement("li");
    li.textContent = d.title;
    list.appendChild(li);
  }
}

loadDocuments();
