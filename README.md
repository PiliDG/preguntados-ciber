# Preguntados Ciber


## Tecnologías
- **Frontend**: HTML + CSS + JS vanilla (sin frameworks) con efectos neon.
- **Backend**: FastAPI (Python) + almacenamiento JSON.
- **Datos**: `data/questions.json`.
- **Deploy**: Railway (1 servicio web que sirve API + archivos estáticos).


## Requisitos de la cátedra cubiertos
- Modularización: backend dividido en `models.py`, `storage.py`, `game.py`, `main.py`.
- **Clases**: `BaseEntity` (abstracta), `Question`, `Category`, `Game`, `Player`.
- **Herencia**: `Player` hereda de `BaseEntity` (abstracta).
- **Encapsulamiento**: atributo privado en `Player` (`__score`).
- **CRUD completo**: endpoints para crear/listar/actualizar/eliminar preguntas (clase principal `Question`).
- **Módulos**: `json`, `re`, `collections.deque`, `requests` (mínimo 3).
- **Interfaz gráfica**: frontend interactivo con ruleta y podio.
- **Docstrings** en funciones y clases; comentarios.


## Instalar y correr en local


```bash
# Requisitos: Python 3.10+ y pip
python -m venv .venv
source .venv/bin/activate # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt


# Ejecutar backend (sirve también el frontend estático)
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
Abrí `http://localhost:8000` en el navegador.


## Deploy en Railway (rápido)
1. Subí este repo a GitHub.
2. En [Railway](https://railway.app/) → New Project → Deploy from GitHub → elegí tu repo.
3. Railway detecta `Procfile` y `requirements.txt`. Buildpack Python.
4. Variables (opcional): ninguna obligatoria.
5. Al terminar el deploy, abrí el dominio público. El frontend se sirve desde `/` y la API desde `/api/...`.


## Endpoints principales
- `GET /api/categories` → categorías disponibles.
- `GET /api/questions?category=Nombre` → preguntas por categoría.
- `POST /api/answer` → valida respuesta, cuerpo: `{question_id, option_index}`.
- CRUD de `Question`:
- `GET /api/admin/questions`
- `POST /api/admin/questions`
- `PUT /api/admin/questions/{id}`
- `DELETE /api/admin/questions/{id}`


## Scripts útiles
- Cargar preguntas iniciales: se hace automáticamente al primer arranque si no existe `data/questions.json`.


## Licencia
MIT


## Etapas y motivos
- Probar localmente — Asegurar que funcione y no haya errores
- Configurar FastAPI + frontend — Para que Railway sirva todo desde un mismo proyecto
- Subir a GitHub — Fuente oficial del proyecto
- Conectar a Railway — Publicarlo online automáticamente. Probamos todo local primero para evitar debug en producción


## Checklist antes de subir
- [x] El servidor arranca correctamente (Uvicorn sin errores)
- [x] El HTML, CSS y JS se cargan desde `/` y `/static/*`
- [x] No hay rutas rotas (`/api/...` responde 2xx/4xx esperado)
- [x] FastAPI responde bien (por ejemplo `/api/categories`, `/api/spin`, `/api/podium`)


## Pruebas rápidas (local)
- Iniciar: `uvicorn backend.main:app --reload`
- Navegador: `http://localhost:8000` (debe cargar la UI)
- Categorías: `curl http://localhost:8000/api/categories`
- Spin: `curl -X POST http://localhost:8000/api/spin`
- Responder (ejemplo): `curl -X POST http://localhost:8000/api/answer -H "Content-Type: application/json" -d "{\"player\":\"Dev\",\"question_id\":\"Q0001\",\"option_index\":0}"`
- Podio: `curl http://localhost:8000/api/podium`

PowerShell (alternativa):
- `Invoke-WebRequest http://localhost:8000/api/categories | Select-Object -Expand Content`


## Notas para Railway
- Este repo ya trae `Procfile` y `railway.toml` con el comando de arranque.
- El filesystem del servicio es efímero: si usas el CRUD admin en producción, los cambios en `data/db.json` pueden perderse al redeploy. Soluciones:
  - Adjuntar un Volume en Railway y apuntar `DB_PATH` a esa ruta (por ej. `/data/db.json`).
  - O mantener las preguntas en `data/questions.json` y no usar CRUD en prod.
