from dataclasses import dataclass, field
from typing import List, Dict
from pydantic import BaseModel


class AnswerIn(BaseModel):
    player: str
    question_id: str
    option_index: int


class QuestionIn(BaseModel):
    category: str
    text: str
    options: List[str]
    answer_index: int


@dataclass
class Question:
    id: str
    category: str
    text: str
    options: List[str]
    answer_index: int

    def to_dict(self) -> Dict:
        return {
            "id": self.id,
            "category": self.category,
            "text": self.text,
            "options": self.options,
            "answer_index": self.answer_index,
        }


@dataclass
class Category:
    name: str
    question_ids: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict:
        return {"name": self.name, "question_ids": list(self.question_ids)}


@dataclass
class Player:
    name: str
    score: int = 0
    correct: int = 0
    wrong: int = 0

    def to_dict(self) -> Dict:
        return {
            "name": self.name,
            "score": self.score,
            "correct": self.correct,
            "wrong": self.wrong,
        }

