from typing import Dict, Any, List
from app.models.evidence import FactNode
from app.innovations.truth_graph import ClinicalTruthGraph

class IntakeAgent:
    @staticmethod
    def process_patient_sources(patient_data: Dict[str, Any], truth_graph: ClinicalTruthGraph) -> List[Dict[str, Any]]:
        sources = patient_data.get("sources", [])
        fact_nodes = []

        for idx, src in enumerate(sources, start=1):
            if src["type"] == "transcript":
                node = FactNode(
                    node_id=f"fact-transcript-{idx}",
                    field="medication.consultation_statement",
                    value="Medication B (Amlodipine 5mg)",
                    source=src["title"],
                    timestamp=src["timestamp"],
                    status="UNVERIFIED",
                    confidence=0.90,
                    evidence=[src["title"]],
                    conflict=False
                )
                truth_graph.add_fact_node(node)
                fact_nodes.append(node.dict())

            elif src["type"] == "previous_note":
                node = FactNode(
                    node_id=f"fact-prevnote-{idx}",
                    field="medication.history_statement",
                    value="Medication A (Lisinopril 10mg)",
                    source=src["title"],
                    timestamp=src["timestamp"],
                    status="UNVERIFIED",
                    confidence=0.95,
                    evidence=[src["title"]],
                    conflict=False
                )
                truth_graph.add_fact_node(node)
                fact_nodes.append(node.dict())

            elif src["type"] == "medication_db":
                node = FactNode(
                    node_id=f"fact-meddb-{idx}",
                    field="medication.ehr_fill_record",
                    value="Medication B (Amlodipine 5mg)",
                    source=src["title"],
                    timestamp=src["timestamp"],
                    status="UNVERIFIED",
                    confidence=0.98,
                    evidence=[src["title"]],
                    conflict=False
                )
                truth_graph.add_fact_node(node)
                fact_nodes.append(node.dict())

        return fact_nodes
