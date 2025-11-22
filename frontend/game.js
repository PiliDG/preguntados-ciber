"use strict";

// Banco de preguntas local (mismo formato que admin)
const bancoPreguntas = {
  "Colecciones y datos": [
    {"texto": "¿Cuál de estas estructuras es inmutable en Python?", "opciones": ["Lista", "Tupla", "Diccionario", "Conjunto"], "respuesta": 1},
    {"texto": "¿Qué hace list.append(x)?", "opciones": ["Agrega x al final", "Inserta x al inicio", "Devuelve una nueva lista", "Ordena la lista"], "respuesta": 0},
    {"texto": "¿Qué devuelve dict.keys()?", "opciones": ["Lista de claves", "Vista de claves", "Tupla de claves", "Iterador consumible"], "respuesta": 1},
    {"texto": "¿Qué hace set.add(x)?", "opciones": ["Agrega x si no existe", "Agrega duplicados", "Elimina x", "Ordena el set"], "respuesta": 0},
    {"texto": "¿Qué hace list.sort() por defecto?", "opciones": ["Ordena y devuelve nueva lista", "Ordena in-place y devuelve None", "Ordena desc.", "No se puede"], "respuesta": 1},
    {"texto": "¿Cuál es la copia superficial correcta?", "opciones": ["a=b", "a=list.copy(b)", "a=b.copy()", "copy(a)=b"], "respuesta": 2},
    {"texto": "¿Qué hace slicing [::-1]?", "opciones": ["Toma pares", "Toma impares", "Revierte", "Nada"], "respuesta": 2},
    {"texto": "Para eliminar por valor el primero que aparece:", "opciones": ["pop()", "remove(x)", "discard(x)", "del lista[x]"], "respuesta": 1},
    {"texto": "¿Qué estructura mantiene orden de inserción (3.7+)?", "opciones": ["set", "dict", "tuple", "frozenset"], "respuesta": 1},
    {"texto": "¿Cuál estructura permite claves no hashables?", "opciones": ["dict", "defaultdict", "ninguna", "Counter"], "respuesta": 2}
  ],
  "Lambda y funciones": [
    {"texto": "Una lambda en Python es…", "opciones": ["Función nombrada", "Función anónima", "Clase", "Módulo"], "respuesta": 1},
    {"texto": "map(f, iterable) retorna…", "opciones": ["Lista", "Iterador", "Tupla", "Set"], "respuesta": 1},
    {"texto": "filter(f, iterable) mantiene…", "opciones": ["Siempre todo", "Elementos donde f es True", "Elementos None", "Elementos falsy"], "respuesta": 1},
    {"texto": "reduce(f, seq) vive en…", "opciones": ["functools", "itertools", "collections", "re"], "respuesta": 0},
    {"texto": "Sintaxis lambda correcta:", "opciones": ["lambda x: x+1", "lambda: x -> 1", "lambda(x){x+1}", "fn(x)=x+1"], "respuesta": 0},
    {"texto": "sorted(seq, key=…)", "opciones": ["key recibe cada elemento", "key recibe la lista", "key ordena in-place", "key es obligatorio"], "respuesta": 0},
    {"texto": "¿Qué hace any(iterable)?", "opciones": ["True si todos True", "True si alguno True", "Cuenta True", "Invierte booleanos"], "respuesta": 1},
    {"texto": "¿Qué retorna zip(a,b)?", "opciones": ["Lista de tuplas", "Iterador de tuplas", "Set", "Dict"], "respuesta": 1},
    {"texto": "list(map(int, ['1','2'])) ->", "opciones": ["Error", "[1,2]", "['1','2']", "(1,2)"], "respuesta": 1},
    {"texto": "Lambda típica para pares:", "opciones": ["lambda x: x%2", "lambda x: x%2==0", "lambda: x%2==0", "lambda x: return x%2==0"], "respuesta": 1}
  ],
  "Archivos y Excepciones": [
    {"texto": "Modo 'w' en open()…", "opciones": ["Sólo lectura", "Escritura (sobrescribe)", "Append", "Binario"], "respuesta": 1},
    {"texto": "Bloque para manejar errores:", "opciones": ["if/else", "try/except", "with/as", "switch"], "respuesta": 1},
    {"texto": "with open(...) garantiza…", "opciones": ["Autocierre", "Flush manual", "Bloqueo de hilo", "Permisos root"], "respuesta": 0},
    {"texto": "Capturar error específico:", "opciones": ["except:", "except Exception:", "except ValueError:", "except BaseException:"], "respuesta": 2},
    {"texto": "Leer todas las líneas:", "opciones": ["f.read()", "f.readlines()", "f.readline()", "next(f)"], "respuesta": 1},
    {"texto": "Escribir una línea:", "opciones": ["f.put()", "f.push()", "f.write()", "f.append()"], "respuesta": 2},
    {"texto": "Cerrar archivo manual:", "opciones": ["f.end()", "f.close()", "f.stop()", "No se puede"], "respuesta": 1},
    {"texto": "Crear archivo si no existe:", "opciones": ["'x'", "'c'", "'n'", "'nx'"], "respuesta": 0},
    {"texto": "Traducción de EAFP:", "opciones": ["Es más fácil pedir perdón", "Evitar errores siempre", "Errores afuera, funciones dentro", "No significa nada"], "respuesta": 0},
    {"texto": "finally se ejecuta…", "opciones": ["Sólo si no hay error", "Siempre", "Nunca", "Sólo con return"], "respuesta": 1}
  ],
  "JSON y APIs": [
    {"texto": "json.loads(s) hace…", "opciones": ["Python->JSON", "JSON->Python", "Escribe archivo", "Valida esquema"], "respuesta": 1},
    {"texto": "json.dumps(obj) hace…", "opciones": ["Python->JSON str", "JSON->obj", "Lee archivo", "None"], "respuesta": 0},
    {"texto": "Para leer JSON de disco:", "opciones": ["json.load(f)", "json.loads(f)", "json.read(f)", "f.json()"], "respuesta": 0},
    {"texto": "Campo faltante en JSON:", "opciones": ["KeyError", "IndexError", "TypeError", "SyntaxError"], "respuesta": 0},
    {"texto": "API REST suele usar…", "opciones": ["FTP", "HTTP", "SMTP", "SSH"], "respuesta": 1},
    {"texto": "Código HTTP éxito:", "opciones": ["1xx", "2xx", "3xx", "4xx"], "respuesta": 1},
    {"texto": "json.dumps(..., indent=2)", "opciones": ["Compacta", "Formatea con sangría", "Minifica", "Valida"], "respuesta": 1},
    {"texto": "Cabecera típica JSON:", "opciones": ["Accept: text/html", "Content-Type: application/json", "Host: json", "Server: json"], "respuesta": 1},
    {"texto": "API key va…", "opciones": ["Siempre en URL", "En headers/vars seguras", "En comentarios", "No importa"], "respuesta": 1},
    {"texto": "HTTP 404 es…", "opciones": ["OK", "No encontrado", "Prohibido", "Error servidor"], "respuesta": 1}
  ],
  "Recursividad y Algoritmos": [
    {"texto": "Condición clave en recursión:", "opciones": ["Caso base", "Globales", "break", "pass"], "respuesta": 0},
    {"texto": "Complejidad de búsqueda binaria:", "opciones": ["O(n)", "O(log n)", "O(n log n)", "O(1)"], "respuesta": 1},
    {"texto": "Quicksort promedio:", "opciones": ["O(n)", "O(log n)", "O(n log n)", "O(n^2)"], "respuesta": 2},
    {"texto": "Fibonacci recursivo simple:", "opciones": ["Eficiente", "Muy eficiente", "Ineficiente", "Óptimo"], "respuesta": 2},
    {"texto": "Pila de llamadas…", "opciones": ["Estructura FIFO", "Estructura LIFO", "Heap", "Disco"], "respuesta": 1},
    {"texto": "DFS usa…", "opciones": ["Cola", "Pila", "Árbol binario", "Heap"], "respuesta": 1},
    {"texto": "MergeSort es…", "opciones": ["In place", "No in place", "Ambas", "Ninguna"], "respuesta": 1},
    {"texto": "Recursión sin caso base:", "opciones": ["Termina igual", "StackOverflow", "Se optimiza", "No compila"], "respuesta": 1},
    {"texto": "Big-O mira…", "opciones": ["Mejor caso", "Caso promedio", "Peor caso (común)", "Nada"], "respuesta": 2},
    {"texto": "Tail recursion en Python…", "opciones": ["Optimizada", "Parcialmente", "No optimizada", "Prohibida"], "respuesta": 2}
  ]
};

