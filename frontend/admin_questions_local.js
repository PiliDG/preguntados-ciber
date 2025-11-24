"use strict";

// Banco de preguntas en memoria (no se borra ni modifica salvo por acciones del usuario)
const bancoPreguntas = {
  "Colecciones y datos": [
    {"texto": "Â¿CuÃ¡l de estas estructuras es inmutable en Python?", "opciones": ["Lista", "Tupla", "Diccionario", "Conjunto"], "respuesta": 1},
    {"texto": "Â¿QuÃ© hace list.append(x)?", "opciones": ["Agrega x al final", "Inserta x al inicio", "Devuelve una nueva lista", "Ordena la lista"], "respuesta": 0},
    {"texto": "Â¿QuÃ© devuelve dict.keys()?", "opciones": ["Lista de claves", "Vista de claves", "Tupla de claves", "Iterador consumible"], "respuesta": 1},
    {"texto": "Â¿QuÃ© hace set.add(x)?", "opciones": ["Agrega x si no existe", "Agrega duplicados", "Elimina x", "Ordena el set"], "respuesta": 0},
    {"texto": "Â¿QuÃ© hace list.sort() por defecto?", "opciones": ["Ordena y devuelve nueva lista", "Ordena in-place y devuelve None", "Ordena desc.", "No se puede"], "respuesta": 1},
    {"texto": "Â¿CuÃ¡l es la copia superficial correcta?", "opciones": ["a=b", "a=list.copy(b)", "a=b.copy()", "copy(a)=b"], "respuesta": 2},
    {"texto": "Â¿QuÃ© hace slicing [::-1]?", "opciones": ["Toma pares", "Toma impares", "Revierte", "Nada"], "respuesta": 2},
    {"texto": "Para eliminar por valor el primero que aparece:", "opciones": ["pop()", "remove(x)", "discard(x)", "del lista[x]"], "respuesta": 1},
    {"texto": "Â¿QuÃ© estructura mantiene orden de inserciÃ³n (3.7+)?", "opciones": ["set", "dict", "tuple", "frozenset"], "respuesta": 1},
    {"texto": "Â¿CuÃ¡l estructura permite claves no hashables?", "opciones": ["dict", "defaultdict", "ninguna", "Counter"], "respuesta": 2}
  ],
  "Lambda y funciones": [
    {"texto": "Una lambda en Python esâ€¦", "opciones": ["FunciÃ³n nombrada", "FunciÃ³n anÃ³nima", "Clase", "MÃ³dulo"], "respuesta": 1},
    {"texto": "map(f, iterable) retornaâ€¦", "opciones": ["Lista", "Iterador", "Tupla", "Set"], "respuesta": 1},
    {"texto": "filter(f, iterable) mantieneâ€¦", "opciones": ["Siempre todo", "Elementos donde f es True", "Elementos None", "Elementos falsy"], "respuesta": 1},
    {"texto": "reduce(f, seq) vive enâ€¦", "opciones": ["functools", "itertools", "collections", "re"], "respuesta": 0},
    {"texto": "Sintaxis lambda correcta:", "opciones": ["lambda x: x+1", "lambda: x -> 1", "lambda(x){x+1}", "fn(x)=x+1"], "respuesta": 0},
    {"texto": "sorted(seq, key=â€¦)", "opciones": ["key recibe cada elemento", "key recibe la lista", "key ordena in-place", "key es obligatorio"], "respuesta": 0},
    {"texto": "Â¿QuÃ© hace any(iterable)?", "opciones": ["True si todos True", "True si alguno True", "Cuenta True", "Invierte booleanos"], "respuesta": 1},
    {"texto": "Â¿QuÃ© retorna zip(a,b)?", "opciones": ["Lista de tuplas", "Iterador de tuplas", "Set", "Dict"], "respuesta": 1},
    {"texto": "list(map(int, ['1','2'])) ->", "opciones": ["Error", "[1,2]", "['1','2']", "(1,2)"], "respuesta": 1},
    {"texto": "Lambda tÃ­pica para pares:", "opciones": ["lambda x: x%2", "lambda x: x%2==0", "lambda: x%2==0", "lambda x: return x%2==0"], "respuesta": 1}
  ],
  "Archivos y Excepciones": [
    {"texto": "Modo 'w' en open()â€¦", "opciones": ["SÃ³lo lectura", "Escritura (sobrescribe)", "Append", "Binario"], "respuesta": 1},
    {"texto": "Bloque para manejar errores:", "opciones": ["if/else", "try/except", "with/as", "switch"], "respuesta": 1},
    {"texto": "with open(...) garantizaâ€¦", "opciones": ["Autocierre", "Flush manual", "Bloqueo de hilo", "Permisos root"], "respuesta": 0},
    {"texto": "Capturar error especÃ­fico:", "opciones": ["except:", "except Exception:", "except ValueError:", "except BaseException:"], "respuesta": 2},
    {"texto": "Leer todas las lÃ­neas:", "opciones": ["f.read()", "f.readlines()", "f.readline()", "next(f)"], "respuesta": 1},
    {"texto": "Escribir una lÃ­nea:", "opciones": ["f.put()", "f.push()", "f.write()", "f.append()"], "respuesta": 2},
    {"texto": "Cerrar archivo manual:", "opciones": ["f.end()", "f.close()", "f.stop()", "No se puede"], "respuesta": 1},
    {"texto": "Crear archivo si no existe:", "opciones": ["'x'", "'c'", "'n'", "'nx'"], "respuesta": 0},
    {"texto": "TraducciÃ³n de EAFP:", "opciones": ["Es mÃ¡s fÃ¡cil pedir perdÃ³n", "Evitar errores siempre", "Errores afuera, funciones dentro", "No significa nada"], "respuesta": 0},
    {"texto": "finally se ejecutaâ€¦", "opciones": ["SÃ³lo si no hay error", "Siempre", "Nunca", "SÃ³lo con return"], "respuesta": 1}
  ],
  "JSON y APIs": [
    {"texto": "json.loads(s) haceâ€¦", "opciones": ["Python->JSON", "JSON->Python", "Escribe archivo", "Valida esquema"], "respuesta": 1},
    {"texto": "json.dumps(obj) haceâ€¦", "opciones": ["Python->JSON str", "JSON->obj", "Lee archivo", "None"], "respuesta": 0},
    {"texto": "Para leer JSON de disco:", "opciones": ["json.load(f)", "json.loads(f)", "json.read(f)", "f.json()"], "respuesta": 0},
    {"texto": "Campo faltante en JSON:", "opciones": ["KeyError", "IndexError", "TypeError", "SyntaxError"], "respuesta": 0},
    {"texto": "API REST suele usarâ€¦", "opciones": ["FTP", "HTTP", "SMTP", "SSH"], "respuesta": 1},
    {"texto": "CÃ³digo HTTP Ã©xito:", "opciones": ["1xx", "2xx", "3xx", "4xx"], "respuesta": 1},
    {"texto": "json.dumps(..., indent=2)", "opciones": ["Compacta", "Formatea con sangrÃ­a", "Minifica", "Valida"], "respuesta": 1},
    {"texto": "Cabecera tÃ­pica JSON:", "opciones": ["Accept: text/html", "Content-Type: application/json", "Host: json", "Server: json"], "respuesta": 1},
    {"texto": "API key vaâ€¦", "opciones": ["Siempre en URL", "En headers/vars seguras", "En comentarios", "No importa"], "respuesta": 1},
    {"texto": "HTTP 404 esâ€¦", "opciones": ["OK", "No encontrado", "Prohibido", "Error servidor"], "respuesta": 1}
  ],
  "Recursividad y Algoritmos": [
    {"texto": "CondiciÃ³n clave en recursiÃ³n:", "opciones": ["Caso base", "Globales", "break", "pass"], "respuesta": 0},
    {"texto": "Complejidad de bÃºsqueda binaria:", "opciones": ["O(n)", "O(log n)", "O(n log n)", "O(1)"], "respuesta": 1},
    {"texto": "Quicksort promedio:", "opciones": ["O(n)", "O(log n)", "O(n log n)", "O(n^2)"], "respuesta": 2},
    {"texto": "Fibonacci recursivo simple:", "opciones": ["Eficiente", "Muy eficiente", "Ineficiente", "Ã“ptimo"], "respuesta": 2},
    {"texto": "Pila de llamadasâ€¦", "opciones": ["Estructura FIFO", "Estructura LIFO", "Heap", "Disco"], "respuesta": 1},
    {"texto": "DFS usaâ€¦", "opciones": ["Cola", "Pila", "Ãrbol binario", "Heap"], "respuesta": 1},
    {"texto": "MergeSort esâ€¦", "opciones": ["In place", "No in place", "Ambas", "Ninguna"], "respuesta": 1},
    {"texto": "RecursiÃ³n sin caso base:", "opciones": ["Termina igual", "StackOverflow", "Se optimiza", "No compila"], "respuesta": 1},
    {"texto": "Big-O miraâ€¦", "opciones": ["Mejor caso", "Caso promedio", "Peor caso (comÃºn)", "Nada"], "respuesta": 2},
    {"texto": "Tail recursion en Pythonâ€¦", "opciones": ["Optimizada", "Parcialmente", "No optimizada", "Prohibida"], "respuesta": 2}
  ]
};

