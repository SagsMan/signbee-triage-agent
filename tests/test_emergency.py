import unittest

from agent.models import TriageRequest, Urgency
from agent.workflow import triage_request


class EmergencyScenarioTests(unittest.TestCase):
    def test_hospital_emergency_matches_available_medical_interpreter(self):
        result = triage_request(
            TriageRequest(
                text="A patient needs an interpreter urgently in A&E within the hour.",
                language="ASL",
                mode="in-person",
                location="Lagos hospital",
            )
        )
        self.assertEqual(result.urgency, Urgency.EMERGENCY)
        self.assertFalse(result.human_review_required)
        self.assertTrue(result.matches)
        self.assertIn("ASL", result.matches[0].reasons[0])

    def test_ambiguous_hospital_request_escalates(self):
        result = triage_request(
            TriageRequest(text="A patient needs a sign language interpreter at the hospital.")
        )
        self.assertTrue(result.human_review_required)
        self.assertIsNotNone(result.human_review_reason)


if __name__ == "__main__":
    unittest.main()