const state = {
  jugadores: [],
  indiceJugadorActual: 0,
  categoriaActual: null,
  preguntaActual: null,
  cuentaRegresivaId: null,
  timeoutResultadoId: null,
};

async function cargarJugadores(){
  try{
    const res = await fetch('/api/players');
    if(!res.ok) throw new Error('HTTP '+res.status);
    const arr = await res.json();
    state.jugadores = Array.isArray(arr) ? arr.map(p=>p.name || p.nombre || p) : [];
  }catch{
    state.jugadores = [];
  }
}

function actualizarTurnoTexto(){
  const el = document.getElementById('turnoTexto');
  const nombre = state.jugadores[state.indiceJugadorActual] || '—';
  el.textContent = `Turno de: ${nombre}`;
}

function mostrarPantallaJuego(){
  document.getElementById('pantalla-juego').classList.remove('hidden');
  document.getElementById('mensajeSinJugadores').classList.add('hidden');
  actualizarTurnoTexto();
}

function mostrarMensajeSinJugadores(){
  document.getElementById('pantalla-juego').classList.add('hidden');
  document.getElementById('mensajeSinJugadores').classList.remove('hidden');
}

function tirarRuleta(){
  if(state.preguntaActual) return;
  const btn = document.getElementById('btnTirar');
  btn.disabled = true;
  const r = document.getElementById('ruleta');
  r.classList.add('girando');
  const categorias = Object.keys(bancoPreguntas);
  setTimeout(()=>{
    r.classList.remove('girando');
    const cat = categorias[Math.floor(Math.random()*categorias.length)];
    state.categoriaActual = cat;
    document.getElementById('categoriaElegida').textContent = `Categoría: ${cat}`;
    mostrarPregunta(cat);
  }, 1800);
}

