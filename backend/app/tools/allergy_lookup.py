from typing import Dict, Any

class AllergyLookupTool:
    @staticmethod
    def lookup(patient_id: str) -> Dict[str, Any]:
        if patient_id == "SYN-001":
            return {
                "patient_id": patient_id,
                "allergies": [
                    {"substance": "Penicillin", "reaction": "Urticaria / Rash", "severity": "Moderate"},
                    {"substance": "Sulfa drugs", "reaction": "Mild Nausea", "severity": "Mild"}
                ],
                "synthetic_only": True
            }
        return {"patient_id": patient_id, "allergies": [], "synthetic_only": True}
