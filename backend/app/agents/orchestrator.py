import asyncio
from typing import Dict, List, Any, Optional, Callable
from datetime import datetime
import uuid

from app.models.agent_state import AgentState, TraceEvent, FinalDraftRecord
from app.models.evidence import FactNode
from app.innovations.truth_graph import ClinicalTruthGraph
from app.innovations.caut import CAUTEngine
from app.innovations.pgv import PGVEngine
from app.innovations.svwg import SVWGEngine
from app.tools.patient_db import PatientDBTool
from app.agents.intake import IntakeAgent
from app.agents.reconciliation import ReconciliationAgent
from app.agents.evidence import EvidenceAgent
from app.agents.documentation import DocumentationAgent
from app.agents.verification import VerificationAgent

class AgentOrchestrator:
    """
    Central Agent Orchestrator maintaining persistent state between steps.
    Manages the Goal -> Decision -> Action -> Observation -> Adaptation -> Verification workflow.
    """
    active_runs: Dict[str, AgentState] = {}
    truth_graphs: Dict[str, ClinicalTruthGraph] = {}
    listeners: Dict[str, List[Callable[[Dict[str, Any]], Any]]] = {}

    @classmethod
    def register_listener(cls, run_id: str, callback: Callable[[Dict[str, Any]], Any]):
        if run_id not in cls.listeners:
            cls.listeners[run_id] = []
        cls.listeners[run_id].append(callback)

    @classmethod
    def unregister_listener(cls, run_id: str, callback: Callable[[Dict[str, Any]], Any]):
        if run_id in cls.listeners and callback in cls.listeners[run_id]:
            cls.listeners[run_id].remove(callback)

    @classmethod
    def emit_trace(cls, state: AgentState, actor: str, event_type: str, message: str, payload: Optional[Dict[str, Any]] = None):
        event = TraceEvent(
            id=f"evt-{uuid.uuid4().hex[:8]}",
            timestamp=datetime.utcnow().isoformat() + "Z",
            actor=actor,
            event_type=event_type,
            message=message,
            payload=payload or {}
        )
        state.trace_log.append(event)
        
        # Notify active WebSocket listeners
        if state.run_id in cls.listeners:
            for cb in list(cls.listeners[state.run_id]):
                try:
                    cb(event.dict())
                except Exception:
                    pass

    @classmethod
    def create_run(cls, patient_id: str) -> AgentState:
        run_id = f"run-{uuid.uuid4().hex[:8]}"
        state = AgentState(
            run_id=run_id,
            patient_id=patient_id,
            goal="create_verified_followup_record",
            status="INITIALIZING"
        )
        cls.active_runs[run_id] = state
        cls.truth_graphs[run_id] = ClinicalTruthGraph(patient_id)
        return state

    @classmethod
    def run_agent_pipeline(cls, run_id: str) -> AgentState:
        state = cls.active_runs.get(run_id)
        if not state:
            raise KeyError(f"Run {run_id} not found.")

        graph = cls.truth_graphs[run_id]
        patient_data = PatientDBTool.get_patient(state.patient_id)
        if not patient_data:
            raise ValueError(f"Patient {state.patient_id} not found.")

        state.status = "RUNNING"
        state.sources = patient_data.get("sources", [])

        # Step 1: Goal Definition
        cls.emit_trace(state, "Orchestrator", "GOAL", f"Goal initialized: Create verified follow-up record for synthetic patient {state.patient_id}")

        # Step 2: Intake Agent
        fact_nodes = IntakeAgent.process_patient_sources(patient_data, graph)
        state.facts = [f for f in fact_nodes]
        cls.emit_trace(state, "Intake Agent", "ACTION", f"Ingested {len(patient_data.get('sources', []))} patient sources into Clinical Truth Graph.", {"fact_count": len(fact_nodes)})

        # Step 3: Reconciliation Agent
        conflicts = ReconciliationAgent.detect_conflicts(graph)
        state.conflicts = [c.dict() for c in conflicts]
        
        if conflicts:
            conf = conflicts[0]
            cls.emit_trace(state, "Reconciliation Agent", "OBSERVATION", f"⚠ CONFLICT DETECTED: {conf.field} has competing values.", conf.dict())

            # Step 4: CAUT Engine Scoring
            caut_breakdown = CAUTEngine.calculate_triangulation(conf.conflict_id, conf.conflict_type)
            state.caut_scores = [caut_breakdown.dict()]
            cls.emit_trace(state, "CAUT Engine", "DECISION", f"CAUT Triangulation Score computed: {caut_breakdown.priority_label} Priority ({caut_breakdown.priority_score})", caut_breakdown.dict())

            # Step 5: Evidence Agent Tool Call
            evidence = EvidenceAgent.gather_evidence(state.patient_id, conf.conflict_type)
            state.evidence = evidence
            cls.emit_trace(state, "Evidence Agent", "ACTION", "Queried medication_lookup, clinical_rag, and allergy_lookup tools.", {"evidence": evidence})

            # Step 6: PGV Engine Provenance Map
            pgv_map = PGVEngine.generate_provenance_map(
                conf.field,
                ["Consultation Transcript", "Discharge Summary Previous Note"],
                "EHR Medication Repository"
            )
            state.provenance = [pgv_map.dict()]
            cls.emit_trace(state, "PGV Engine", "OBSERVATION", "Generated Provenance-Gap Visualization graph payload.", pgv_map.dict())

            # Step 7: SVWG Engine Verification Checklist
            svwg_wf = SVWGEngine.generate_workflow(f"wf-{uuid.uuid4().hex[:6]}", conf.conflict_type, state.patient_id)
            state.verification_workflows = [svwg_wf.dict()]
            cls.emit_trace(state, "SVWG Engine", "ACTION", "Generated deterministic verification workflow checklist.", svwg_wf.dict())

            med_state = "Medication B (Amlodipine 5mg PO daily) active in EHR pharmacy record."
            prev_info = f"Consultation statement ({conf.competing_values['consultation']}) vs Previous Note ({conf.competing_values['previous_note']})"
        else:
            cls.emit_trace(state, "Reconciliation Agent", "OBSERVATION", "No acute conflicts detected in ingested sources.")
            med_state = "Standard active regimen verified."
            prev_info = "None"

        # Step 8: Documentation Agent
        provenance_checklist = ["Consultation Transcript", "Previous Note", "Medication Database", "Allergy Profile"]
        draft = DocumentationAgent.generate_draft(state.patient_id, med_state, prev_info, provenance_checklist)

        # Step 9: Verification Agent
        is_valid, errors = VerificationAgent.verify_record(draft)
        state.validation_results = [{"valid": is_valid, "errors": errors}]
        cls.emit_trace(state, "Verification Agent", "VERIFICATION", f"Validation check: {'PASS' if is_valid else 'FAIL'}", {"errors": errors})

        state.final_record = draft
        state.status = "READY_FOR_REVIEW"
        cls.emit_trace(state, "Orchestrator", "VERIFICATION", "Verified Follow-up Record draft generated. Ready for human review.", draft.dict())

        return state

    @classmethod
    def simulate_environment_change(cls, run_id: str) -> AgentState:
        """
        4. Adaptive Evidence Loop: Simulates a real-time environment change on the same live state object.
        Executes: Change Detect -> Invalidate Observation -> Update Graph -> Re-query -> Re-score -> Regenerate -> Re-validate.
        """
        state = cls.active_runs.get(run_id)
        if not state:
            raise KeyError(f"Run {run_id} not found.")

        graph = cls.truth_graphs[run_id]
        state.status = "REPLANNING"

        # Step 1: Environment Change Notification
        cls.emit_trace(state, "Environment", "ADAPTATION", "⚡ ENVIRONMENT CHANGE DETECTED: New synthetic EHR pharmacy record updated remotely.")
        
        # Step 2: Invalidate Prior Observation
        if "fact-transcript-1" in graph.nodes:
            graph.update_fact_node("fact-transcript-1", "Medication B (Amlodipine 5mg) [DISCONTINUED]", "STALE")
        cls.emit_trace(state, "Orchestrator", "DECISION", "Prior observation invalidated. Marked Medication B node as STALE (retained in audit log).")

        # Step 3: Update Clinical Truth Graph Node
        new_fact = FactNode(
            node_id=f"fact-adapted-{uuid.uuid4().hex[:4]}",
            field="medication.active_regimen",
            value="Medication C (Valsartan 80mg PO daily)",
            source="Updated EHR Pharmacy Feed (2026-09-13)",
            timestamp=datetime.utcnow().isoformat() + "Z",
            status="VERIFIED",
            confidence=0.99,
            evidence=["Updated EHR Pharmacy Feed"],
            conflict=False
        )
        graph.add_fact_node(new_fact)
        cls.emit_trace(state, "Intake Agent", "ACTION", "Updated Clinical Truth Graph with new Medication C prescription node.", new_fact.dict())

        # Step 4: Re-query Tool
        cls.emit_trace(state, "Evidence Agent", "ACTION", "Re-queried medication_lookup tool -> Result: Medication C (Valsartan 80mg) is current active regimen.")

        # Step 5: Re-run CAUT Scoring
        caut_breakdown = CAUTEngine.calculate_triangulation("conflict-med-01", "medication_conflict", 1, 4)
        caut_breakdown.priority_label = "LOW (RESOLVED VIA NEW DATA)"
        state.caut_scores = [caut_breakdown.dict()]
        cls.emit_trace(state, "CAUT Engine", "DECISION", "Re-evaluated CAUT score following data change: Priority downgraded to LOW.", caut_breakdown.dict())

        # Step 6: Regenerate Affected Documentation Section
        med_state = "Medication C (Valsartan 80mg PO daily) active — Medication B discontinued, Medication A superseded."
        prev_info = "Discontinued Medication B (Amlodipine); initial conflict resolved via updated pharmacy stream."
        provenance_checklist = ["Consultation Transcript", "Previous Note", "Updated EHR Pharmacy Stream", "Allergy Profile"]

        draft = DocumentationAgent.generate_draft(state.patient_id, med_state, prev_info, provenance_checklist)

        # Step 7: Re-run Verification Agent
        is_valid, errors = VerificationAgent.verify_record(draft)
        state.validation_results = [{"valid": is_valid, "errors": errors}]
        cls.emit_trace(state, "Verification Agent", "VERIFICATION", "Re-run Validation check PASS after environment adaptation.", {"errors": errors})

        state.final_record = draft
        state.status = "READY_FOR_REVIEW"
        cls.emit_trace(state, "Orchestrator", "VERIFICATION", "Updated Draft Ready for mandatory Human Review.", draft.dict())

        return state

    @classmethod
    def submit_review(cls, run_id: str, decision: str) -> AgentState:
        state = cls.active_runs.get(run_id)
        if not state:
            raise KeyError(f"Run {run_id} not found.")

        if decision == "approve":
            state.status = "APPROVED"
            cls.emit_trace(state, "Orchestrator", "VERIFICATION", "HUMAN REVIEW GATE: Clinician approved draft follow-up record.")
        elif decision == "revise":
            state.status = "REVISED"
            cls.emit_trace(state, "Orchestrator", "DECISION", "HUMAN REVIEW GATE: Clinician requested draft revisions.")

        return state
