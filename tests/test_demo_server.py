import unittest

from demo_server import triage_payload


class DemoPayloadTests(unittest.TestCase):
    def test_payload_returns_matchable_agent_response(self):
        result = triage_payload(
            {
                "situation": "A patient needs an interpreter urgently in A&E within the hour.",
                "language": "ASL",
                "mode": "in-person",
                "location": "Lagos hospital",
            }
        )

        self.assertEqual(result["urgency"], "emergency")
        self.assertFalse(result["human_review_required"])
        self.assertTrue(result["matches"])
        self.assertIn("ASL", result["matches"][0]["reasons"][0])

    def test_payload_requires_situation(self):
        with self.assertRaises(ValueError):
            triage_payload({"mode": "virtual"})


if __name__ == "__main__":
    unittest.main()