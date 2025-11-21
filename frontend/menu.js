"use strict";

// Solo controla el botón "Agregar jugadores"
// Redirige a /static/add_players.html sin usar alert()
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#addPlayers");
  if (addBtn) {
    addBtn.addEventListener("click", (ev) => {
      ev.preventDefault();
      window.location.href = "/static/add_players.html";
    });
  }
});
