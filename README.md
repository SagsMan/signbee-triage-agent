# SignBee Interpreter Triage Agent

> **Agents for Humans Hackathon** · Track: Professional Agents · Built for AWS Strands Agents SDK and Bedrock AgentCore

This repository contains the standalone triage and matching core for SignBee. It is the agent-side companion to the mobile UI in [`SagsMan/SignBEE`](https://github.com/SagsMan/SignBEE).

![SignBee triage agent architecture](architecture.png)

## Why this repository exists

Hospitals, schools, courts, and event organizers often describe an interpreter need in plain language without knowing which details matter. The SignBee Triage Agent turns that request into a safe, explainable workflow:

1. **Intake** — accept a text request, with voice intake as a future adapter.
2. **Understanding** — extract setting, urgency signals, language/dialect, mode, duration, and location.
3. **Urgency classification** — separate emergency work from scheduled work and route ambiguous hospital requests to a human.
4. **Interpreter matching** — rank qualified interpreters using language, setting experience, availability, and explainable reasons.
5. **Human escalation** — avoid silent guesses when the request is ambiguous, high risk, or has no suitable match.
6. **Confirmation loop** — return confirmation, reminder, and post-booking check-in steps.

The companion SignBEE app now exposes the matching UI flow: request intake, triage state, matched interpreter, monitoring status, and messaging.

## Current implementation

The deterministic Python core in `agent/` runs locally without AWS credentials. It is the safe baseline for tests and demos while the AWS Strands/Bedrock access is being configured. `agent/strands_adapter.py` provides the optional Strands entry point and wraps the same explainable triage tool.

The current implementation does **not** claim to be connected to live interpreter availability, production booking, or an AI model until those services are configured. The mock dataset in `data/interpreters.json` is intentionally replaceable.

## Project structure

```text
signbee-triage-agent/
├── agent/
│   ├── main.py                 # CLI entry point
│   ├── models.py               # Request, interpreter, match, and result types
│   ├── intake.py               # Plain-language request understanding
│   ├── classifier.py           # Emergency/scheduled/human-review classification
│   ├── matcher.py              # Explainable interpreter ranking
│   ├── workflow.py             # End-to-end deterministic triage workflow
│   ├── strands_adapter.py      # Optional AWS Strands integration boundary
│   └── tools/                  # Strands tool package boundary
├── data/
│   └── interpreters.json       # Mock interpreter dataset
├── tests/
│   ├── test_emergency.py       # Emergency and escalation scenarios
│   └── test_scheduled.py       # Scheduled matching scenario
├── architecture.png            # Architecture diagram
├── requirements.txt
└── README.md
```

## Setup and local run

```bash
git clone https://github.com/SagsMan/signbee-triage-agent.git
cd signbee-triage-agent
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m unittest discover -s tests -v
```

Run a local request without AWS access:

```bash
python -m agent.main \
  "A patient needs an interpreter urgently in A&E within the hour" \
  --language ASL \
  --mode in-person \
  --location "Lagos hospital"
```

Or run the scheduled school scenario:

```bash
python -m agent.main \
  "A school graduation needs a Nigerian Sign Language interpreter in three weeks" \
  --language NSL \
  --setting school
```

## Strands and Bedrock integration boundary

When the AWS Strands access is available, install the requirements and configure AWS through the runtime’s secret manager or environment—not by committing credentials:

```bash
export AWS_REGION=us-east-1
python -c "from agent.strands_adapter import create_strands_agent; print(create_strands_agent())"
```

The adapter is intentionally narrow. The agent should call the triage tool, preserve the structured result, explain match reasons, and escalate instead of inventing availability. A future runtime integration can replace the local matcher with authenticated SignBee booking and interpreter services.

## Safety and escalation rules

- Emergency language is surfaced explicitly; it is not hidden behind a score.
- Ambiguous hospital requests require human confirmation.
- Missing language or no suitable match is visible in the result.
- Match results include reasons so a coordinator can inspect the recommendation.
- Mock availability is not production availability.
- No AWS credentials, API keys, or personal data belong in this repository.

## Credits

- **Maryam** — UI/UX Designer for both the SignBee app and SignBee Agent
- **Sagiru** — Developer

## Team

- **Sagiru Garba** — Development / implementation
- **Maryam Bola** — Product / agent design

## License

MIT — see [LICENSE](LICENSE).

Built for the Agents for Humans Hackathon · Submissions close September 14, 2026.
