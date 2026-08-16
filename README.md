# SignBee Interpreter Triage Agent

> **Agents for Humans Hackathon** · Track: Professional Agents · Built with AWS Strands Agents SDK

An autonomous AI agent that sits in front of SignBee's interpreter booking process — understanding what an institution needs, triaging urgency, matching qualified sign language interpreters, and only looping in a human when a real judgment call is required.

---

## The Problem

Sign language interpreter access in Nigeria is inconsistent and slow to arrange. Hospitals, courts, schools, and event organizers often don't know what to ask for, how urgent their need is, or which interpreter is right for their context. That triage work is entirely manual today.

## What the Agent Does

1. **Intake** — Accepts a booking request in plain language (text or voice)
2. **Understanding** — Extracts urgency level, setting (medical, legal, educational, event), language/dialect, and duration
3. **Triage** — Classifies urgency (emergency vs. scheduled), escalates to a human only when a real judgment call is needed
4. **Matching** — Checks interpreter availability and experience against the request, proposes a shortlist
5. **Confirmation loop** — Handles follow-up autonomously: confirming time, sending reminders, post-booking check-in

## Demo Scenarios

| Scenario | Description |
|---|---|
| Emergency | Hospital needs an interpreter for a deaf patient in A&E — within the hour |
| Scheduled | School event organizer booking an interpreter for a graduation ceremony in 3 weeks |

## Tech Stack

| Layer | Technology |
|---|---|
| Agent framework | AWS Strands Agents SDK |
| Deployment | AWS Bedrock AgentCore |
| Language | Python |
| Interpreter data | Mock dataset (5-10 profiles: language, availability, setting experience) |
| Intake | Text-based (voice as stretch goal) |

## Project Structure

```
signbee-triage-agent/
├── agent/
│   ├── main.py              # Agent entry point
│   ├── intake.py            # Request parsing & extraction
│   ├── classifier.py        # Urgency classification logic
│   ├── matcher.py           # Interpreter matching logic
│   └── tools/               # Strands tool definitions
├── data/
│   └── interpreters.json    # Mock interpreter dataset
├── tests/
│   ├── test_emergency.py    # Emergency scenario tests
│   └── test_scheduled.py    # Scheduled scenario tests
├── architecture.png         # System architecture diagram
├── requirements.txt
└── README.md
```

## Setup & Running

```bash
# Clone the repo
git clone https://github.com/SagsMan/signbee-triage-agent.git
cd signbee-triage-agent

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export AWS_REGION=us-east-1
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret

# Run the agent
python agent/main.py
```

## License

MIT — see LICENSE

## Team

- **Sagiru Garba** — Product / agent design
- **Maryam Bola** — Development / implementation

---

Built for the Agents for Humans Hackathon · Submissions close September 14, 2026
