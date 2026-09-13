from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class PatientSource(BaseModel):
    id: str
    type: str  # transcript, previous_note, medication_db, allergy_record, lab_report
    title: str
    timestamp: str
    content: str
    metadata: Dict[str, Any] = Field(default_factory=dict)

class PatientData(BaseModel):
    patient_id: str
    name: str
    age: int
    gender: str
    primary_condition: str
    sources: List[PatientSource]
    synthetic_only: bool = True
