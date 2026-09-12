# SignBee Interpreter Triage Agent

Standalone Python triage and interpreter-matching service for SignBee.

## What it does

The deterministic workflow:

1. Accepts a plain-language interpreter request.
2. Extracts setting, urgency, language, mode, duration, and location.
3. Classifies emergency, scheduled, and human-review cases.
4. Ranks qualified interpreters from the local dataset with explainable reasons.
5. Escalates ambiguous or unsafe requests instead of guessing.
6. Returns confirmation, reminder, and post-booking check-in steps.

The current implementation does not claim live interpreter availability,
production booking, or a configured AI model. The dataset in
`data/interpreters.json` is mock data intended to be replaced by an
authenticated service.

## Project structure

```text
signbee-triage-agent/
├── agent/
│   ├── main.py                 # CLI entry point
│   ├── models.py               # Request and result types
│   ├── intake.py               # Plain-language request understanding
│   ├── classifier.py           # Urgency and human-review classification
│   ├── matcher.py              # Explainable interpreter ranking
│   ├── workflow.py             # End-to-end triage workflow
│   ├── strands_adapter.py      # Strands agent and triage tool
│   ├── agentcore_app.py        # Bedrock AgentCore runtime entry point
│   └── tools/
├── data/
│   └── interpreters.json       # Mock interpreter dataset
├── tests/
│   ├── test_emergency.py
│   └── test_scheduled.py
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

Run an emergency request:

```bash
python -m agent.main \
  "A patient needs an interpreter urgently in A&E within the hour" \
  --language ASL \
  --mode in-person \
  --location "Lagos hospital"
```

Run a scheduled request:

```bash
python -m agent.main \
  "A school graduation needs a Nigerian Sign Language interpreter in three weeks" \
  --language NSL \
  --setting school
```

## Strands and Bedrock AgentCore

The backend can wrap the deterministic triage tool with Strands and expose it
through Bedrock AgentCore. Configure AWS through the runtime environment and
never commit credentials:

```bash
export AWS_REGION=us-east-1
export BEDROCK_MODEL_ID=<model-id-available-in-your-region>
python -c "from agent.strands_adapter import create_strands_agent; print(create_strands_agent())"
python -m agent.agentcore_app
```

The AgentCore endpoint accepts JSON such as:

```json
{
  "prompt": "A patient needs an interpreter urgently in A&E",
  "mode": "in-person"
}
```

## Safety rules

- Emergency language is surfaced explicitly.
- Ambiguous hospital requests require human confirmation.
- Missing language or no suitable match is visible in the result.
- Match results include reasons for coordinator review.
- Mock availability is not production availability.
- AWS credentials, API keys, and personal data do not belong in this repository.