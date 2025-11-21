"use strict";

// Utilidades
async function fetchJSON(url, opts = {}) {
  const res = await fetch(url, opts);
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || `HTTP ${res.status}`);
  }
  return res.json();
}

function $(sel) { return document.querySelector(sel); }

function showToast(msg = "", type = "info") {
  const el = $("#toast") || (() => {
    const t = document.createElement("div");
    t.id = "toast"; t.className = "toast"; document.body.appendChild(t); return t;
  })();
  el.textContent = msg;
  el.style.borderColor = type === "error" ? "#ff6b6b" : "rgba(255,255,255,.1)";
  el.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.classList.remove("show"), 2200);
}

const MAX_PLAYERS = 20;

const state = {
  players: [], // {id, name}
  loading: false,
};

function normalizePlayer(p) {
  if (!p) return null;
  const id = p.id ?? p.name; // soporte backend sin id
  return { id, name: p.name };
}

function sanitizeName(raw) {
  return String(raw || "").trim().replace(/\s+/g, " ");
}

function isDuplicate(name, exceptId = null) {
  const n = name.toLocaleLowerCase();
  return state.players.some(p => p.name.toLocaleLowerCase() === n && p.id !== exceptId);
}

function setLoading(on) {
  state.loading = on;
  const btn = $("#btn-add");
  if (btn) btn.disabled = !!on;
}

function render() {
  const list = $("#players-list");
  if (!list) return;
  list.innerHTML = "";
  state.players.forEach(p => {
    const li = document.createElement("li");
    li.className = "player-item"; // estilo tipo tarjeta

    const left = document.createElement("div");
    left.style.display = "flex";
    left.style.alignItems = "center";
    left.style.gap = "10px";

    const nameSpan = document.createElement("span");
    nameSpan.textContent = p.name;
    nameSpan.className = "player-name";

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = p.name;
    nameInput.maxLength = 30;
    nameInput.style.display = "none";
    nameInput.style.background = "rgba(0,0,0,.25)";
    nameInput.style.color = "#fff";
    nameInput.style.border = "1px solid rgba(255,255,255,.25)";
    nameInput.style.borderRadius = "8px";
    nameInput.style.padding = "6px 8px";

    left.appendChild(nameSpan);
    left.appendChild(nameInput);

    const actions = document.createElement("div");
    actions.className = "player-actions";
    actions.style.display = "flex";
    actions.style.gap = "8px";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Editar";
    editBtn.className = "btn";

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancelar";
    cancelBtn.className = "btn ghost";
    cancelBtn.style.display = "none";

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Guardar";
    saveBtn.className = "btn";
    saveBtn.style.display = "none";

    const delBtn = document.createElement("button");
    delBtn.textContent = "Eliminar";
    delBtn.className = "btn ghost";

    actions.appendChild(editBtn);
    actions.appendChild(saveBtn);
    actions.appendChild(cancelBtn);
    actions.appendChild(delBtn);

    li.appendChild(left);
    li.appendChild(actions);

    // handlers
    function enterEdit() {
      nameSpan.style.display = "none";
      nameInput.style.display = "inline-block";
      editBtn.style.display = "none";
      saveBtn.style.display = "inline-block";
      cancelBtn.style.display = "inline-block";
      nameInput.focus();
      nameInput.select();
    }

    function exitEdit() {
      nameSpan.style.display = "inline";
      nameInput.style.display = "none";
      editBtn.style.display = "inline-block";
      saveBtn.style.display = "none";
      cancelBtn.style.display = "none";
      nameInput.value = p.name;
    }

    editBtn.addEventListener("click", enterEdit);
    cancelBtn.addEventListener("click", exitEdit);

    saveBtn.addEventListener("click", async () => {
      const newName = sanitizeName(nameInput.value);
      if (!newName) { showToast("Ingresá un nombre válido", "error"); return; }
      if (newName.length > 30) { showToast("Nombre demasiado largo", "error"); return; }
      if (isDuplicate(newName, p.id)) { showToast("El nombre ya existe", "error"); return; }
      try {
        await fetchJSON(`/api/players/${encodeURIComponent(p.id)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newName })
        });
        p.name = newName;
        nameSpan.textContent = newName;
        showToast("Jugador actualizado");
        exitEdit();
      } catch (e) {
        showToast("No se pudo actualizar", "error");
      }
    });

    let pendingDelete = false;
    delBtn.addEventListener("click", async () => {
      if (!pendingDelete) {
        pendingDelete = true;
        const prev = delBtn.textContent;
        delBtn.textContent = "Confirmar";
        setTimeout(() => { pendingDelete = false; delBtn.textContent = prev; }, 1800);
        return;
      }
      try {
        await fetchJSON(`/api/players/${encodeURIComponent(p.id)}`, { method: "DELETE" });
        state.players = state.players.filter(x => x.id !== p.id);
        render();
        showToast("Jugador eliminado");
      } catch (e) {
        showToast("No se pudo eliminar", "error");
      }
    });

    list.appendChild(li);
  });
}

async function loadPlayers() {
  try {
    setLoading(true);
    const data = await fetchJSON("/api/players");
    const arr = Array.isArray(data) ? data : [];
    state.players = arr.map(normalizePlayer).filter(Boolean);
    render();
  } catch (e) {
    state.players = [];
    render();
    showToast("No se pudieron cargar jugadores", "error");
  } finally {
    setLoading(false);
  }
}

async function addPlayer(nameRaw) {
  const name = sanitizeName(nameRaw);
  if (!name) { showToast("Ingresá un nombre válido", "error"); return; }
  if (name.length > 30) { showToast("Nombre demasiado largo", "error"); return; }
  if (state.players.length >= MAX_PLAYERS) { showToast("Máximo 20 jugadores", "error"); return; }
  if (isDuplicate(name)) { showToast("El nombre ya existe", "error"); return; }

  try {
    setLoading(true);
    const created = await fetchJSON("/api/players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    const np = normalizePlayer(created) || { id: name, name };
    state.players.push(np);
    render();
    showToast("Jugador agregado");
  } catch (e) {
    showToast("No se pudo agregar", "error");
  } finally {
    setLoading(false);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = $("#player-form");
  const input = $("#player-name");
  const addBtn = $("#btn-add");

  if (form && input) {
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      addPlayer(input.value).then(() => { input.value = ""; input.focus(); });
    });
  }

  loadPlayers();
});