let categoriaSeleccionada = null;
let preguntaEditandoIndex = null;

function $(sel){ return document.querySelector(sel); }
function $all(sel){ return Array.from(document.querySelectorAll(sel)); }

function showToast(msg="", type="info"){
  const t = $("#toast");
  if(!t) return; t.textContent = msg; t.classList.add("show");
  clearTimeout(showToast._t); showToast._t = setTimeout(()=>t.classList.remove("show"), 2000);
}

function cargarCategorias(){
  const sel = $("#categoriaSelect");
  sel.innerHTML = "";
  Object.keys(bancoPreguntas).forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat; opt.textContent = cat; sel.appendChild(opt);
  });
  categoriaSeleccionada = sel.value || Object.keys(bancoPreguntas)[0] || null;
}

function renderPreguntas(){
  const lista = $("#listaPreguntas");
  lista.innerHTML = "";
  if(!categoriaSeleccionada) return;
  (bancoPreguntas[categoriaSeleccionada] || []).forEach((pregunta, index) => {
    const li = document.createElement("li"); li.className = "player-item"; const wrap = document.createElement("div"); wrap.className = "pregunta-contenido"; const txt = document.createElement("span"); txt.className = "pregunta-texto"; txt.textContent = pregunta.texto; const acciones = document.createElement("div"); acciones.className = "pregunta-acciones"; const btnEditar = document.createElement("button"); btnEditar.textContent = "Editar"; btnEditar.className = "btn"; const btnEliminar = document.createElement("button"); btnEliminar.textContent = "Eliminar"; btnEliminar.className = "btn ghost"; btnEditar.addEventListener("click", ()=> cargarPreguntaEnFormulario(index)); btnEliminar.addEventListener("click", ()=> eliminarPregunta(index)); acciones.append(btnEditar, btnEliminar); wrap.append(txt, acciones); li.appendChild(wrap); lista.appendChild(li);
  });
}

