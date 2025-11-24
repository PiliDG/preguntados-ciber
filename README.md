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