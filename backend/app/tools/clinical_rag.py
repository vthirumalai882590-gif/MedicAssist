from typing import Dict, Any, List

class ClinicalGuidelineRAGTool:
    """
    Synthetic Clinical Guideline RAG Tool.
    Queries synthetic guideline excerpts for hypertension, diabetes, and drug reconciliation protocols.
    """
    GUIDELINES = {
        "hypertension": "AHA/ACC Synthetic Guideline (2025): First-line therapy for stage 1 hypertension in diabetic patients includes ACE inhibitors or ARBs. If discontinued or ineffective, CCB (Amlodipine 5mg) is recommended as primary alternative.",
        "reconciliation": "Joint Commission Reconciliation Protocol (Synthetic): When conflicting medication statements exist between transcript and discharge summary, EHR pharmacy fill record takes precedence until confirmed by treating clinician.",
        "diabetes": "ADA Synthetic Diabetes Guidelines (2025): Metformin 500mg BID baseline therapy for HbA1c > 7.0%. Monitor renal function annually."
    }

    @classmethod
    def query(cls, topic: str) -> Dict[str, Any]:
        matched = []
        for k, v in cls.GUIDELINES.items():
            if k in topic.lower():
                matched.append(v)
        if not matched:
            matched.append(cls.GUIDELINES["reconciliation"])

        return {
            "query": topic,
            "results": matched,
            "synthetic_only": True
        }
