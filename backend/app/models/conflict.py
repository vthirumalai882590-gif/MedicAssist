from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ConflictItem(BaseModel):
    conflict_id: str
    conflict_type: str  # medication_conflict, allergy_conflict, dosage_discrepancy, lab_value_conflict, demographic_mismatch
    field: str
    competing_values: Dict[str, Any]  # e.g., {"previous_note": "Medication A", "consultation": "Medication B"}
    detected_at: str
    status: str = "OPEN"  # OPEN, IN_VERIFICATION, RESOLVED, ESCALATED
    resolution: Optional[str] = None
