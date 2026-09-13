from typing import Dict, Any, List
from app.models.agent_state import CautScoreBreakdown

class CAUTEngine:
    """
    3.1 CAUT — Context-Aware Uncertainty Triangulation
    Ranks which uncertainty needs attention first based on audited formula.
    Never decides clinical action.
    """
    SAFETY_SENSITIVITY_TABLE = {
        "medication_conflict": 0.85,
        "allergy_conflict": 0.95,
        "dosage_discrepancy": 0.90,
        "lab_value_conflict": 0.60,
        "demographic_mismatch": 0.20
    }

    @classmethod
    def calculate_triangulation(
        cls,
        conflict_id: str,
        conflict_type: str,
        referencing_fields_count: int = 3,
        available_sources_count: int = 3
    ) -> CautScoreBreakdown:
        # Calculate dimension sub-scores
        workflow_impact = min(1.0, max(0.1, referencing_fields_count * 0.3))
        evidence_accessibility = min(1.0, max(0.1, available_sources_count * 0.32))
        safety_sensitivity = cls.SAFETY_SENSITIVITY_TABLE.get(conflict_type, 0.50)

        # Formula: (0.4 * workflow_impact) + (0.3 * evidence_accessibility) + (0.3 * safety_sensitivity)
        priority_score = round(
            (0.4 * workflow_impact) + (0.3 * evidence_accessibility) + (0.3 * safety_sensitivity),
            2
        )

        if priority_score >= 0.75:
            priority_label = "HIGH"
        elif priority_score >= 0.45:
            priority_label = "MEDIUM"
        else:
            priority_label = "LOW"

        return CautScoreBreakdown(
            conflict_id=conflict_id,
            conflict_type=conflict_type,
            workflow_impact=workflow_impact,
            evidence_accessibility=evidence_accessibility,
            safety_sensitivity=safety_sensitivity,
            priority_score=priority_score,
            priority_label=priority_label
        )
