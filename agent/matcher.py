from __future__ import annotations

import json
from pathlib import Path

from .models import Interpreter, InterpreterMatch, Setting, TriageRequest, Urgency


DEFAULT_DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "interpreters.json"


def load_interpreters(path: Path = DEFAULT_DATA_PATH) -> tuple[Interpreter, ...]:
    records = json.loads(path.read_text(encoding="utf-8"))
    return tuple(
        Interpreter(
            id=item["id"],
            name=item["name"],
            languages=tuple(item["languages"]),
            settings=tuple(Setting(value) for value in item["settings"]),
            availability=item["availability"],
            available_at=item.get("available_at"),
            location=item["location"],
            experience_years=item["experience_years"],
            specialties=tuple(item.get("specialties", [])),
        )
        for item in records
    )


def match_interpreters(
    request: TriageRequest,
    urgency: Urgency,
    interpreters: tuple[Interpreter, ...] | None = None,
    limit: int = 3,
) -> tuple[InterpreterMatch, ...]:
    """Return explainable matches ordered by fit, not opaque ranking."""
    candidates = interpreters or load_interpreters()
    matches: list[InterpreterMatch] = []
    for interpreter in candidates:
        score = 0
        reasons: list[str] = []
        if request.language and any(request.language.casefold() == language.casefold() for language in interpreter.languages):
            score += 5
            reasons.append(f"{request.language} language match")
        if request.setting in interpreter.settings:
            score += 4
            reasons.append(f"{request.setting.value} setting experience")
        if interpreter.availability == "available_now":
            score += 3
            reasons.append("available now")
        if urgency == Urgency.EMERGENCY and interpreter.availability == "available_now":
            score += 2
            reasons.append("emergency-ready availability")
        if request.mode == "virtual" and "virtual" in interpreter.specialties:
            score += 1
            reasons.append("virtual session experience")
        if score > 0:
            matches.append(InterpreterMatch(interpreter, score, tuple(reasons)))
    matches.sort(key=lambda item: (item.score, item.interpreter.experience_years), reverse=True)
    return tuple(matches[:limit])
