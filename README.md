# SignBee Interpreter Triage Agent

SignBee has two parts in this repository: a React Native/Expo Go frontend and
a Python triage and interpreter-matching backend.

## Quick start

### Start in Replit

1. Open the **SignBee Triage Agent** app preview.
2. Wait for the Expo workflow to finish starting.
3. Use the preview pane to view the app, or scan the displayed QR code with
   Expo Go on your phone.

The Replit workflow starts the mobile client with:

```bash
pnpm --filter @workspace/signbee-triage-agent run dev
```

### Start locally

From the project root:

```bash
pnpm install
pnpm --filter @workspace/signbee-triage-agent run dev
```

To run the Python triage agent as well, open a second terminal:

```bash
cd artifacts/signbee-triage-agent
python -m pip install -r requirements.txt
python demo_server.py
```

The demo server listens on `http://127.0.0.1:8000` and exposes the
`POST /api/triage` endpoint. The Expo client and Python service are currently
started independently.

## Frontend

The root Expo app is the client-facing surface for the SignBee experience. It
uses React Native with Expo Router and currently contains a neutral starter
screen, ready for the intake, matching, status, and messaging flows to be
added.

```bash
npm install
npm run start:tunnel
```

Scan the printed QR code with Expo Go. The frontend lives in `app/`, with
`app.json` and `package.json` providing the Expo configuration and scripts.

## Backend

The Python service in `agent/` owns request understanding, urgency
classification, interpreter matching, human escalation, and the Strands /
Bedrock AgentCore adapter. It uses `data/interpreters.json` as a replaceable
local dataset and is covered by the tests in `tests/`.

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
├── app/
│   ├── index.tsx              # Expo Go starter screen
│   └── _layout.tsx            # Expo Router root layout
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
│   ├── test_demo_server.py
│   ├── test_emergency.py
│   └── test_scheduled.py
├── app.json
├── package.json
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

Run the frontend and backend independently: use the Expo command above for
the mobile client, and use the Python commands below for backend requests.

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