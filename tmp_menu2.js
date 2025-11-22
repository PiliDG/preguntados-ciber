"use strict";

// Mapea los botones del menú a sus pantallas correspondientes
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-add-players")?.addEventListener("click", () => {
    window.location.href = "/static/add_players.html";
  });

  document.getElementById("btn-start-game")?.addEventListener("click", async (ev) => {
    ev.preventDefault();
    try{
      const r = await fetch('/api/players');
      const data = r.ok ? await r.json() : [];
      const cantidad = Array.isArray(data) ? data.length : 0;
      if(cantidad === 0){
        // Mostrar mensaje visible en la misma página
        let box = document.getElementById('msg-no-players');
        if(!box){
          box = document.createElement('div');
          box.id = 'msg-no-players';
          box.style.background = 'rgba(0,0,0,.6)';
          box.style.border = '1px solid rgba(255,255,255,.25)';
          box.style.borderRadius = '12px';
          box.style.padding = '12px';
          box.style.margin = '12px auto';
          box.style.maxWidth = '520px';
          box.style.textAlign = 'center';
          box.style.color = '#fff';
          document.querySelector('.menu-container')?.appendChild(box);
        }
        box.innerHTML = 'Debés agregar al menos un jugador para iniciar el juego. <br><br><a class="btn" href="/static/add_players.html">Agregar jugadores</a>';
        return;
      }
      window.location.href = "/static/game.html";
    }catch{
      // En caso de error de red, mantener en menú
      console.warn('No se pudo validar jugadores');
    }
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

