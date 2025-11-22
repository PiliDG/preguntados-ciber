from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import os
import requests

from .models import Player, Question
from .storage import read_db, write_db
from .game import Game

app = FastAPI(title="Preguntados Ciber")

# Serve frontend estÃ¡tico
FRONT_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend")
app.mount("/static", StaticFiles(directory=FRONT_DIR), name="static")

@app.get("/")
def index_root():
    return FileResponse(os.path.join(FRONT_DIR, "index.html"))

# Juego en memoria (simple). Para mÃºltiples sesiones usarÃ­as un store.
players: List[Player] = []`r`nGAME = Game(players)

class AnswerIn(BaseModel):
    player: str
    question_id: str
    option_index: int

class QuestionIn(BaseModel):
    category: str
    text: str
    options: List[str]
    answer_index: int

@app.get("/")
def index_root():
    return FileResponse(os.path.join(FRONT_DIR, "index.html"))

@app.get("/api/categories")
def get_categories():
    db = read_db()
    return sorted(db["categories"].keys())

@app.get("/api/questions")
def get_questions(category: Optional[str] = None):
    db = read_db()
    if category:
        if category not in db["categories"]:
            raise HTTPException(404, "CategorÃ­a no encontrada")
        ids = db["categories"][category]["question_ids"]
        return [db["questions"][qid] for qid in ids]
    return list(db["questions"].values())

@app.post("/api/spin")
def spin():
    cat = GAME.spin_wheel()
    q = GAME.next_question()
    return {"category": cat, "question": q}

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
    # asegurar categorÃ­a
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
    # actualizar categorÃ­a si cambiÃ³
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
    # Ejemplo de uso de 'requests' para cumplir consigna (no obligatorio en runtime)
    try:
        r = requests.get("https://httpbin.org/get", timeout=3)
        return {"ok": True, "httpbin": r.status_code}
    except Exception:
        return {"ok": True, "httpbin": "unreachable"}


# --- Players API (en memoria) ---
class PlayerIn(BaseModel):
    name: str

MAX_PLAYERS = 20

def serialize_player(p: Player) -> dict:
    return {"id": p.name, "name": p.name, "score": p.score, "correct": p.correct, "wrong": p.wrong}

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
    new_p = Player(name)
    players.append(new_p)
    return serialize_player(new_p)

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
