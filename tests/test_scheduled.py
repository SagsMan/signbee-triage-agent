import unittest

from agent.models import TriageRequest, Urgency
from agent.workflow import triage_request


class ScheduledScenarioTests(unittest.TestCase):
    def test_school_event_is_scheduled_and_matches_nsl(self):
        result = triage_request(
            TriageRequest(
                text="A school graduation needs a Nigerian Sign Language interpreter in three weeks.",
                setting="school",  # type: ignore[arg-type]
                language="NSL",
                mode="in-person",
            )
        )
        self.assertEqual(result.urgency, Urgency.SCHEDULED)
        self.assertFalse(result.human_review_required)
        self.assertIn(result.matches[0].interpreter.name, {"Daniel M.", "Mary Olayemi"})
        self.assertIn("Confirm time and interpreter.", result.next_steps)


if __name__ == "__main__":
    unittest.main()
