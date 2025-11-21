import os
import logging
from typing import List
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import requests

from .models import AnswerIn, QuestionIn, Player, Question, PlayerIn
from .storage import read_db, write_db
from .game import GAME, players


app = FastAPI()

# Logging básico para ver estado en arranque y requests
LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO").upper()
logging.basicConfig(
    level=LOG_LEVEL,
    format="%(asctime)s %(levelname)s %(name)s - %(message)s",
)
logger = logging.getLogger("preguntados")

# Permitir CORS amplio para facilitar desarrollo local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/categories")
def categories():
    return GAME.categories()


@app.post("/api/spin")
def spin():
    return GAME.spin()


@app.post("/api/answer")
def answer(payload: AnswerIn):
    player = next((p for p in players if p.name == payload.player), None)
    if not player:
        player = Player(payload.player)
        players.append(player)
    result = GAME.answer(player, payload.question_id, payload.option_index)
    next_q = GAME.next_question()
    return {"result": result, "next": next_q}


@app.get("/api/podium")
def podium():
    return GAME.podium()


# --- Players API ---
MAX_PLAYERS = 20


def serialize_player(p: Player) -> dict:
    return {
        "id": p.name,  # usamos el nombre como id
        "name": p.name,
        "score": p.score,
        "correct": p.correct,
        "wrong": p.wrong,
    }


def find_player_index(pid: str) -> int:
    for i, p in enumerate(players):
        if p.name == pid:
            return i
    return -1


@app.get("/api/players")
def list_players():
    return [serialize_player(p) for p in players]


@app.post("/api/players")
def create_player(data: PlayerIn):
    name = data.name.strip()
    if not name:
        raise HTTPException(400, "Nombre inválido")
    if len(players) >= MAX_PLAYERS:
        raise HTTPException(400, "Máximo 20 jugadores")
    if any(p.name.lower() == name.lower() for p in players):
        raise HTTPException(400, "El jugador ya existe")
    new_player = Player(name)
    players.append(new_player)
    return serialize_player(new_player)


@app.put("/api/players/{pid}")
def update_player(pid: str, data: PlayerIn):
    idx = find_player_index(pid)
    if idx < 0:
        raise HTTPException(404, "Jugador no encontrado")
    new_name = data.name.strip()
    if not new_name:
        raise HTTPException(400, "Nombre inválido")
    if any(p.name.lower() == new_name.lower() and p.name != pid for p in players):
        raise HTTPException(400, "El jugador ya existe")
    players[idx].name = new_name
    return serialize_player(players[idx])


@app.delete("/api/players/{pid}")
def delete_player(pid: str):
    idx = find_player_index(pid)
    if idx < 0:
        raise HTTPException(404, "Jugador no encontrado")
    players.pop(idx)
    return {"deleted": pid}


# CRUD ADMIN (Question)
@app.get("/api/admin/questions")
def admin_list():
    db = read_db()
    return list(db["questions"].values())


@app.post("/api/admin/questions")
def admin_create(q: QuestionIn):
    db = read_db()
    new_id = f"Q{len(db['questions'])+1:04d}"
    obj = Question(id=new_id, category=q.category, text=q.text, options=q.options, answer_index=q.answer_index)
    db["questions"][new_id] = obj.to_dict()
    # asegurar categoría
    db["categories"].setdefault(q.category, {"name": q.category, "question_ids": []})
    db["categories"][q.category]["question_ids"].append(new_id)
    write_db(db)
    return obj.to_dict()


@app.put("/api/admin/questions/{qid}")
def admin_update(qid: str, q: QuestionIn):
    db = read_db()
    if qid not in db["questions"]:
        raise HTTPException(404, "Pregunta no encontrada")
    obj = Question(id=qid, category=q.category, text=q.text, options=q.options, answer_index=q.answer_index)
    # actualizar categoría si cambió
    old_cat = db["questions"][qid]["category"]
    if old_cat != q.category:
        if qid in db["categories"][old_cat]["question_ids"]:
            db["categories"][old_cat]["question_ids"].remove(qid)
        db["categories"].setdefault(q.category, {"name": q.category, "question_ids": []})
        db["categories"][q.category]["question_ids"].append(qid)
    db["questions"][qid] = obj.to_dict()
    write_db(db)
    return obj.to_dict()


@app.delete("/api/admin/questions/{qid}")
def admin_delete(qid: str):
    db = read_db()
    if qid not in db["questions"]:
        raise HTTPException(404, "Pregunta no encontrada")
    cat = db["questions"][qid]["category"]
    if qid in db["categories"][cat]["question_ids"]:
        db["categories"][cat]["question_ids"].remove(qid)
    del db["questions"][qid]
    write_db(db)
    return {"deleted": qid}


@app.get("/api/ping")
def ping():
    # Ejemplo de uso de 'requests' (si no hay red, retorna unreachable)
    try:
        r = requests.get("https://httpbin.org/get", timeout=3)
        return {"ok": True, "httpbin": r.status_code}
    except Exception:
        return {"ok": True, "httpbin": "unreachable"}


# Serve frontend (index.html, JS, CSS)
FRONTEND_DIR = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "frontend"))


@app.get("/")
def root():
    index_path = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "Backend OK. Add frontend/index.html to serve UI."}


app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")


@app.on_event("startup")
async def _startup_log():
    index_path = os.path.join(FRONTEND_DIR, "index.html")
    logger.info("Arrancando FastAPI + Frontend")
    logger.info("Frontend dir: %s (index.html=%s)", FRONTEND_DIR, os.path.exists(index_path))
    api_routes = sorted({getattr(r, "path", "") for r in app.routes if getattr(r, "path", "").startswith("/api")})
    logger.info("Rutas API registradas: %s", api_routes)
    try:
        cats = GAME.categories()
        logger.info("Categorías disponibles: %d", len(cats))
    except Exception as e:
        logger.exception("Error al cargar categorías: %s", e)


@app.middleware("http")
async def _log_requests(request: Request, call_next):
    response = await call_next(request)
    logger.info("%s %s -> %s", request.method, request.url.path, response.status_code)
    return response
