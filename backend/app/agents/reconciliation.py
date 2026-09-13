from typing import Dict, Any, List
from app.models.conflict import ConflictItem
from app.innovations.truth_graph import ClinicalTruthGraph

class ReconciliationAgent:
    @staticmethod
    def detect_conflicts(truth_graph: ClinicalTruthGraph) -> List[ConflictItem]:
        conflicts = []
        transcript_fact = None
        prevnote_fact = None

        for node_id, node in truth_graph.nodes.items():
            if node.field == "medication.consultation_statement":
                transcript_fact = node
            elif node.field == "medication.history_statement":
                prevnote_fact = node

        if transcript_fact and prevnote_fact and transcript_fact.value != prevnote_fact.value:
            # Mark nodes as CONFLICT in Truth Graph
            truth_graph.update_fact_node(transcript_fact.node_id, transcript_fact.value, "CONFLICT")
            truth_graph.update_fact_node(prevnote_fact.node_id, prevnote_fact.value, "CONFLICT")

            conflict = ConflictItem(
                conflict_id="conflict-med-01",
                conflict_type="medication_conflict",
                field="medication.active_regimen",
                competing_values={
                    "previous_note": prevnote_fact.value,
                    "consultation": transcript_fact.value
                },
                detected_at="2026-09-13T07:25:00Z",
                status="OPEN"
            )
            conflicts.append(conflict)

        return conflicts
