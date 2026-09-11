"""Small local web demo for the SignBee triage agent.

Run with:
    python demo_server.py

The demo deliberately uses the deterministic triage workflow by default. It
keeps the screen flow useful without requiring AWS credentials, while the
Strands/AgentCore entry point remains available for hosted deployment.
"""

from __future__ import annotations

import json
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

from agent.models import Setting, TriageRequest
from agent.workflow import triage_request


ROOT = Path(__file__).resolve().parent
DEMO_DIR = ROOT / "demo"


def triage_payload(payload: dict[str, Any]) -> dict[str, Any]:
    """Convert a browser payload into the public JSON response shape."""
    text = str(payload.get("situation", "")).strip()
    if not text:
        raise ValueError("situation is required")

    raw_setting = str(payload.get("setting", "other")).strip().lower()
    try:
        setting = Setting(raw_setting)
    except ValueError:
        setting = Setting.OTHER

    mode = str(payload.get("mode", "in-person")).strip().lower()
    if mode not in {"in-person", "virtual"}:
        mode = "in-person"

    result = triage_request(
        TriageRequest(
            text=text,
            setting=setting,
            language=str(payload.get("language", "")).strip() or None,
            mode=mode,
            location=str(payload.get("location", "")).strip() or None,
        )
    )

    return {
        "urgency": result.urgency.value,
        "understanding": result.understanding,
        "human_review_required": result.human_review_required,
        "human_review_reason": result.human_review_reason,
        "matches": [
            {
                "id": match.interpreter.id,
                "name": match.interpreter.name,
                "location": match.interpreter.location,
                "availability": match.interpreter.availability,
                "available_at": match.interpreter.available_at,
                "experience_years": match.interpreter.experience_years,
                "score": match.score,
                "reasons": list(match.reasons),
            }
            for match in result.matches
        ],
        "next_steps": list(result.next_steps),
    }


class DemoHandler(SimpleHTTPRequestHandler):
    """Serve the agent UI and its local triage endpoint."""

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, directory=str(DEMO_DIR), **kwargs)

    def do_POST(self) -> None:  # noqa: N802 - required by stdlib handler
        if urlparse(self.path).path != "/api/triage":
            self.send_error(404, "Not found")
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length) or b"{}")
            response = triage_payload(payload)
            self._send_json(200, response)
        except (json.JSONDecodeError, TypeError, ValueError) as exc:
            self._send_json(400, {"error": str(exc)})
        except Exception as exc:  # pragma: no cover - defensive server boundary
            self._send_json(500, {"error": "Triage failed", "detail": str(exc)})

    def _send_json(self, status: int, payload: dict[str, Any]) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format: str, *args: Any) -> None:
        # Keep the demo output useful without logging request bodies.
        print(f"[demo] {self.address_string()} - {format % args}")


def main() -> None:
    port = 8000
    server = ThreadingHTTPServer(("127.0.0.1", port), DemoHandler)
    print(f"SignBee Agent demo running at http://127.0.0.1:{port}")
    print("Press Ctrl+C to stop.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping SignBee Agent demo.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()