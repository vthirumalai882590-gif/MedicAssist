# 🩺 MediAssistant — Autonomous Agentic Clinical Documentation Platform

> **Build AI Systems That Act, Adapt, and Execute**
> MediAssistant is an autonomous agentic clinical documentation platform that senses clinical discrepancies across fragmented patient health records, investigates root causes using multi-step tool calls, quantifies uncertainty (CAUT Engine), renders source lineage (PGV Map), adapts dynamically to real-time EHR data updates, and generates governed follow-up records under mandatory human doctor review.

---

## 📌 Repository Links & Demo
- **GitHub Repository**: [https://github.com/vthirumalai882590-gif/MedicAssist](https://github.com/vthirumalai882590-gif/MedicAssist)
- **Live Frontend Workspace**: `http://localhost:5173`
- **FastAPI Backend Server**: `http://localhost:8000` (OpenAPI Docs: `http://localhost:8000/docs`)

---

## 🏗️ Architecture & Agentic Workflow

MediAssistant implements a **Sense → Understand → Act → Adapt → Execute** multi-agent workflow:

```mermaid
flowchart TD
    A["📄 Multi-Source Ingestion<br/>(Transcripts, Notes, EHR Repos, Labs, PDFs)"] --> B["⚡ Groq AI LLM Extraction<br/>(Llama-3.3-70B Model)"]
    B --> C["🧠 Clinical Truth Graph & MongoDB<br/>(medicassist_db.patients)"]
    C --> D["🔎 Reconciliation Agent<br/>(Detect Discrepancies e.g. Lisinopril vs Amlodipine)"]
    D --> E["📐 CAUT Uncertainty Engine<br/>(Triangulation Score: 84/100, Grade A)"]
    E --> F["🧰 Sandbox Tool Interactions<br/>(Patient DB, Med/Allergy Lookup, Labs, RAG)"]
    F --> G["📜 PGV Provenance Map<br/>(Source-to-Target Lineage Audit)"]
    G --> H["✅ SVWG Verification Checklist<br/>(Deterministic Safety Checklists)"]
    H --> I["✍️ Documentation Agent<br/>(Generate Follow-Up Record Draft)"]
    I --> J["⚡ Adaptive Re-Planning Loop<br/>(Simulate Environment Lab Update)"]
    J --> K["🩺 Mandatory Human Doctor Review<br/>(Approve / Request Revision)"]
    K --> L["💾 Verified Record Saved to MongoDB"]
```

---

## 📂 Full Project Directory Structure

```
MedicAssist/
├── backend/
│   ├── app/
│   │   ├── agents/
│   │   │   ├── orchestrator.py        # Central Orchestrator managing persistent state & trace logging
│   │   │   ├── intake.py              # Ingests multi-source records into Clinical Truth Graph
│   │   │   ├── reconciliation.py      # Detects competing medication/lab facts
│   │   │   ├── evidence.py            # Executes multi-step tool calls (Med/Allergy/Labs/RAG)
│   │   │   ├── documentation.py       # Drafts structured clinical follow-up record & action list
│   │   │   └── verification.py        # Executes consistency checks & doctor review assertions
│   │   ├── innovations/
│   │   │   ├── truth_graph.py         # Mutable in-memory patient clinical truth graph
│   │   │   ├── caut.py                # Context-Aware Uncertainty Triangulation scoring engine
│   │   │   ├── pgv.py                 # Provenance-Gap Visualization lineage generator
│   │   │   └── svwg.py                # Structured Verification Workflow Generator
│   │   ├── models/
│   │   │   ├── agent_state.py         # Pydantic schemas (AgentState, TraceEvent, DraftRecord)
│   │   │   ├── patient.py             # Patient demographic & record models
│   │   │   ├── conflict.py            # Clinical conflict & discrepancy model
│   │   │   └── evidence.py            # FactNode & evidence model
│   │   ├── tools/
│   │   │   ├── patient_db.py          # Synthetic patient database accessor
│   │   │   ├── medication_lookup.py   # Active pharmacy repository lookup tool
│   │   │   ├── allergy_lookup.py      # Hypersensitivity & reaction lookup tool
│   │   │   ├── lab_retriever.py       # Metabolic lab panel retriever tool
│   │   │   ├── clinical_rag.py        # Guideline RAG (Type 2 Diabetes, HTN, CKD)
│   │   │   └── validator.py           # Record validation & safety checking tool
│   │   ├── data/
│   │   │   ├── synthetic_patients.json# Default synthetic patient datasets (SYN-001, SYN-002, SYN-003)
│   │   │   └── eval_results.json      # Benchmark evaluation metrics
│   │   ├── mongodb.py                 # MongoDB Database Manager & 1-click synthetic seeder
│   │   └── main.py                    # FastAPI application, REST endpoints & WebSocket trace server
│   └── requirements.txt               # FastAPI, PyMongo, Uvicorn, PyTest, WebSockets
├── frontend/
│   ├── public/
│   │   └── jane_doe.png               # High-resolution clinical portrait avatar for Jane Doe (SYN-001)
│   ├── src/
│   │   ├── components/
│   │   │   ├── AICopilotPanel.jsx     # Live Groq AI Clinical Co-Pilot drawer (Llama-3.3-70B)
│   │   │   ├── AddPatientModal.jsx    # Patient registration modal with live photo upload & PDF extractor
│   │   │   ├── AgentTrace.jsx         # Real-time WebSocket agent execution trace stream
│   │   │   ├── AuthModal.jsx          # Mobile + OTP Auth modal with 1-click Demo Passway
│   │   │   ├── CautPanel.jsx          # CAUT Uncertainty score & breakdown card
│   │   │   ├── ClinicalOverviewModal.jsx # Clinical architecture modal overview
│   │   │   ├── DatabaseModal.jsx      # MongoDB integration portal & PDF/CSV parser
│   │   │   ├── FinalRecord.jsx        # Draft record viewer with doctor approval/revision controls
│   │   │   ├── Navbar.jsx             # Top navigation bar with active patient avatar
│   │   │   ├── PatientHeader.jsx      # Hero command center banner with patient photo avatar
│   │   │   ├── ProvenanceMap.jsx      # PGV Provenance Graph Visualization map
│   │   │   ├── SecurityModal.jsx      # 6-Pillar Security & HIPAA Governance Portal
│   │   │   ├── SettingsModal.jsx      # System settings & Groq API Key configuration
│   │   │   ├── Sidebar.jsx            # Left navigation rail with Security & Database triggers
│   │   │   └── VerificationChecklist.jsx # SVWG verification checklist items
│   │   ├── context/
│   │   │   ├── AuthContext.jsx        # Mobile + OTP session management context
│   │   │   └── RunContext.jsx         # Global state context for active patient & agent run
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx          # Dashboard Command Center (Top metric cards & trace)
│   │   │   ├── PatientState.jsx       # Clinical Truth Graph page with Ask AI card buttons
│   │   │   ├── LongitudinalHistory.jsx# 2024-2026 multi-year timeline history route
│   │   │   ├── Provenance.jsx         # Standalone Provenance Map route
│   │   │   ├── Verification.jsx       # Standalone Verification Checklist route
│   │   │   └── Evaluation.jsx         # Benchmark Evaluation metrics dashboard
│   │   └── services/
│   │       ├── api.js                 # Axios/Fetch HTTP client for FastAPI REST endpoints
│   │       └── ws.js                  # Persistent WebSocket client for real-time trace events
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── .env.example                       # Config template with placeholder credentials
├── .gitignore                         # Excludes node_modules, pycache, dist
├── HACKATHON_PITCH.md                 # Agentic AI Hackathon presentation submission
└── README.md                          # Master technical README documentation
```

---

## 🌟 Detailed Implementation Features

### 1. 🔑 Mobile + OTP Authentication Gate & Demo Passway
- Entry into the platform requires Mobile Number + OTP verification ([AuthModal.jsx](file:///c:/Users/WELCOME/MedicAssist/frontend/src/components/AuthModal.jsx)).
- Features a **1-Click Evaluator Demo Passway** (`[ Evaluator Demo Passway ]`) on the public landing page ([LandingPage.jsx](file:///c:/Users/WELCOME/MedicAssist/frontend/src/pages/LandingPage.jsx)) for instant access.

### 2. 💬 Live Groq AI Clinical Co-Pilot
- Connected to `https://api.groq.com/openai/v1/chat/completions` using `llama-3.3-70b-versatile`.
- Rendered as a slide-over drawer ([AICopilotPanel.jsx](file:///c:/Users/WELCOME/MedicAssist/frontend/src/components/AICopilotPanel.jsx)).
- Every medication and lab card in [PatientState.jsx](file:///c:/Users/WELCOME/MedicAssist/frontend/src/pages/PatientState.jsx) features interactive `✨ Ask AI about this Med` and `✨ Ask AI about this Lab` buttons.

### 3. 🗄️ MongoDB Engine & Synthetic Seeding
- Persistence layer implemented in [app/mongodb.py](file:///c:/Users/WELCOME/MedicAssist/backend/app/mongodb.py) connecting to `medicassist_db`.
- Database Portal ([DatabaseModal.jsx](file:///c:/Users/WELCOME/MedicAssist/frontend/src/components/DatabaseModal.jsx)) displays live engine status and provides a 1-click `[ Seed MongoDB Synthetic Data ]` trigger.

### 4. 📸 Patient Photo Portal
- Patient registration modal ([AddPatientModal.jsx](file:///c:/Users/WELCOME/MedicAssist/frontend/src/components/AddPatientModal.jsx)) includes a photo uploader with real-time base64 `FileReader` preview.
- Default patient **Jane Doe (`SYN-001`)** includes a high-resolution clinical portrait avatar served from `public/jane_doe.png`.

### 5. 📅 Longitudinal Multi-Year Medical History Route
- Multi-year alignment route ([LongitudinalHistory.jsx](file:///c:/Users/WELCOME/MedicAssist/frontend/src/pages/LongitudinalHistory.jsx)) connects **2024 Leg Fracture Surgery**, **2025 Acute Lung Failure ICU Episode**, and **2026 Type 2 Diabetes & Stage 3a CKD**.

### 6. 🛡️ Security & HIPAA Governance Portal
- Dedicated Security Portal ([SecurityModal.jsx](file:///c:/Users/WELCOME/MedicAssist/frontend/src/components/SecurityModal.jsx)) accessible via the left sidebar ([Sidebar.jsx](file:///c:/Users/WELCOME/MedicAssist/frontend/src/components/Sidebar.jsx)), detailing the 6 security pillars: Synthetic Data Isolation (`synthetic_only: true`), Mobile Auth Gate, Mandatory Human Doctor Review (`human_review_required: true`), CAUT Uncertainty Triangulation, Provenance Lineage, and TLS API Key Encryption.

---

## ⚡ Quickstart Setup & Installation

### 1. Clone & Configure Environment

```bash
git clone https://github.com/vthirumalai882590-gif/MedicAssist.git
cd MedicAssist

# Copy environment template
cp .env.example .env
```

### 2. Backend Setup (FastAPI + Python)

```bash
cd backend
pip install -r requirements.txt

# Run FastAPI server on Port 8000
python -m uvicorn app.main:app --port 8000 --reload
```

Run PyTest Benchmark Suite:
```bash
cd backend
pytest tests/test_agent_eval.py -v
```

### 3. Frontend Setup (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🔬 Benchmark Evaluation Metrics

| Metric Category | Target Benchmark | Achieved System Metric | Status |
| :--- | :---: | :---: | :---: |
| **CAUT Uncertainty Score** | > 80/100 | **84/100 (Grade A)** | ✅ PASSED |
| **Agent Response Velocity** | < 3.0s | **1.8s** | ✅ PASSED |
| **Resolution Accuracy** | > 95% | **96.5%** | ✅ PASSED |
| **Human Review Guardrail** | 100% | **100% Enforced** | ✅ PASSED |
| **Synthetic Isolation** | 100% | **100% Enforced** | ✅ PASSED |

---

## 📜 License & Compliance Assertion
Licensed under MIT. Operates strictly under synthetic patient data assertions (`synthetic_only: true`) for clinical decision support benchmarking. All recommendations require mandatory human clinician sign-off (`human_review_required: true`).
