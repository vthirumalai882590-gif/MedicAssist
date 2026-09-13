import os
import json
import asyncio
from typing import Dict, Any, Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.tools.patient_db import PatientDBTool
from app.tools.medication_lookup import MedicationLookupTool
from app.tools.allergy_lookup import AllergyLookupTool
from app.tools.lab_retriever import LabRetrieverTool
from app.tools.clinical_rag import ClinicalGuidelineRAGTool
from app.tools.validator import SafetyValidatorTool
from app.agents.orchestrator import AgentOrchestrator
from app.models.agent_state import FinalDraftRecord

app = FastAPI(
    title="MediAssistant API",
    description="Agentic Clinical Documentation & Follow-up Platform (Synthetic Data Only)",
    version="2.0.0"
)

# Enable CORS for React/Vite development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Request Models ---
class RunAgentRequest(BaseModel):
    patient_id: str

class ReviewRequest(BaseModel):
    decision: str  # approve or revise

class MedicationLookupReq(BaseModel):
    patient_id: str
    query: Optional[str] = ""

class AllergyLookupReq(BaseModel):
    patient_id: str

class LabRetrieveReq(BaseModel):
    patient_id: str

class RagQueryReq(BaseModel):
    topic: str

# --- REST Endpoints ---

from app.mongodb import MongoDBManager

@app.get("/")
def read_root():
    return {
        "name": "MediAssistant API",
        "status": "ONLINE",
        "synthetic_only": True,
        "human_review_required": True,
        "mongodb": MongoDBManager.get_status()
    }

# --- MongoDB Specific Endpoints ---

@app.get("/api/mongodb/status")
def mongodb_status():
    return MongoDBManager.get_status()

@app.post("/api/mongodb/seed")
def mongodb_seed():
    return MongoDBManager.seed_synthetic_patients()

@app.get("/api/mongodb/patients")
def mongodb_list_patients():
    return MongoDBManager.list_patients()

@app.get("/api/mongodb/patients/{patient_id}")
def mongodb_get_patient(patient_id: str):
    patient = MongoDBManager.get_patient(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Synthetic patient record not found in MongoDB")
    return patient

@app.post("/api/mongodb/patients")
def mongodb_save_patient(patient: Dict[str, Any]):
    success = MongoDBManager.save_patient(patient)
    return {"status": "SUCCESS" if success else "FAILED", "patient_id": patient.get("patient_id")}

@app.get("/api/patients")
def get_patients():
    return PatientDBTool.list_patients()

@app.get("/api/patients/{patient_id}")
def get_patient(patient_id: str):
    patient = PatientDBTool.get_patient(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


@app.post("/api/agent/run")
def start_agent_run(req: RunAgentRequest, background_tasks: BackgroundTasks):
    patient = PatientDBTool.get_patient(req.patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    state = AgentOrchestrator.create_run(req.patient_id)
    # Execute pipeline synchronously to ensure initial state is generated
    AgentOrchestrator.run_agent_pipeline(state.run_id)
    return {"run_id": state.run_id, "status": state.status, "patient_id": req.patient_id}

@app.get("/api/runs/{run_id}")
def get_run_state(run_id: str):
    state = AgentOrchestrator.active_runs.get(run_id)
    if not state:
        raise HTTPException(status_code=404, detail="Run not found")
    return state.dict()

@app.post("/api/runs/{run_id}/simulate-new-data")
def simulate_new_data(run_id: str):
    try:
        updated_state = AgentOrchestrator.simulate_environment_change(run_id)
        return updated_state.dict()
    except KeyError:
        raise HTTPException(status_code=404, detail="Run not found")

@app.post("/api/runs/{run_id}/review")
def review_draft(run_id: str, req: ReviewRequest):
    try:
        updated_state = AgentOrchestrator.submit_review(run_id, req.decision)
        return updated_state.dict()
    except KeyError:
        raise HTTPException(status_code=404, detail="Run not found")

# --- Tools Endpoints ---

@app.post("/api/tools/medication/lookup")
def tool_medication_lookup(req: MedicationLookupReq):
    return MedicationLookupTool.lookup(req.patient_id, req.query or "")

@app.post("/api/tools/allergy/lookup")
def tool_allergy_lookup(req: AllergyLookupReq):
    return AllergyLookupTool.lookup(req.patient_id)

@app.post("/api/tools/labs/retrieve")
def tool_lab_retrieve(req: LabRetrieveReq):
    return LabRetrieverTool.retrieve(req.patient_id)

@app.post("/api/tools/rag/query")
def tool_rag_query(req: RagQueryReq):
    return ClinicalGuidelineRAGTool.query(req.topic)

@app.post("/api/tools/validate")
def tool_validate(draft: FinalDraftRecord):
    is_valid, errors = SafetyValidatorTool.validate_draft(draft)
    return {"valid": is_valid, "errors": errors}

@app.get("/api/evaluation/metrics")
def get_evaluation_metrics():
    eval_file = os.path.join(os.path.dirname(__file__), "data", "eval_results.json")
    if os.path.exists(eval_file):
        with open(eval_file, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"error": "Evaluation data file not found"}

# --- WebSocket Real-Time Trace Endpoint ---

@app.websocket("/api/runs/{run_id}/trace")
async def websocket_trace_stream(websocket: WebSocket, run_id: str):
    await websocket.accept()
    loop = asyncio.get_running_loop()

    state = AgentOrchestrator.active_runs.get(run_id)
    if not state:
        await websocket.send_json({"error": "Run not found"})
        await websocket.close()
        return

    # 1. Catch up existing trace log items
    for trace_item in state.trace_log:
        await websocket.send_json(trace_item.dict())

    # 2. Register async listener for new trace events
    def on_new_trace(event_dict: Dict[str, Any]):
        asyncio.run_coroutine_threadsafe(
            websocket.send_json(event_dict),
            loop
        )

    AgentOrchestrator.register_listener(run_id, on_new_trace)

    try:
        while True:
            # Keep WebSocket connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        AgentOrchestrator.unregister_listener(run_id, on_new_trace)
