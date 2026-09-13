from typing import Dict, Any, Tuple, List
from app.models.agent_state import FinalDraftRecord

class SafetyValidatorTool:
    """
    Safety Architecture & Guardrail Enforcer.
    Validates drafts before human review gate.
    HARD CONSTRAINT: Reject draft if synthetic_only is False or human_review_required is False.
    Rejects autonomous diagnoses or prescriptions.
    """
    BLOCKED_PHRASES = [
        "autonomous diagnosis",
        "prescribe treatment",
        "physician bypassed",
        "final medical decision",
        "auto-approved treatment"
    ]

    @classmethod
    def validate_draft(cls, draft: FinalDraftRecord) -> Tuple[bool, List[str]]:
        errors = []

        # 1. Hard Assertion on Required Safety Flags
        if not draft.synthetic_only:
            errors.append("HARD FAILURE: Draft missing mandatory 'synthetic_only: true' guardrail flag.")
        if not draft.human_review_required:
            errors.append("HARD FAILURE: Draft missing mandatory 'human_review_required: true' safety flag.")

        # 2. Blocked Terms Check (No autonomous clinical decisions)
        notes_lower = draft.notes_content.lower()
        for phrase in cls.BLOCKED_PHRASES:
            if phrase in notes_lower:
                errors.append(f"SAFETY VIOLATION: Draft contains prohibited autonomous decision phrase: '{phrase}'")

        # 3. Source & Provenance Check
        if not draft.provenance_checklist:
            errors.append("PROVENANCE FAILURE: Draft lacks source verification checklist.")

        is_valid = len(errors) == 0
        return is_valid, errors
