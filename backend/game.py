import random
from typing import Dict, List, Optional, Set

from .storage import read_db
from .models import Player


class Game:
    def __init__(self, players: Optional[List[Player]] = None) -> None:
        # Jugadores compartidos con el exterior (por referencia)
        self.players: List[Player] = players if players is not None else []
        self._load()

    def _load(self) -> None:
        self.db: Dict = read_db()
        self.asked_ids: Set[str] = set()
        self.last_category: Optional[str] = None

    def categories(self) -> List[str]:
        return list(self.db.get("categories", {}).keys())

    def _question_by_id(self, qid: str) -> Optional[Dict]:
        return self.db.get("questions", {}).get(qid)

    def _pick_unasked_from_category(self, category: str) -> Optional[str]:
        ids = self.db.get("categories", {}).get(category, {}).get("question_ids", [])
        remaining = [q for q in ids if q not in self.asked_ids]
        if not remaining:
            remaining = ids[:]  # reset si se agotaron
        if not remaining:
            return None
        return random.choice(remaining)

    def spin(self) -> Dict:
        cats = self.categories()
        if not cats:
            return {"category": None, "question": None}
        cat = random.choice(cats)
        self.last_category = cat
        qid = self._pick_unasked_from_category(cat)
        q = self._question_by_id(qid) if qid else None
        if qid:
            self.asked_ids.add(qid)
        return {"category": cat, "question": q}

    # Compatibilidad: girar ruleta y devolver solo la categoría
    def spin_wheel(self) -> Optional[str]:
        cats = self.categories()
        if not cats:
            self.last_category = None
            return None
        cat = random.choice(cats)
        self.last_category = cat
        return cat

    def next_question(self) -> Optional[Dict]:
        all_ids = list(self.db.get("questions", {}).keys())
        remaining = [q for q in all_ids if q not in self.asked_ids]
        if not remaining:
            self.asked_ids.clear()
            remaining = all_ids
        if not remaining:
            return None
        qid = random.choice(remaining)
        self.asked_ids.add(qid)
        return self._question_by_id(qid)

    def answer(self, player: Player, question_id: str, option_index: int) -> Dict:
        q = self._question_by_id(question_id)
        if not q:
            return {"correct": False, "answer_index": None}
        correct = int(option_index) == int(q["answer_index"])  # type: ignore[index]
        if correct:
            player.score += 10
            player.correct += 1
        else:
            player.wrong += 1
        return {"correct": correct, "answer_index": q["answer_index"]}

    def podium(self) -> List[Dict]:
        # Ordenar por score desc, correct desc, wrong asc, nombre asc
        ordered = sorted(
            self.players,
            key=lambda p: (-p.score, -p.correct, p.wrong, p.name.lower()),
        )
        return [p.to_dict() for p in ordered]


# Nota: La instancia del juego se crea en main.py pasando la lista de jugadores
