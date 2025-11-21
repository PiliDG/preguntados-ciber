function goTo(section) {
  // navegación simple; reemplaza los alerts
  if (typeof section === 'string') {
    window.location.href = section;
  }
}

function startGame() {
  // validación: debe haber jugadores
  fetch("/api/players")
    .then(res => res.json())
    .then(players => {
      if (Array.isArray(players) && players.length === 0) {
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
  if (confirm("¿Seguro que querés salir de Debuggeadas?")) {
    window.close();
  }
}

