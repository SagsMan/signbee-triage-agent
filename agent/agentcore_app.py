"""Bedrock AgentCore runtime entry point for the SignBee triage agent.

Run locally with:
    python -m agent.agentcore_app

The deterministic triage tool remains explainable and testable without AWS.
Strands and AgentCore are imported here so local unit tests do not require AWS
credentials or the hosted runtime.
"""

from __future__ import annotations

import os
from typing import Any

from .strands_adapter import create_strands_agent, triage_interpreter_request

try:
    from bedrock_agentcore.runtime import BedrockAgentCoreApp
except ImportError as exc:  # pragma: no cover - exercised only in runtime setup
    BedrockAgentCoreApp = None  # type: ignore[assignment]
    _AGENTCORE_IMPORT_ERROR = exc


if BedrockAgentCoreApp is not None:
    app = BedrockAgentCoreApp()
    agent = create_strands_agent()

    @app.entrypoint
    def invoke(payload: dict[str, Any]) -> dict[str, Any]:
        """Handle an AgentCore invocation payload."""
        prompt = str(payload.get("prompt", "")).strip()
        if not prompt:
            return {"error": "payload.prompt is required"}
        mode = str(payload.get("mode", "in-person"))
        result = agent(f"Session mode: {mode}\nRequest: {prompt}")
        return {
            "result": getattr(result, "message", str(result)),
            "mode": mode,
            "model_id": os.getenv("BEDROCK_MODEL_ID", "provider-default"),
        }
else:
    app = None

    def invoke(payload: dict[str, Any]) -> dict[str, Any]:
        raise RuntimeError(
            "Install strands-agents and bedrock-agentcore before starting the "
            "Bedrock AgentCore runtime."
        ) from _AGENTCORE_IMPORT_ERROR


if __name__ == "__main__":
    if app is None:
        invoke({})
    app.run()
