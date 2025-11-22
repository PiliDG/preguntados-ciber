"use strict";

// Intenta usar /api/podium si existe; si no, usa muestra local
async function cargarMarcador() {
  try {
    const r = await fetch('/api/podium');
    if (!r.ok) throw new Error('HTTP '+r.status);
    const data = await r.json();
    // Mapear a formato esperado
    return (Array.isArray(data) ? data : []).map(p => ({
      nombre: p.name || p.nombre || '—',
      puntos: p.score ?? p.puntos ?? 0,
      errores: p.wrong ?? p.errores ?? 0,
      preguntasRespondidas: (p.correct ?? 0) + (p.wrong ?? 0),
      tiemposRespuesta: []
    }));
  } catch {
    return [
      { nombre: "Pilar", puntos: 8737, errores: 3, preguntasRespondidas: 10, tiemposRespuesta: [12,8,15,9,11] },
      { nombre: "Isabella", puntos: 8664, errores: 5, preguntasRespondidas: 10, tiemposRespuesta: [14,10,13,8,12] },
      { nombre: "Eddy", puntos: 8618, errores: 4, preguntasRespondidas: 10, tiemposRespuesta: [9,11,16,10,13] },
    ];
  }
}

function ordenarMarcadorPorPuntos(m) {
  return [...m].sort((a,b) => b.puntos - a.puntos);
}

function mostrarPodio(marcador) {
  const el = document.getElementById('podio');
  el.innerHTML = '';
  const top = ordenarMarcadorPorPuntos(marcador).slice(0,3);
  // Asegurar 3 slots
  while (top.length < 3) top.push(null);

  const slots = [
    { idx: 1, clasePed: 'p2', claseMed: 'm2', label: '2' },
    { idx: 0, clasePed: 'p1', claseMed: 'm1', label: '1' },
    { idx: 2, clasePed: 'p3', claseMed: 'm3', label: '3' },
  ];

  slots.forEach((s, i) => {
    const data = top[s.idx];
    const col = document.createElement('div'); col.className = 'podio-col';
    const med = document.createElement('div'); med.className = `medalla ${s.claseMed}`; med.textContent = s.label;
    const nombre = document.createElement('div'); nombre.className = 'nombre'; nombre.textContent = data ? data.nombre : '—';
    const pts = document.createElement('div'); pts.className = 'puntos'; pts.textContent = data ? `${data.puntos} pts` : '';
    const ped = document.createElement('div'); ped.className = `pedestal ${s.clasePed}`;
    col.append(med, nombre, pts, ped);
    el.appendChild(col);
  });
}

function renderizarEstadisticas(estadisticasJuego) {
  // Errores por categoría (mini barras)
  const se = document.getElementById('stat-errores');
  se.innerHTML = '<strong>Errores por categoría</strong>';
  const max = Math.max(1, ...Object.values(estadisticasJuego.erroresPorCategoria || {}));
  Object.entries(estadisticasJuego.erroresPorCategoria || {}).forEach(([cat, val]) => {
    const row = document.createElement('div'); row.className = 'row';
    const label = document.createElement('span'); label.textContent = cat;
    const bar = document.createElement('div'); bar.className = 'bar';
    const span = document.createElement('span'); span.style.width = `${Math.round((val/max)*100)}%`;
    bar.appendChild(span); row.append(label, bar); se.appendChild(row);
  });

  // Preguntas más difíciles
  const sd = document.getElementById('stat-dificiles');
  sd.innerHTML = '<strong>Preguntas más difíciles</strong>';
  (estadisticasJuego.preguntasMasDificiles || []).forEach(p => {
    const chip = document.createElement('div'); chip.className = 'chip';
    chip.textContent = `${p.texto} — errores: ${p.errores}`; sd.appendChild(chip);
  });

  // Tiempo de respuesta
  const st = document.getElementById('stat-tiempo');
  st.innerHTML = '<strong>Tiempo de respuesta (s)</strong>';
  const t = estadisticasJuego.tiempoPromedioRespuesta || { minimo: 5, promedio: 11, maximo: 18 };
  [['Mínimo', t.minimo], ['Promedio', t.promedio], ['Máximo', t.maximo]].forEach(([lbl, val]) => {
    const row = document.createElement('div'); row.className = 'row';
    const label = document.createElement('span'); label.textContent = lbl;
    const bar = document.createElement('div'); bar.className = 'bar';
    const span = document.createElement('span'); span.style.width = `${Math.min(100, (val/ (t.maximo||1)) * 100)}%`;
    bar.appendChild(span); row.append(label, bar); st.appendChild(row);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const marcador = await cargarMarcador();
  mostrarPodio(marcador);
  // Estadísticas de ejemplo (adaptá a tu backend cuando lo tengas)
  const estadisticasJuego = {
    erroresPorCategoria: {
      'Colecciones y datos': 4,
      'Lambda y funciones': 7,
      'Archivos y Excepciones': 2,
      'JSON y APIs': 5,
      'Recursividad y Algoritmos': 6,
    },
    preguntasMasDificiles: [
      { texto: 'json.loads(s) hace…', errores: 5 },
      { texto: 'Complejidad de búsqueda binaria:', errores: 4 },
    ],
    tiempoPromedioRespuesta: { minimo: 5, promedio: 11, maximo: 18 },
  };
  renderizarEstadisticas(estadisticasJuego);
});

