# MediAssistant — Demo Script

1. **Select Patient & Run Agent**: Choose `SYN-001` and click `[ Run Agent ]`.
2. **Observe Real-Time Trace**: Trace streams live via WebSocket (`Goal: create verified follow-up record`).
3. **Conflict Detection**: Reconciliation Agent surfaces medication conflict (`Medication A` vs `Medication B`).
4. **CAUT Triangulation**: CAUT panel renders priority score breakdown (Priority: `HIGH`, score: `0.85`).
5. **PGV Graph & SVWG Checklist**: View node-link provenance graph and verification checklist (`WAITING FOR HUMAN REVIEW`).
6. **Simulate New Data (Adaptation Proof)**: Click `[ Simulate New Data ]`. Observe `⚡ ENVIRONMENT CHANGE DETECTED` trace event. System invalidates prior observation, updates graph to `Medication C`, re-queries tools, regenerates affected section, re-runs validator.
7. **Human Review Gate**: Inspect `VERIFIED FOLLOW-UP RECORD` and click `[ Approve Draft ]`.
8. **Evaluation Dashboard**: Open Page 5 to view real PyTest evaluation metrics aligned with the hackathon rubric.
