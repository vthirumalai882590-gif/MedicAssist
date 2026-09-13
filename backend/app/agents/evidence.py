from typing import Dict, Any, List
from app.tools.medication_lookup import MedicationLookupTool
from app.tools.allergy_lookup import AllergyLookupTool
from app.tools.lab_retriever import LabRetrieverTool
from app.tools.clinical_rag import ClinicalGuidelineRAGTool

class EvidenceAgent:
    @staticmethod
    def gather_evidence(patient_id: str, conflict_type: str) -> List[Dict[str, Any]]:
        evidence_results = []

        if conflict_type == "medication_conflict":
            med_res = MedicationLookupTool.lookup(patient_id, "Amlodipine / Lisinopril")
            evidence_results.append({
                "tool": "medication_lookup",
                "output": med_res
            })

            rag_res = ClinicalGuidelineRAGTool.query("hypertension medication reconciliation")
            evidence_results.append({
                "tool": "clinical_rag",
                "output": rag_res
            })

        allergy_res = AllergyLookupTool.lookup(patient_id)
        evidence_results.append({
            "tool": "allergy_lookup",
            "output": allergy_res
        })

        return evidence_results
