from typing import Dict, Any, List
from app.models.agent_state import SvwgWorkflow, SvwgChecklistItem

class SVWGEngine:
    """
    3.3 SVWG — Synthetic Verification Workflow Generator
    Produces step-by-step synthetic-only checklist for resolving conflicts.
    Rules-based, keyed by conflict_type.
    """
    RULES = {
        "medication_conflict": [
            "Open synthetic medication lookup",
            "Select patient {patient_id}",
            "Open medication field",
            "Compare consultation value",
            "Compare previous note",
            "Check latest synthetic record",
            "Clinician confirms resolution"
        ],
        "allergy_conflict": [
            "Open synthetic allergy repository",
            "Select patient {patient_id}",
            "Verify hypersensitivity reaction history",
            "Cross-reference documented medication class",
            "Clinician confirms allergy flag"
        ],
        "dosage_discrepancy": [
            "Retrieve latest synthetic lab values (Creatinine / eGFR)",
            "Query clinical guideline RAG for renal dosage adjustments",
            "Compare transcript dosage vs guideline baseline",
            "Clinician confirms dosage protocol"
        ],
        "lab_value_conflict": [
            "Retrieve baseline historical lab report",
            "Compare recent outpatient lab draw against inpatient baseline",
            "Verify specimen collection timestamp",
            "Clinician confirms lab trend"
        ]
    }

    @classmethod
    def generate_workflow(cls, workflow_id: str, conflict_type: str, patient_id: str) -> SvwgWorkflow:
        raw_steps = cls.RULES.get(conflict_type, [
            "Inspect synthetic source record",
            "Cross-reference patient history",
            "Clinician confirms resolution"
        ])

        checklist = []
        for idx, step_text in enumerate(raw_steps, start=1):
            formatted_step = step_text.format(patient_id=patient_id)
            checklist.append(SvwgChecklistItem(
                id=f"step-{idx}",
                step=formatted_step,
                completed=(idx == 1)  # First step auto-completed for demonstration
            ))

        return SvwgWorkflow(
            workflow_id=workflow_id,
            conflict_type=conflict_type,
            title=f"Verification Protocol: {conflict_type.replace('_', ' ').title()}",
            checklist=checklist,
            status="WAITING_FOR_HUMAN_REVIEW"
        )
