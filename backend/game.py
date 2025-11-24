from typing import List, Dict
from collections import deque
import random
from .models import Player, Question
from .storage import read_db

class Game:
    """Lógica simple del juego: ruleta de categorías, cola de preguntas y puntajes."""
    def __init__(self, players: List[Player]):
        self.players = players
        self.turn_index = 0
        self.history: List[Dict] = []
        self.queue = deque()  # cola de preguntas actuales
        self.current_category = None

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
        return self.current_category

    def next_question(self):
        if self.queue:
            return self.queue[0]
        return None

    def answer(self, player: Player, question_id: str, option_index: int) -> Dict:
        db = read_db()
        q = db["questions"][question_id]
        correct = int(option_index) == int(q["answer_index"])
        if correct:
            player.add_points(10)
            player.correct += 1
        else:
            player.lose_points(2)
            player.wrong += 1
        if self.queue and self.queue[0]["id"] == question_id:
            self.queue.popleft()
        result = {"correct": correct, "answer_index": q["answer_index"], "score": player.score}
        self.history.append({"player": player.name, "question": question_id, **result})
        return result

    def podium(self) -> List[Dict]:
        ordered = sorted((p for p in self.players), key=lambda p: p.score, reverse=True)
        return [{"name": p.name, "score": p.score, "correct": p.correct, "wrong": p.wrong} for p in ordered]
