from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Any


class Urgency(str, Enum):
    EMERGENCY = "emergency"
    SCHEDULED = "scheduled"
    HUMAN_REVIEW = "human_review"


class Setting(str, Enum):
    HOSPITAL = "hospital"
    SCHOOL = "school"
    EVENT = "event"
    COURT = "court"
    OTHER = "other"


@dataclass(frozen=True)
class TriageRequest:
    text: str
    setting: Setting = Setting.OTHER
    language: str | None = None
    dialect: str | None = None
    duration_minutes: int | None = None
    location: str | None = None
    mode: str = "in-person"
    requested_time: str | None = None


@dataclass(frozen=True)
class Interpreter:
    id: str
    name: str
    languages: tuple[str, ...]
    settings: tuple[Setting, ...]
    availability: str
    available_at: str | None
    location: str
    experience_years: int
    specialties: tuple[str, ...] = field(default_factory=tuple)


@dataclass(frozen=True)
class InterpreterMatch:
    interpreter: Interpreter
    score: int
    reasons: tuple[str, ...]


@dataclass(frozen=True)
class TriageResult:
    request: TriageRequest
    urgency: Urgency
    understanding: dict[str, Any]
    human_review_required: bool
    human_review_reason: str | None
    matches: tuple[InterpreterMatch, ...]
    next_steps: tuple[str, ...]
