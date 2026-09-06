from __future__ import annotations

from .models import Setting, TriageRequest, Urgency


_EMERGENCY_TERMS = (
    "urgent",
    "urgently",
    "emergency",
    "right now",
    "asap",
    "immediately",
    "a&e",
    "accident",
    "critical",
    "within the hour",
)


def classify_urgency(request: TriageRequest) -> Urgency:
    """Classify only what can be safely inferred from the request.

    Ambiguous requests are routed to human review rather than being silently
    treated as emergencies or scheduled work.
    """
    lowered = request.text.casefold()
    if any(term in lowered for term in _EMERGENCY_TERMS):
        return Urgency.EMERGENCY
    if request.setting == Setting.HOSPITAL and request.mode == "in-person" and not request.requested_time:
        return Urgency.HUMAN_REVIEW
    return Urgency.SCHEDULED


def human_review_reason(request: TriageRequest, urgency: Urgency) -> str | None:
    if urgency == Urgency.HUMAN_REVIEW:
        return "Hospital request needs a human to confirm timing and clinical context."
    if not request.language:
        return "Sign language or dialect was not identified from the request."
    return None