function cargarPreguntaEnFormulario(index){
  const p = bancoPreguntas[categoriaSeleccionada][index];
  $("#preguntaTexto").value = p.texto;
  p.opciones.forEach((op, i)=> { $("#opcion"+i).value = op; });
  $("#respuestaCorrecta").value = String(p.respuesta);
  preguntaEditandoIndex = index;
}

function limpiarFormularioPregunta(){
  $("#preguntaTexto").value = "";
  for(let i=0;i<4;i++){ $("#opcion"+i).value = ""; }
  $("#respuestaCorrecta").value = "0";
  preguntaEditandoIndex = null;
}

function guardarPreguntaDesdeFormulario(ev){
  ev.preventDefault();
  if(!categoriaSeleccionada){ showToast("ElegÃ­ una categorÃ­a", "error"); return; }
  const texto = $("#preguntaTexto").value.trim();
  const opciones = [0,1,2,3].map(i => $("#opcion"+i).value.trim());
  const respuesta = Number($("#respuestaCorrecta").value);
  if(!texto || opciones.some(o=>!o) || !(respuesta>=0 && respuesta<4)){
    showToast("CompletÃ¡ todos los campos", "error"); return;
  }
  const nueva = { texto, opciones, respuesta };
  if(preguntaEditandoIndex === null){
    bancoPreguntas[categoriaSeleccionada].push(nueva);
    showToast("Pregunta agregada");
  } else {
    bancoPreguntas[categoriaSeleccionada][preguntaEditandoIndex] = nueva;
    showToast("Pregunta actualizada");
  }
  limpiarFormularioPregunta();
  renderPreguntas();
}

