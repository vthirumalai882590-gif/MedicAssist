# MediAssistant — Architecture Documentation

## System Topology

```
React/Vite Dashboard  ⇄  FastAPI (REST + WebSocket)  →  Agent Orchestrator
                                                              │
                              ┌───────────────┬───────────────┼───────────────┐
                              ↓               ↓               ↓               ↓
                       Persistent State   Tool Layer      RAG (synthetic)   Validator
                              │               │               │               │
                              └───────────────┴───────┬───────┴───────────────┘
                                                       ↓
                                            Clinical Truth Graph
                                                       ↓
                                          CAUT  /  PGV  /  SVWG
                                                       ↓
                                              Human Review Gate
                                                       ↓
                                          Verified Follow-up Record
```

## Innovation Modules
1. **Clinical Truth Graph**: In-memory mutable graph tracking patient state, evidence nodes, confidence, and status diffs.
2. **CAUT (Context-Aware Uncertainty Triangulation)**: Evaluates `priority_score = (0.4 * workflow_impact) + (0.3 * evidence_accessibility) + (0.3 * safety_sensitivity)`.
3. **PGV (Provenance-Gap Visualization)**: Node-link graph mapping source trails and conflict nodes.
4. **SVWG (Synthetic Verification Workflow Generator)**: Rules-based checklist engine generating deterministic verification steps.
5. **Adaptive Evidence Loop**: Real-time state invalidation and replanning triggered via WebSocket trace updates when environment data changes.
