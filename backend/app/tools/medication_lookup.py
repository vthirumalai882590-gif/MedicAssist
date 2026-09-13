from typing import Dict, Any

class MedicationLookupTool:
    """
    Synthetic Medication Repository Lookup Tool.
    Retrieves active prescriptions, filled status, and formulation specs.
    """
    @staticmethod
    def lookup(patient_id: str, medication_query: str = "") -> Dict[str, Any]:
        # Simulated synthetic EHR query result
        if patient_id == "SYN-001":
            return {
                "patient_id": patient_id,
                "queried_medication": medication_query or "Amlodipine / Lisinopril",
                "active_prescriptions": [
                    {
                        "medication_name": "Medication B (Amlodipine)",
                        "dosage": "5mg PO daily",
                        "status": "Active",
                        "last_filled": "2026-09-08",
                        "pharmacy_status": "Filled"
                    }
                ],
                "historical_prescriptions": [
                    {
                        "medication_name": "Medication A (Lisinopril)",
                        "dosage": "10mg PO daily",
                        "status": "Discontinued / Reconciling",
                        "discontinued_date": "2026-09-07"
                    }
                ],
                "synthetic_only": True
            }
        return {
            "patient_id": patient_id,
            "status": "NO_RECORDS_FOUND",
            "synthetic_only": True
        }
