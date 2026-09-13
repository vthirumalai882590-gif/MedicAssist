from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class FactNode(BaseModel):
    node_id: str
    field: str
    value: Any
    source: str
    timestamp: str
    status: str = "UNVERIFIED"  # UNVERIFIED, CONFLICT, STALE, VERIFIED
    confidence: float = 1.0
    evidence: List[str] = Field(default_factory=list)
    conflict: bool = False

class EvidenceQueryResult(BaseModel):
    query_id: str
    tool_name: str
    parameters: Dict[str, Any]
    result: Any
    retrieved_at: str
    source_reliability: float = 0.95
