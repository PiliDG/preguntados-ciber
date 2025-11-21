"use strict";

// Enlaza los botones del menú a sus pantallas
// Sin alerts: solo cambia window.location.href a "archivo.html"

document.addEventListener("DOMContentLoaded", () => {
  const routes = {
    // menú principal clásico
    "#addPlayers": "add_players.html",
    "#startGame": "game.html",
    "#viewPodium": "podium.html",
    "#instructions": "instructions.html",
    "#crud": "admin_questions.html",
    "#editPlayers": "edit_players.html",
    
    // variantes de ids usados en el layout alternativo
    "#btnStart": "game.html",
    "#btnPodium": "podium.html",
    "#btnHelp": "instructions.html",
    "#btnCrud": "admin_questions.html",
    "#btnExit": "index.html",

    // botón de salida con clase genérica
    ".exit": "index.html",
  };

  for (const [selector, file] of Object.entries(routes)) {
    const nodes = document.querySelectorAll(selector);
    nodes.forEach((el) => {
      el.addEventListener("click", (ev) => {
        ev.preventDefault();
        window.location.href = file;
      });
    });
  }
});

