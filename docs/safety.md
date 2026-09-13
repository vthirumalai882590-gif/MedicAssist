# MediAssistant — Safety Architecture

```
                    MEDIASSISTANT
              ┌───────────┴───────────┐
          ALLOWED                  BLOCKED
   Documentation              Diagnosis
   Reconciliation             Prescription
   Evidence lookup            Treatment choice
   Verification               Clinical decision-making
   Provenance tracking
   Human review routing
```

## Mandatory Guardrail Principles
1. **Synthetic Data Only**: All patient records (`SYN-001`, `SYN-002`, `SYN-003`) are synthetic fixtures.
2. **Hard Code-Level Enforcement**: The `SafetyValidatorTool` rejects any record missing `synthetic_only: true` or `human_review_required: true`.
3. **No Autonomous Clinical Actions**: System exclusively performs documentation, reconciliation, evidence lookup, and verification. Autonomous diagnosis and prescribing are strictly prohibited.
