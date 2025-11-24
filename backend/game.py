from typing import List, Dict, Optional
from collections import deque, defaultdict
import random
from time import monotonic

from .models import Player
from .storage import read_db


PUNTOS_CORRECTA = 10
TIEMPO_LIMITE_SEGUNDOS = 15.0


class Game:
    """Lógica simple del juego: ruleta de categorías, cola de preguntas, puntajes y estadísticas."""

    def __init__(self, players: List[Player]):
        self.players = players
        self.turn_index = 0
        self.history: List[Dict] = []
        self.queue = deque()  # cola de preguntas actuales
        self.current_category: Optional[str] = None
        self.current_start_time: Optional[float] = None

        # Estadísticas agregadas de la partida
        self.errors_by_category = defaultdict(int)
        self.response_stats = {
            "agil": 0,      # 0–5 segundos
            "promedio": 0,  # >5s y < tiempo límite
            "tarde": 0,     # no respondió o tiempo agotado
        }

    def spin_wheel(self) -> str:
        db = read_db()
        cats = list(db["categories"].keys())
        self.current_category = random.choice(cats)
        # carga 5 preguntas al azar de esa categoría
        qids = db["categories"][self.current_category]["question_ids"]
        pick = random.sample(qids, k=min(5, len(qids)))
        self.queue.clear()
        for qid in pick:
            q = db["questions"][qid]
            self.queue.append(q)
        # el tiempo de respuesta se empieza a medir cuando se entrega la pregunta (next_question)
        return self.current_category

    def next_question(self):
        if self.queue:
            # marcar inicio del tiempo para la próxima respuesta
            self.current_start_time = monotonic()
            return self.queue[0]
        return None

    def _registrar_respuesta(
        self,
        player: Player,
        q: Dict,
        correcta: bool,
        tiempo_respuesta: Optional[float],
    ) -> None:
        categoria = q.get("category")

        # Puntaje y aciertos/errores por jugador
        if correcta:
            player.add_points(PUNTOS_CORRECTA)
            player.correct += 1
        else:
            player.lose_points(2)
            player.wrong += 1
            if categoria:
                self.errors_by_category[categoria] += 1

        # Clasificación de tiempos de respuesta
        if tiempo_respuesta is None or tiempo_respuesta >= TIEMPO_LIMITE_SEGUNDOS:
            self.response_stats["tarde"] += 1
        elif tiempo_respuesta <= 5:
            self.response_stats["agil"] += 1
        else:
            self.response_stats["promedio"] += 1

    def answer(self, player: Player, question_id: str, option_index: int) -> Dict:
        db = read_db()
        q = db["questions"][question_id]
        correcta = int(option_index) == int(q["answer_index"])

        # Medir tiempo de respuesta si se dispone
        tiempo_respuesta: Optional[float] = None
        if self.current_start_time is not None:
            tiempo_respuesta = monotonic() - self.current_start_time
            self.current_start_time = None

        self._registrar_respuesta(player, q, correcta, tiempo_respuesta)

        if self.queue and self.queue[0]["id"] == question_id:
            self.queue.popleft()

        result = {
            "correct": correcta,
            "answer_index": q["answer_index"],
            "score": player.score,
        }
        self.history.append({"player": player.name, "question": question_id, **result})
        return result

    def podium(self) -> List[Dict]:
        ordered = sorted((p for p in self.players), key=lambda p: p.score, reverse=True)
        return [
            {"name": p.name, "score": p.score, "correct": p.correct, "wrong": p.wrong}
            for p in ordered
        ]

    def get_players(self) -> List[Player]:
        return list(self.players)

    def get_stats(self) -> Dict[str, Dict]:
        return {
            "errores_por_categoria": dict(self.errors_by_category),
            "tiempos_respuesta": dict(self.response_stats),
        }

