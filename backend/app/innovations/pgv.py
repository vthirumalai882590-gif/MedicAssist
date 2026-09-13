from typing import Dict, Any, List
from app.models.agent_state import PgvMapData

class PGVEngine:
    """
    3.2 PGV — Provenance-Gap Visualization
    Renders complete source trail for any fact as node-link graph.
    Generated directly from Clinical Truth Graph fields.
    """
    @classmethod
    def generate_provenance_map(cls, fact_field: str, sources: List[str], conflict_node: str) -> PgvMapData:
        nodes = list(dict.fromkeys(sources + [conflict_node, "Verification Workflow"]))
        
        edges = []
        for i in range(len(sources) - 1):
            edges.append([sources[i], sources[i+1]])
        if sources:
            edges.append([sources[-1], conflict_node])
        edges.append([conflict_node, "Verification Workflow"])

        resolution_path = sources + [conflict_node, "Clinician Review"]

        return PgvMapData(
            fact=fact_field,
            nodes=nodes,
            edges=edges,
            conflict_node=conflict_node,
            resolution_path=resolution_path
        )
