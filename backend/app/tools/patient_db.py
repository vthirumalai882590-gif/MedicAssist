import json
import os
from typing import Dict, Any, Optional, List
from app.mongodb import MongoDBManager

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "synthetic_patients.json")

class PatientDBTool:
    @staticmethod
    def get_patient(patient_id: str) -> Optional[Dict[str, Any]]:
        # 1. Try fetching from MongoDB first
        patient = MongoDBManager.get_patient(patient_id)
        if patient:
            return patient

        # 2. Fallback to local JSON file
        if os.path.exists(DATA_PATH):
            with open(DATA_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                for p in data.get("patients", []):
                    if p["patient_id"] == patient_id:
                        return p
        return None

    @staticmethod
    def list_patients() -> List[Dict[str, Any]]:
        # 1. Try fetching from MongoDB
        pts = MongoDBManager.list_patients()
        if pts:
            return pts

        # 2. Fallback to local JSON file
        if os.path.exists(DATA_PATH):
            with open(DATA_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                return data.get("patients", [])
        return []

    @staticmethod
    def save_patient(patient_data: Dict[str, Any]) -> bool:
        return MongoDBManager.save_patient(patient_data)

