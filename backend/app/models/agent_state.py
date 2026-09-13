from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

class TraceEvent(BaseModel):
    id: str
    timestamp: str
    actor: str  # Orchestrator, Intake Agent, Reconciliation Agent, CAUT Engine, Evidence Agent, Tool Result, PGV, SVWG, Environment, Verification Agent
    event_type: str  # GOAL, DECISION, ACTION, OBSERVATION, ADAPTATION, VERIFICATION
    message: str
    payload: Dict[str, Any] = Field(default_factory=dict)

class CautScoreBreakdown(BaseModel):
    conflict_id: str
    conflict_type: str
    workflow_impact: float
    evidence_accessibility: float
    safety_sensitivity: float
    priority_score: float
    priority_label: str  # HIGH, MEDIUM, LOW

class PgvMapData(BaseModel):
    fact: str
    nodes: List[str]
    edges: List[List[str]]
    conflict_node: str
    resolution_path: List[str]

class SvwgChecklistItem(BaseModel):
    id: str
    step: str
    completed: bool = False

class SvwgWorkflow(BaseModel):
    workflow_id: str
    conflict_type: str
    title: str
    checklist: List[SvwgChecklistItem]
    status: str = "WAITING_FOR_HUMAN_REVIEW"  # WAITING_FOR_HUMAN_REVIEW, IN_PROGRESS, COMPLETE

class FinalDraftRecord(BaseModel):
    patient_id: str
    medication_state: str
    previous_conflict_info: str
    provenance_checklist: List[str]
    validation_status: str
    human_review_required: bool = True
    synthetic_only: bool = True
    generated_at: str
    notes_content: str

class AgentState(BaseModel):
    run_id: str
    patient_id: str
    goal: str = "create_verified_followup_record"
    sources: List[Dict[str, Any]] = Field(default_factory=list)
    facts: List[Dict[str, Any]] = Field(default_factory=list)
    conflicts: List[Dict[str, Any]] = Field(default_factory=list)
    evidence: List[Dict[str, Any]] = Field(default_factory=list)
    provenance: List[Dict[str, Any]] = Field(default_factory=list)
    caut_scores: List[Dict[str, Any]] = Field(default_factory=list)
    verification_workflows: List[Dict[str, Any]] = Field(default_factory=list)
    tool_calls: List[Dict[str, Any]] = Field(default_factory=list)
    observations: List[Dict[str, Any]] = Field(default_factory=list)
    environment_changes: List[Dict[str, Any]] = Field(default_factory=list)
    validation_results: List[Dict[str, Any]] = Field(default_factory=list)
    unresolved_uncertainties: List[Dict[str, Any]] = Field(default_factory=list)
    human_review_required: bool = True
    synthetic_only: bool = True
    status: str = "IDLE"  # IDLE, RUNNING, REPLANNING, READY_FOR_REVIEW, APPROVED, REVISED
    final_record: Optional[FinalDraftRecord] = None
    trace_log: List[TraceEvent] = Field(default_factory=list)
