from typing import Dict, Any

class LabRetrieverTool:
    @staticmethod
    def retrieve(patient_id: str) -> Dict[str, Any]:
        if patient_id == "SYN-001":
            return {
                "patient_id": patient_id,
                "recent_labs": [
                    {"test": "HbA1c", "value": "7.2%", "range": "< 7.0%", "flag": "HIGH"},
                    {"test": "Serum Creatinine", "value": "0.9 mg/dL", "range": "0.6-1.2 mg/dL", "flag": "NORMAL"},
                    {"test": "eGFR", "value": "> 60 mL/min", "range": "> 60", "flag": "NORMAL"},
                    {"test": "Potassium", "value": "4.2 mEq/L", "range": "3.5-5.0 mEq/L", "flag": "NORMAL"}
                ],
                "synthetic_only": True
            }
        return {"patient_id": patient_id, "recent_labs": [], "synthetic_only": True}
