import os
import json
import logging
from typing import Dict, Any, List, Optional

logger = logging.getLogger("mediassistant.mongodb")

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("MONGODB_DB", "medicassist_db")

_mongo_client = None
_db = None
_is_connected = False

try:
    import pymongo
    from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

    # Short timeout to check if MongoDB is alive on startup
    _mongo_client = pymongo.MongoClient(MONGODB_URI, serverSelectionTimeoutMS=2000)
    # Ping database to verify connection
    _mongo_client.admin.command('ping')
    _db = _mongo_client[DATABASE_NAME]
    _is_connected = True
    logger.info(f"Successfully connected to MongoDB at {MONGODB_URI}, DB: {DATABASE_NAME}")
except Exception as e:
    _is_connected = False
    logger.warn(f"MongoDB not available ({e}). Operating in memory/JSON fallback mode.")

SYNTHETIC_PATIENTS_DATA = [
  {
    "patient_id": "SYN-001",
    "name": "Jane Doe (Synthetic)",
    "age": 58,
    "gender": "Female",
    "dob": "1968-04-12",
    "mrn": "MRN-984210",
    "primary_condition": "Type 2 Diabetes Mellitus & Stage 3a CKD",
    "condition": "Type 2 Diabetes Mellitus & Stage 3a CKD",
    "primary_physician": "Dr. Sarah Jenkins, MD (Endocrinology)",
    "last_visit": "2026-08-28",
    "synthetic_only": True,
    "allergies": ["Penicillin (Anaphylaxis)", "Sulfa Drugs (Mild Rash)"],
    "active_medications": [
      { "id": "m1", "name": "Metformin HCl", "dosage": "1000 mg", "frequency": "Oral - Twice Daily (BID)", "category": "Antidiabetic", "prescribed": "2024-03-15", "prescriber": "Dr. S. Jenkins", "status": "Active" },
      { "id": "m2", "name": "Amlodipine Besylate", "dosage": "5 mg", "frequency": "Oral - Once Daily (QD)", "category": "Antihypertensive", "prescribed": "2024-06-10", "prescriber": "Dr. R. Patel", "status": "Active" },
      { "id": "m3", "name": "Lisinopril", "dosage": "10 mg", "frequency": "Oral - Once Daily Morning", "category": "ACE Inhibitor", "prescribed": "2025-01-20", "prescriber": "Dr. R. Patel", "status": "Active" },
      { "id": "m4", "name": "Atorvastatin Calcium", "dosage": "20 mg", "frequency": "Oral - At Bedtime", "category": "Statin / Lipid Lowering", "prescribed": "2024-08-05", "prescriber": "Dr. S. Jenkins", "status": "Active" },
      { "id": "m5", "name": "Insulin Glargine (Lantus)", "dosage": "14 Units", "frequency": "Subcutaneous - Bedtime", "category": "Long-Acting Insulin", "prescribed": "2025-11-12", "prescriber": "Dr. S. Jenkins", "status": "Active" }
    ],
    "recent_labs": [
      { "id": "l1", "test": "Hemoglobin A1c (HbA1c)", "name": "Hemoglobin A1c (HbA1c)", "value": "8.9", "unit": "%", "ref_range": "4.0 - 5.6 %", "status": "High", "date": "2026-08-28", "trend": "↑ 0.6% from May" },
      { "id": "l2", "test": "Fasting Plasma Glucose", "name": "Fasting Plasma Glucose", "value": "168", "unit": "mg/dL", "ref_range": "70 - 99 mg/dL", "status": "High", "date": "2026-08-28", "trend": "↑ Elevated" },
      { "id": "l3", "test": "Estimated GFR (eGFR)", "name": "Estimated GFR (eGFR)", "value": "54", "unit": "mL/min/1.73m²", "ref_range": "> 60 mL/min/1.73m²", "status": "Low", "date": "2026-08-28", "trend": "Stage 3a CKD" },
      { "id": "l4", "test": "Blood Pressure (Systolic/Diastolic)", "name": "Blood Pressure (Systolic/Diastolic)", "value": "142 / 88", "unit": "mmHg", "ref_range": "< 120/80 mmHg", "status": "Elevated", "date": "2026-08-28", "trend": "Stage 1 HTN" },
      { "id": "l5", "test": "Serum Creatinine", "name": "Serum Creatinine", "value": "1.35", "unit": "mg/dL", "ref_range": "0.59 - 1.04 mg/dL", "status": "High", "date": "2026-08-28", "trend": "Slight elevation" },
      { "id": "l6", "test": "LDL Cholesterol", "name": "LDL Cholesterol", "value": "128", "unit": "mg/dL", "ref_range": "< 100 mg/dL", "status": "Borderline High", "date": "2026-08-28", "trend": "Needs titration" }
    ],
    "vitals": {
      "blood_pressure": "142/88 mmHg",
      "heart_rate": "74 bpm",
      "respiratory_rate": "16 /min",
      "temperature": "98.4 °F",
      "spo2": "98% on Room Air",
      "weight": "76.5 kg (168.6 lbs)",
      "bmi": "27.4 kg/m²"
    },
    "longitudinal_timeline": [
      { "year": 2024, "title": "Left Tibia Fractured (Leg Injury)", "details": "Surgical ORIF repair following fall down stairs. Full recovery after 12 weeks physical therapy.", "status": "Resolved" },
      { "year": 2025, "title": "Acute Respiratory Distress & Lung Complication", "details": "Hospitalized with severe viral pneumonia causing acute hypoxemic respiratory strain.", "status": "Resolved with regular monitoring" },
      { "year": 2026, "title": "Uncontrolled Type 2 Diabetes & Early CKD", "details": "HbA1c elevated to 8.9%. eGFR dropped to 54. Multi-agent titration in progress.", "status": "Active Management" }
    ]
  },
  {
    "patient_id": "SYN-002",
    "name": "John Smith (Synthetic)",
    "age": 64,
    "gender": "Male",
    "dob": "1962-09-15",
    "mrn": "MRN-331092",
    "primary_condition": "Post-PCI Coronary Artery Disease",
    "condition": "Post-PCI Coronary Artery Disease",
    "primary_physician": "Dr. Davis (Cardiology)",
    "last_visit": "2026-09-02",
    "synthetic_only": True,
    "allergies": ["Aspirin (Hives / Urticaria)"],
    "active_medications": [
      { "id": "m1", "name": "Clopidogrel", "dosage": "75 mg", "frequency": "Oral - Daily", "category": "Antiplatelet", "prescribed": "2026-08-20", "status": "Active" }
    ],
    "recent_labs": [
      { "id": "l1", "test": "Troponin I", "name": "Troponin I", "value": "0.02", "unit": "ng/mL", "ref_range": "< 0.04 ng/mL", "status": "Normal", "date": "2026-09-02" }
    ]
  },
  {
    "patient_id": "SYN-003",
    "name": "Robert Taylor (Synthetic)",
    "age": 49,
    "gender": "Male",
    "dob": "1977-01-20",
    "mrn": "MRN-104928",
    "primary_condition": "Chronic Kidney Disease Stage 3",
    "condition": "Chronic Kidney Disease Stage 3",
    "primary_physician": "Dr. Patel (Nephrology)",
    "last_visit": "2026-09-01",
    "synthetic_only": True,
    "allergies": [],
    "active_medications": [],
    "recent_labs": [
      { "id": "l1", "test": "Serum Potassium", "name": "Serum Potassium", "value": "5.8", "unit": "mEq/L", "ref_range": "3.5 - 5.0 mEq/L", "status": "High", "date": "2026-09-01" }
    ]
  }
]


