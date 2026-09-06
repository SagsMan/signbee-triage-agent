from __future__ import annotations

from .classifier import classify_urgency, human_review_reason
from .intake import understand_request
from .matcher import match_interpreters
from .models import TriageResult, TriageRequest, Urgency


def triage_request(request: TriageRequest) -> TriageResult:
    understood = understand_request(request)
    urgency = classify_urgency(understood)
    review_reason = human_review_reason(understood, urgency)
    review_required = review_reason is not None
    matches = match_interpreters(understood, urgency)
    next_steps: list[str] = []
    if review_required:
        next_steps.append("Escalate to a human coordinator before confirming the request.")
    elif matches:
        next_steps.extend(("Confirm time and interpreter.", "Send reminder.", "Schedule post-booking check-in."))
    else:
        next_steps.append("Escalate to a human coordinator because no suitable interpreter was found.")
    return TriageResult(
        request=understood,
        urgency=urgency,
        understanding={
            "setting": understood.setting.value,
            "language": understood.language,
            "dialect": understood.dialect,
            "duration_minutes": understood.duration_minutes,
            "mode": understood.mode,
        },
        human_review_required=review_required or not matches,
        human_review_reason=review_reason or ("No suitable interpreter was found." if not matches else None),
        matches=matches,
        next_steps=tuple(next_steps),
    )
