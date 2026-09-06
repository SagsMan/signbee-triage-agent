from __future__ import annotations

import re
from dataclasses import replace

from .models import Setting, TriageRequest


_SETTING_TERMS: dict[Setting, tuple[str, ...]] = {
    Setting.HOSPITAL: ("hospital", "clinic", "patient", "doctor", "a&e", "emergency"),
    Setting.SCHOOL: ("school", "class", "student", "lesson", "graduation", "university"),
    Setting.EVENT: ("event", "conference", "ceremony", "meeting", "organizer"),
    Setting.COURT: ("court", "judge", "lawyer", "legal", "hearing", "police"),
}

_LANGUAGE_TERMS = (
    "ASL",
    "NSL",
    "BSL",
    "MSL",
    "ArSL",
    "American Sign Language",
    "Nigerian Sign Language",
    "British Sign Language",
    "Arabic Sign Language",
)


def infer_setting(text: str) -> Setting:
    lowered = text.casefold()
    for setting, terms in _SETTING_TERMS.items():
        if any(term.casefold() in lowered for term in terms):
            return setting
    return Setting.OTHER


def infer_language(text: str) -> str | None:
    for language in _LANGUAGE_TERMS:
        if language.casefold() in text.casefold():
            return language
    return None


def infer_duration_minutes(text: str) -> int | None:
    match = re.search(r"(\d+)\s*(minute|minutes|min|hour|hours|hr|hrs)", text.casefold())
    if not match:
        return None
    amount = int(match.group(1))
    return amount * 60 if match.group(2).startswith(("hour", "hr")) else amount


def understand_request(request: TriageRequest) -> TriageRequest:
    """Fill missing structured fields from a plain-language request."""
    provided_setting = request.setting
    if not isinstance(provided_setting, Setting):
        provided_setting = Setting(provided_setting)
    return replace(
        request,
        setting=provided_setting if provided_setting != Setting.OTHER else infer_setting(request.text),
        language=request.language or infer_language(request.text),
        duration_minutes=request.duration_minutes or infer_duration_minutes(request.text),
    )
