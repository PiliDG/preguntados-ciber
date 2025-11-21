function goTo(section) {
  alert("Abrir sección: " + section);
  // más adelante, reemplazaremos esto por navegación real
}

function startGame() {
  // validación: debe haber jugadores
  fetch("/api/players")
    .then(res => res.json())
    .then(players => {
      if (players.length === 0) {
        alert("Debes agregar al menos un jugador para iniciar.");
      } else {
        window.location.href = "/static/game.html"; // el juego real
      }
    })
    .catch(() => {
      alert("Error al iniciar el juego.");
    });
}

function exitGame() {
  if (confirm("¿Seguro que querés salir de Debuggeadas? 💖")) {
    window.close();
  }
}