function crearNuevaCategoria(ev){
  ev.preventDefault();
  const nombre = $("#nuevaCategoriaNombre").value.trim();
  const texto = $("#nc_preguntaTexto").value.trim();
  const opciones = [0,1,2,3].map(i => $("#nc_opcion"+i).value.trim());
  const respuesta = Number($("#nc_respuestaCorrecta").value);
  if(!nombre){ showToast("Nombre de categorÃ­a requerido", "error"); return; }
  if(bancoPreguntas[nombre]){ showToast("La categorÃ­a ya existe", "error"); return; }
  if(!texto || opciones.some(o=>!o) || !(respuesta>=0 && respuesta<4)){
    showToast("CompletÃ¡ la primera pregunta", "error"); return;
  }
  bancoPreguntas[nombre] = [{ texto, opciones, respuesta }];
  // actualizar UI
  cargarCategorias();
  $("#categoriaSelect").value = nombre; categoriaSeleccionada = nombre;
  renderPreguntas();
  $("#formNuevaCategoria").reset();
  showToast("CategorÃ­a creada");
}

document.addEventListener("DOMContentLoaded", ()=>{
  cargarCategorias();
  renderPreguntas();
  $("#categoriaSelect").addEventListener("change", (e)=>{
    categoriaSeleccionada = e.target.value; preguntaEditandoIndex = null; renderPreguntas();
  });
  $("#formPregunta").addEventListener("submit", guardarPreguntaDesdeFormulario);
  $("#btnCancelarEdicion").addEventListener("click", limpiarFormularioPregunta);
  $("#formNuevaCategoria").addEventListener("submit", crearNuevaCategoria);
  $("#btnEliminarCategoria").addEventListener("click", eliminarCategoriaActual);
});

// Eliminar una pregunta por Ã­ndice con confirmaciÃ³n
function eliminarPregunta(index){
  if(!categoriaSeleccionada) return;
  if(!confirm("Â¿Seguro que querÃ©s eliminar esta pregunta?")) return;
  const arr = bancoPreguntas[categoriaSeleccionada] || [];
  if(index >=0 && index < arr.length){
    arr.splice(index,1);
    if(preguntaEditandoIndex !== null){
      // si estaba editando la misma, limpiar formulario
      if(preguntaEditandoIndex === index){
        limpiarFormularioPregunta();
      }
      // ajustar Ã­ndice si era superior
      if(preguntaEditandoIndex > index){
        preguntaEditandoIndex -= 1;
      }
    }
    renderPreguntas();
    showToast("Pregunta eliminada");
  }
}

// Eliminar categorÃ­a completa con confirmaciÃ³n
function eliminarCategoriaActual(){
  if(!categoriaSeleccionada) return;
  if(!confirm("Â¿Seguro que querÃ©s eliminar esta categorÃ­a y todas sus preguntas?")) return;
  delete bancoPreguntas[categoriaSeleccionada];
  // recargar categorÃ­as y limpiar vista
  const keys = Object.keys(bancoPreguntas);
  const nueva = keys.length ? keys[0] : null;
  const sel = document.getElementById('categoriaSelect');
  sel.innerHTML = '';
  keys.forEach(cat=>{ const o=document.createElement('option'); o.value=cat; o.textContent=cat; sel.appendChild(o); });
  sel.value = nueva || '';
  categoriaSeleccionada = nueva;
  limpiarFormularioPregunta();
  renderPreguntas();
  showToast("CategorÃ­a eliminada");
}

