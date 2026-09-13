from typing import Dict, Any, Tuple
from app.models.agent_state import FinalDraftRecord
from app.tools.validator import SafetyValidatorTool

class VerificationAgent:
    @staticmethod
    def verify_record(draft: FinalDraftRecord) -> Tuple[bool, List[str]]:
        is_valid, errors = SafetyValidatorTool.validate_draft(draft)
        if is_valid:
            draft.validation_status = "PASS"
        else:
            draft.validation_status = "FAIL"
        return is_valid, errors
