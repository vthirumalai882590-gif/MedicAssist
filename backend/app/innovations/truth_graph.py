from typing import Dict, List, Any, Optional
from datetime import datetime
from app.models.evidence import FactNode

class ClinicalTruthGraph:
    """
    Core Data Layer: A mutable, in-memory graph representing the patient state.
    Every fact carries field, value, source, timestamp, status, confidence, evidence, conflict.
    Supports incremental mutation so downstream modules detect changes.
    """
    def __init__(self, patient_id: str):
        self.patient_id = patient_id
        self.nodes: Dict[str, FactNode] = {}
        self.edges: List[Dict[str, str]] = []
        self.mutation_history: List[Dict[str, Any]] = []

    def add_fact_node(self, node: FactNode) -> None:
        self.nodes[node.node_id] = node
        self.mutation_history.append({
            "action": "ADD_NODE",
            "node_id": node.node_id,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "field": node.field,
            "value": node.value
        })

    def add_edge(self, source_id: str, target_id: str, relation: str) -> None:
        self.edges.append({
            "source": source_id,
            "target": target_id,
            "relation": relation
        })

    def update_fact_node(self, node_id: str, new_value: Any, new_status: str, new_evidence: Optional[List[str]] = None) -> Dict[str, Any]:
        """
        Incremental mutation of an existing fact node in place.
        Returns a change diff dictionary for downstream adaptation triggers.
        """
        if node_id not in self.nodes:
            raise KeyError(f"Node {node_id} not found in Clinical Truth Graph.")

        node = self.nodes[node_id]
        old_value = node.value
        old_status = node.status

        # Perform in-place mutation
        node.value = new_value
        node.status = new_status
        node.timestamp = datetime.utcnow().isoformat() + "Z"
        if new_evidence:
            for ev in new_evidence:
                if ev not in node.evidence:
                    node.evidence.append(ev)

        diff = {
            "action": "UPDATE_NODE",
            "node_id": node_id,
            "field": node.field,
            "old_value": old_value,
            "new_value": new_value,
            "old_status": old_status,
            "new_status": new_status,
            "timestamp": node.timestamp
        }
        self.mutation_history.append(diff)
        return diff

    def get_conflicts(self) -> List[FactNode]:
        return [node for node in self.nodes.values() if node.conflict or node.status == "CONFLICT"]

    def to_dict(self) -> Dict[str, Any]:
        return {
            "patient_id": self.patient_id,
            "nodes": [node.dict() for node in self.nodes.values()],
            "edges": self.edges,
            "mutation_count": len(self.mutation_history)
        }