class MongoDBManager:
    @staticmethod
    def is_connected() -> bool:
        return _is_connected

    @staticmethod
    def get_status() -> Dict[str, Any]:
        if not _is_connected or _db is None:
            return {
                "connected": False,
                "mode": "Standby In-Memory Fallback",
                "mongodb_uri": MONGODB_URI,
                "database": DATABASE_NAME,
                "patients_count": len(SYNTHETIC_PATIENTS_DATA)
            }
        try:
            count = _db["patients"].count_documents({})
            runs_count = _db["agent_runs"].count_documents({})
            return {
                "connected": True,
                "mode": "Live MongoDB Database Connected",
                "mongodb_uri": MONGODB_URI,
                "database": DATABASE_NAME,
                "patients_count": count,
                "agent_runs_count": runs_count,
                "collections": ["patients", "agent_runs", "clinical_logs"]
            }
        except Exception as e:
            return {
                "connected": False,
                "mode": "Error Querying MongoDB",
                "error": str(e),
                "patients_count": len(SYNTHETIC_PATIENTS_DATA)
            }

    @staticmethod
    def seed_synthetic_patients() -> Dict[str, Any]:
        if not _is_connected or _db is None:
            return {
                "status": "FALLBACK",
                "message": "MongoDB offline. Using in-memory synthetic patient collection.",
                "count": len(SYNTHETIC_PATIENTS_DATA)
            }
        try:
            collection = _db["patients"]
            inserted_count = 0
            updated_count = 0

            for p in SYNTHETIC_PATIENTS_DATA:
                res = collection.update_one(
                    {"patient_id": p["patient_id"]},
                    {"$set": p},
                    upsert=True
                )
                if res.upserted_id:
                    inserted_count += 1
                else:
                    updated_count += 1

            return {
                "status": "SUCCESS",
                "message": f"Successfully seeded MongoDB collection '{DATABASE_NAME}.patients'.",
                "inserted": inserted_count,
                "updated": updated_count,
                "total": collection.count_documents({})
            }
        except Exception as e:
            logger.error(f"Failed to seed MongoDB: {e}")
            return {"status": "ERROR", "message": str(e)}

    @staticmethod
    def get_patient(patient_id: str) -> Optional[Dict[str, Any]]:
        if _is_connected and _db is not None:
            try:
                patient = _db["patients"].find_one({"patient_id": patient_id}, {"_id": 0})
                if patient:
                    return patient
            except Exception as e:
                logger.warn(f"MongoDB query failed for patient_id={patient_id}: {e}")

        # Fallback to local array
        for p in SYNTHETIC_PATIENTS_DATA:
            if p["patient_id"] == patient_id:
                return p
        return None

    @staticmethod
    def list_patients() -> List[Dict[str, Any]]:
        if _is_connected and _db is not None:
            try:
                cursor = _db["patients"].find({}, {"_id": 0})
                pts = list(cursor)
                if pts:
                    return pts
            except Exception as e:
                logger.warn(f"MongoDB list query failed: {e}")

        return SYNTHETIC_PATIENTS_DATA

    @staticmethod
    def save_patient(patient_data: Dict[str, Any]) -> bool:
        if "patient_id" not in patient_data:
            return False

        if _is_connected and _db is not None:
            try:
                _db["patients"].update_one(
                    {"patient_id": patient_data["patient_id"]},
                    {"$set": patient_data},
                    upsert=True
                )
                return True
            except Exception as e:
                logger.error(f"Failed to save patient to MongoDB: {e}")

        # Update in-memory fallback
        for idx, p in enumerate(SYNTHETIC_PATIENTS_DATA):
            if p["patient_id"] == patient_data["patient_id"]:
                SYNTHETIC_PATIENTS_DATA[idx] = patient_data
                return True

        SYNTHETIC_PATIENTS_DATA.append(patient_data)
        return True

    @staticmethod
    def save_agent_run(run_id: str, run_state: Dict[str, Any]) -> bool:
        if _is_connected and _db is not None:
            try:
                _db["agent_runs"].update_one(
                    {"run_id": run_id},
                    {"$set": run_state},
                    upsert=True
                )
                return True
            except Exception as e:
                logger.error(f"Failed to log run state to MongoDB: {e}")
        return False
