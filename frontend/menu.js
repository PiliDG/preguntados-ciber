"use strict";

// Mapea los botones del menú a sus pantallas correspondientes
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-add-players")?.addEventListener("click", () => {
    window.location.href = "/static/add_players.html";
  });

  document.getElementById("btn-start-game")?.addEventListener("click", () => {
    window.location.href = "/static/game.html";
  });

  document.getElementById("btn-podium")?.addEventListener("click", () => {
    window.location.href = "/static/podium.html";
  });

  document.getElementById("btn-instructions")?.addEventListener("click", () => {
    window.location.href = "/static/instructions.html";
  });

  document.getElementById("btn-admin-questions")?.addEventListener("click", () => {
    window.location.href = "/static/admin_questions.html";
  });

  document.getElementById("btn-edit-players")?.addEventListener("click", () => {
    window.location.href = "/static/edit_players.html";
  });

  document.getElementById("btn-exit")?.addEventListener("click", () => {
    window.location.href = "/";
    // Si quisieras cerrar la pestaña en un entorno permitido: window.close();
  });
});
