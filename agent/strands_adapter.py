from __future__ import annotations

import json
import os

from .models import Setting, TriageRequest
from .workflow import triage_request

try:
    from strands import Agent, tool
except ImportError:  # Optional until AWS Strands access is configured.
    Agent = None  # type: ignore[assignment]

    def tool(function):  # type: ignore[no-untyped-def]
        return function


@tool
def triage_interpreter_request(request: str, mode: str = "in-person") -> str:
    """Triage a plain-language SignBee interpreter request and return JSON."""
    result = triage_request(TriageRequest(text=request, mode=mode))
    return json.dumps({
        "urgency": result.urgency.value,
        "understanding": result.understanding,
        "human_review_required": result.human_review_required,
        "human_review_reason": result.human_review_reason,
        "matches": [match.interpreter.name for match in result.matches],
        "next_steps": result.next_steps,
    })


def create_strands_agent():
    """Create the Strands agent once the Strands SDK and AWS model access exist."""
    if Agent is None:
        raise RuntimeError(
            "AWS Strands Agents SDK is not installed. Install requirements.txt and configure AWS access."
        )
    agent_options = {
        "system_prompt": (
            "You are SignBee Triage Agent. Understand interpreter requests, classify urgency, "
            "match qualified interpreters, explain your reasoning, and escalate ambiguous or "
            "high-risk cases to a human coordinator. Never invent availability."
        ),
        "tools": [triage_interpreter_request],
    }
    model_id = os.getenv("BEDROCK_MODEL_ID")
    if model_id:
        agent_options["model"] = model_id
    return Agent(**agent_options)
