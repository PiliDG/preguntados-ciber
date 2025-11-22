from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import List, Dict, Any

class BaseEntity(ABC):
    """Entidad base abstracta para el proyecto."""
    @abstractmethod
    def to_dict(self) -> Dict[str, Any]:
        ...

@dataclass
class Question(BaseEntity):
    id: str
    category: str
    text: str
    options: List[str]
    answer_index: int

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "category": self.category,
            "text": self.text,
            "options": self.options,
            "answer_index": self.answer_index,
        }

@dataclass
class Category(BaseEntity):
    name: str
    question_ids: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return {"name": self.name, "question_ids": self.question_ids}

class Player(BaseEntity):
    """Jugador con encapsulamiento de su puntaje."""
    def __init__(self, name: str):
        self.name = name
        self.__score = 0  # privado
        self.correct = 0
        self.wrong = 0

    def add_points(self, points: int) -> None:
        self.__score += points

    def lose_points(self, points: int) -> None:
        self.__score = max(0, self.__score - points)

    @property
    def score(self) -> int:
        return self.__score

    def to_dict(self) -> Dict[str, Any]:
        return {"name": self.name, "score": self.__score, "correct": self.correct, "wrong": self.wrong}
