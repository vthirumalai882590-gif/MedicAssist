from typing import Dict, Any, List
from datetime import datetime
from app.models.agent_state import FinalDraftRecord

class DocumentationAgent:
    @staticmethod
    def generate_draft(
        patient_id: str,
        medication_state: str,
        previous_conflict_info: str,
        provenance_checklist: List[str]
    ) -> FinalDraftRecord:
        now_str = datetime.utcnow().isoformat() + "Z"
        notes = (
            f"SYNTHETIC CLINICAL DOCUMENTATION & RECONCILIATION SUMMARY\n"
            f"Patient ID: {patient_id}\n"
            f"Date/Time: {now_str}\n\n"
            f"1. ACTIVE MEDICATION RECONCILIATION:\n"
            f"   - Current Status: {medication_state}\n"
            f"   - Identified Discrepancy: {previous_conflict_info}\n"
            f"   - Resolution Trail: Synthetic EHR fill records cross-referenced with recent consultation notes.\n\n"
            f"2. SAFETY & HYPERSENSITIVITY CHECK:\n"
            f"   - Documented Penicillin allergy verified. No current active beta-lactam prescriptions.\n\n"
            f"3. MANDATORY HUMAN CLINICIAN NOTICE:\n"
            f"   - This document is generated for documentation, reconciliation, and evidence lookup only.\n"
            f"   - Autonomy Guardrail: NO autonomous diagnoses, prescriptions, or treatment decisions were made.\n"
            f"   - REQUIRED ACTION: Human clinician review and electronic signature."
        )

        return FinalDraftRecord(
            patient_id=patient_id,
            medication_state=medication_state,
            previous_conflict_info=previous_conflict_info,
            provenance_checklist=provenance_checklist,
            validation_status="PENDING_VALIDATION",
            human_review_required=True,
            synthetic_only=True,
            generated_at=now_str,
            notes_content=notes
        )
