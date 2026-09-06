from __future__ import annotations

import argparse
import json

from .models import Setting, TriageRequest
from .workflow import triage_request


def main() -> None:
    parser = argparse.ArgumentParser(description="Run a SignBee interpreter triage request")
    parser.add_argument("text", nargs="?", help="Plain-language request")
    parser.add_argument("--setting", choices=[setting.value for setting in Setting], default="other")
    parser.add_argument("--language", default=None)
    parser.add_argument("--mode", choices=["in-person", "virtual"], default="in-person")
    parser.add_argument("--location", default=None)
    args = parser.parse_args()
    text = args.text or input("Describe the interpreter request: ")
    result = triage_request(
        TriageRequest(
            text=text,
            setting=Setting(args.setting),
            language=args.language,
            mode=args.mode,
            location=args.location,
        )
    )
    print(json.dumps({
        "urgency": result.urgency.value,
        "understanding": result.understanding,
        "human_review_required": result.human_review_required,
        "human_review_reason": result.human_review_reason,
        "matches": [
            {"name": match.interpreter.name, "score": match.score, "reasons": match.reasons}
            for match in result.matches
        ],
        "next_steps": result.next_steps,
    }, indent=2))


if __name__ == "__main__":
    main()
