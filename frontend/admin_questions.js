"use strict";

// Helpers
async function fetchJSON(url, opts={}) {
  const r = await fetch(url, opts);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

function $(sel) { return document.querySelector(sel); }

function showToast(msg="", type="info") {
  const el = $("#toast");
  el.textContent = msg;
  el.style.borderColor = type === "error" ? "#ff6b6b" : "rgba(255,255,255,.15)";
  el.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.classList.remove("show"), 2200);
}

// Estado
const state = {
  categories: [],
  questions: [],
};

// Cargar datos
async function loadAll() {
  try {
    state.categories = await fetchJSON("/api/categories");
    state.questions = await fetchJSON("/api/questions");
    renderCategories();
    renderQuestions();
  } catch (e) {
    showToast("Error cargando datos", "error");
  }
}

// Render categorías
function renderCategories() {
  const list = $("#category-list");
  list.innerHTML = "";

  state.categories.forEach(cat => {
    const li = document.createElement("li");
    li.className = "player-item";

    const nameSpan = document.createElement("span");
    nameSpan.textContent = cat;

    const input = document.createElement("input");
    input.type = "text";
    input.value = cat;
    input.style.display = "none";

    const btnEdit = document.createElement("button");
    btnEdit.textContent = "Editar";
    btnEdit.className = "btn";

    const btnSave = document.createElement("button");
    btnSave.textContent = "Guardar";
    btnSave.className = "btn";
    btnSave.style.display = "none";

    const btnCancel = document.createElement("button");
    btnCancel.textContent = "Cancelar";
    btnCancel.className = "btn ghost";
    btnCancel.style.display = "none";

    const btnDelete = document.createElement("button");
    btnDelete.textContent = "Eliminar";
    btnDelete.className = "btn ghost";

    function enterEdit() {
      nameSpan.style.display = "none";
      input.style.display = "inline-block";
      btnEdit.style.display = "none";
      btnSave.style.display = "inline-block";
      btnCancel.style.display = "inline-block";
    }

    function exitEdit() {
      nameSpan.style.display = "inline";
      input.style.display = "none";
      btnEdit.style.display = "inline-block";
      btnSave.style.display = "none";
      btnCancel.style.display = "none";
      input.value = cat;
    }

    btnEdit.onclick = enterEdit;
    btnCancel.onclick = exitEdit;

    btnSave.onclick = async () => {
      const newName = input.value.trim();
      if (!newName) return showToast("Nombre inválido", "error");
      await fetchJSON(`/api/categories/${encodeURIComponent(cat)}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name: newName}),
      });
      showToast("Categoría actualizada");
      loadAll();
    };

    btnDelete.onclick = async () => {
      if (!confirm("Eliminar categoría? También eliminará sus preguntas.")) return;
      await fetchJSON(`/api/categories/${encodeURIComponent(cat)}`, {method: "DELETE"});
      showToast("Categoría eliminada");
      loadAll();
    };

    li.append(nameSpan, input, btnEdit, btnSave, btnCancel, btnDelete);
    list.appendChild(li);
  });
}

// Render preguntas
function renderQuestions() {
  const list = $("#question-list");
  list.innerHTML = "";

  state.questions.forEach(q => {
    const li = document.createElement("li");
    li.className = "player-item";
    li.innerHTML = `<strong>${q.category}</strong> — ${q.text}`;

    const btnEdit = document.createElement("button");
    btnEdit.textContent = "Editar";
    btnEdit.className = "btn";

    const btnDelete = document.createElement("button");
    btnDelete.textContent = "Eliminar";
    btnDelete.className = "btn ghost";

    btnEdit.onclick = () => editQuestion(q);
    btnDelete.onclick = async () => {
      if (!confirm("Eliminar pregunta?")) return;
      await fetchJSON(`/api/admin/questions/${q.id}`, {method: "DELETE"});
      showToast("Pregunta eliminada");
      loadAll();
    };

    li.append(btnEdit, btnDelete);
    list.appendChild(li);
  });
}

// Editor de preguntas
function editQuestion(q) {
  const newText = prompt("Editar pregunta:", q.text);
  if (!newText) return;

  const newCat = prompt("Categoría:", q.category);
  if (!newCat) return;

  const newOpts = [];
  for (let i = 0; i < 4; i++) {
    newOpts.push(prompt(`Opción ${i+1}:`, q.options[i]));
  }

  const correct = parseInt(prompt("Índice de respuesta correcta (0-3):", q.answer_index));

  fetchJSON(`/api/admin/questions/${q.id}`, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      text: newText,
      category: newCat,
      options: newOpts,
      answer_index: correct,
    }),
  }).then(() => {
    showToast("Pregunta actualizada");
    loadAll();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  $("#add-category").onclick = async () => {
    const name = $("#new-category").value.trim();
    if (!name) return showToast("Nombre inválido", "error");
    await fetchJSON("/api/categories", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({name}),
    });
    $("#new-category").value = "";
    showToast("Categoría agregada");
    loadAll();
  };

  $("#btn-new-question").onclick = () => editQuestion({
    id: null,
    text: "",
    options: ["", "", "", ""],
    category: "",
    answer_index: 0,
  });

  loadAll();
});