function mostrarPregunta(categoria){
  const lista = bancoPreguntas[categoria] || [];
  if(lista.length === 0){
    document.getElementById('categoriaElegida').textContent = `Categoría: ${categoria} (sin preguntas)`;
    document.getElementById('btnTirar').disabled = false;
    return;
  }
  const q = lista[Math.floor(Math.random()*lista.length)];
  state.preguntaActual = q;

  const cont = document.getElementById('contenedorPregunta');
  const texto = document.getElementById('textoPregunta');
  const opciones = document.getElementById('opciones');
  const timer = document.getElementById('timer');
  const resultado = document.getElementById('resultado');

  resultado.textContent = '';
  texto.textContent = q.texto;
  opciones.innerHTML = '';
  cont.classList.remove('hidden');

  q.opciones.forEach((op, i)=>{
    const b = document.createElement('button');
    b.className = 'btn-menu';
    b.textContent = op;
    b.addEventListener('click', ()=> evaluarRespuesta(i));
    opciones.appendChild(b);
  });

  let restante = 15;
  timer.textContent = `Tiempo restante: ${restante}`;
  state.cuentaRegresivaId = setInterval(()=>{
    restante -= 1;
    timer.textContent = `Tiempo restante: ${restante}`;
    if(restante <= 0){
      clearInterval(state.cuentaRegresivaId); state.cuentaRegresivaId = null;
      evaluarRespuesta(-1);
    }
  }, 1000);
}

function evaluarRespuesta(indice){
  // deshabilitar opciones
  document.querySelectorAll('#opciones .btn-menu').forEach(b=> b.disabled = true);
  const r = document.getElementById('resultado');
  const q = state.preguntaActual;
  if(state.cuentaRegresivaId){ clearInterval(state.cuentaRegresivaId); state.cuentaRegresivaId = null; }

  const correcta = q.respuesta;
  if(indice === -1){
    r.textContent = `Tiempo agotado. La respuesta correcta era: ${q.opciones[correcta]}`;
  } else if(indice === correcta){
    r.textContent = '¡Respuesta correcta!';
  } else {
    r.textContent = `Respuesta incorrecta. La correcta era: ${q.opciones[correcta]}`;
  }

  state.timeoutResultadoId = setTimeout(()=>{
    pasarAlSiguienteTurno();
  }, 5000);
}

function pasarAlSiguienteTurno(){
  // limpiar UI pregunta
  document.getElementById('contenedorPregunta').classList.add('hidden');
  document.getElementById('opciones').innerHTML = '';
  document.getElementById('resultado').textContent = '';
  document.getElementById('timer').textContent = 'Tiempo restante: 15';
  state.preguntaActual = null;
  // habilitar ruleta
  document.getElementById('btnTirar').disabled = false;
  // siguiente jugador
  if(state.jugadores.length > 0){
    state.indiceJugadorActual = (state.indiceJugadorActual + 1) % state.jugadores.length;
  }
  actualizarTurnoTexto();
}

function salirAlMenu(){
  if(state.cuentaRegresivaId){ clearInterval(state.cuentaRegresivaId); state.cuentaRegresivaId = null; }
  if(state.timeoutResultadoId){ clearTimeout(state.timeoutResultadoId); state.timeoutResultadoId = null; }
  window.location.href = '/static/index.html';
}

document.addEventListener('DOMContentLoaded', async ()=>{
  // cargar jugadores y decidir si se puede jugar
  await cargarJugadores();
  if(state.jugadores.length === 0){
    mostrarMensajeSinJugadores();
  } else {
    mostrarPantallaJuego();
  }
  document.getElementById('btnTirar').addEventListener('click', tirarRuleta);
  document.getElementById('btnVolverMenu').addEventListener('click', (e)=>{ e.preventDefault(); salirAlMenu(); });
});

