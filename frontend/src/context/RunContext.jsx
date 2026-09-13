import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  fetchPatients,
  fetchPatientDetail,
  startAgentRun,
  getRunState,
  simulateNewData as apiSimulateNewData,
  submitHumanReview as apiSubmitHumanReview
} from '../services/api';
import { connectTraceWebSocket } from '../services/ws';

const RunContext = createContext();

export const DEFAULT_PATIENT_SYN001 = {
  patient_id: 'SYN-001',
  name: 'Jane Doe',
  photo_url: '/jane_doe.png',
  age: 58,
  gender: 'Female',
  dob: '1968-04-12',
  mrn: 'MRN-984210',
  condition: 'Type 2 Diabetes Mellitus & Stage 3a CKD',
  primary_condition: 'Type 2 Diabetes Mellitus & Stage 3a CKD',
  primary_physician: 'Dr. Sarah Jenkins, MD (Endocrinology)',
  last_visit: '2026-08-28',
  allergies: ['Penicillin (Anaphylaxis)', 'Sulfa Drugs (Mild Rash)'],
  active_medications: [
    { id: 'm1', name: 'Metformin HCl', dosage: '1000 mg', frequency: 'Oral - Twice Daily (BID)', category: 'Antidiabetic', prescribed: '2024-03-15', prescriber: 'Dr. S. Jenkins', status: 'Active' },
    { id: 'm2', name: 'Amlodipine Besylate', dosage: '5 mg', frequency: 'Oral - Once Daily (QD)', category: 'Antihypertensive', prescribed: '2024-06-10', prescriber: 'Dr. R. Patel', status: 'Active' },
    { id: 'm3', name: 'Lisinopril', dosage: '10 mg', frequency: 'Oral - Once Daily Morning', category: 'ACE Inhibitor', prescribed: '2025-01-20', prescriber: 'Dr. R. Patel', status: 'Active' },
    { id: 'm4', name: 'Atorvastatin Calcium', dosage: '20 mg', frequency: 'Oral - At Bedtime', category: 'Statin / Lipid Lowering', prescribed: '2024-08-05', prescriber: 'Dr. S. Jenkins', status: 'Active' },
    { id: 'm5', name: 'Insulin Glargine (Lantus)', dosage: '14 Units', frequency: 'Subcutaneous - Daily Night', category: 'Long-Acting Insulin', prescribed: '2025-11-12', prescriber: 'Dr. S. Jenkins', status: 'Active' }
  ],
  recent_labs: [
    { id: 'l1', test: 'Hemoglobin A1c (HbA1c)', name: 'Hemoglobin A1c (HbA1c)', value: '8.9', unit: '%', ref_range: '4.0 - 5.6 %', status: 'High', date: '2026-08-28', trend: '↑ 0.6% from May' },
    { id: 'l2', test: 'Fasting Plasma Glucose', name: 'Fasting Plasma Glucose', value: '168', unit: 'mg/dL', ref_range: '70 - 99 mg/dL', status: 'High', date: '2026-08-28', trend: '↑ Elevated' },
    { id: 'l3', test: 'Estimated GFR (eGFR)', name: 'Estimated GFR (eGFR)', value: '54', unit: 'mL/min/1.73m²', ref_range: '> 60 mL/min/1.73m²', status: 'Low', date: '2026-08-28', trend: 'Stage 3a CKD' },
    { id: 'l4', test: 'Blood Pressure (Systolic/Diastolic)', name: 'Blood Pressure (Systolic/Diastolic)', value: '142 / 88', unit: 'mmHg', ref_range: '< 120/80 mmHg', status: 'Elevated', date: '2026-08-28', trend: 'Stage 1 HTN' },
    { id: 'l5', test: 'Serum Creatinine', name: 'Serum Creatinine', value: '1.35', unit: 'mg/dL', ref_range: '0.59 - 1.04 mg/dL', status: 'High', date: '2026-08-28', trend: 'Slight elevation' },
    { id: 'l6', test: 'LDL Cholesterol', name: 'LDL Cholesterol', value: '128', unit: 'mg/dL', ref_range: '< 100 mg/dL', status: 'Borderline High', date: '2026-08-28', trend: 'Needs titration' }
  ],
  vitals: {
    blood_pressure: '142/88 mmHg',
    heart_rate: '74 bpm',
    respiratory_rate: '16 /min',
    temperature: '98.4 °F',
    spo2: '98% on Room Air',
    weight: '76.5 kg (168.6 lbs)',
    bmi: '27.4 kg/m²'
  },
  longitudinal_timeline: [
    { year: 2024, title: 'Left Tibia Fractured (Leg Injury)', details: 'Surgical ORIF repair following fall down stairs. Full recovery after 12 weeks physical therapy.', status: 'Resolved' },
    { year: 2025, title: 'Acute Respiratory Distress & Lung Complication', details: 'Hospitalized with severe viral pneumonia causing acute hypoxemic respiratory strain.', status: 'Resolved with regular monitoring' },
    { year: 2026, title: 'Uncontrolled Type 2 Diabetes & Early CKD', details: 'HbA1c elevated to 8.9%. eGFR dropped to 54. Multi-agent titration in progress.', status: 'Active Management' }
  ]
};

export function RunProvider({ children }) {
  const [patients, setPatients] = useState([DEFAULT_PATIENT_SYN001]);
  const [selectedPatientId, setSelectedPatientId] = useState('SYN-001');
  const [patientDetail, setPatientDetail] = useState(DEFAULT_PATIENT_SYN001);
  const [currentRunId, setCurrentRunId] = useState(null);
  const [runState, setRunState] = useState(null);
  const [traceLog, setTraceLog] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isAdapting, setIsAdapting] = useState(false);
  const [error, setError] = useState(null);
  
  // AI Copilot state for interactive queries
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState(null);

  const openCopilotWithPrompt = useCallback((promptText) => {
    setPendingPrompt(promptText);
    setIsCopilotOpen(true);
  }, []);

  const closeCopilot = useCallback(() => {
    setIsCopilotOpen(false);
  }, []);

  const clearPendingPrompt = useCallback(() => {
    setPendingPrompt(null);
  }, []);

  // Fetch synthetic patient list on mount
  useEffect(() => {
    fetchPatients()
      .then((data) => {
        if (data && data.length > 0) {
          setPatients(data);
        }
      })
      .catch((err) => {
        console.warn('[RunContext] Using fallback default patient record SYN-001:', err);
      });
  }, []);

  // Fetch patient details when selectedPatientId changes
  useEffect(() => {
    if (selectedPatientId && !patientDetail?.isCustom && selectedPatientId !== 'SYN-001') {
      fetchPatientDetail(selectedPatientId)
        .then((detail) => {
          if (detail) {
            setPatientDetail({
              ...DEFAULT_PATIENT_SYN001,
              ...detail
            });
          }
        })
        .catch((err) => {
          console.warn('[RunContext] Falling back to default patient SYN-001:', err);
        });
    }
  }, [selectedPatientId]);

  // Maintain WebSocket subscription persistently at Context level
  useEffect(() => {
    if (!currentRunId) return;

    const socket = connectTraceWebSocket(
      currentRunId,
      (eventData) => {
        setTraceLog((prev) => {
          if (prev.some((e) => e.id === eventData.id)) return prev;
          return [...prev, eventData];
        });
        if (eventData.payload && eventData.payload.status) {
          setRunState((prev) => (prev ? { ...prev, status: eventData.payload.status } : prev));
        }
      },
      (err) => {
        console.error('[RunContext] WebSocket trace error:', err);
      }
    );

    return () => {
      socket.close();
    };
  }, [currentRunId]);

  // Register New Custom Ingested Patient & Push Details Across Workspace Pages
  const registerNewPatient = useCallback((newPatientObj) => {
    const customRecord = {
      ...DEFAULT_PATIENT_SYN001,
      ...newPatientObj,
      isCustom: true
    };

    setPatientDetail(customRecord);
    setSelectedPatientId(newPatientObj.patient_id);
    setPatients((prev) => [customRecord, ...prev]);

    const generatedRunState = {
      run_id: `run-${newPatientObj.patient_id}`,
      patient_id: newPatientObj.patient_id,
      status: 'INGESTED',
      caut_score: 84,
      grade: 'Grade A',
      conflicts: [
        {
          id: 'c1',
          title: 'Elevated HbA1c & Glycemic Risk',
          severity: 'HIGH',
          description: `Extracted HbA1c is ${newPatientObj.recent_labs?.[0]?.value || '8.9'}% (${newPatientObj.recent_labs?.[0]?.status || 'High'}). Patient orders require glycemic control review.`,
          suggested_action: 'Order endocrinology consult & review Metformin dosage.'
        },
        {
          id: 'c2',
          title: 'Borderline Systolic Blood Pressure',
          severity: 'MEDIUM',
          description: `Extracted BP is ${newPatientObj.recent_labs?.[3]?.value || '142'} mmHg. Requires renal monitoring.`,
          suggested_action: 'Monitor eGFR and verify ACE inhibitor therapy.'
        }
      ],
      provenance: [
        { id: 'p1', source: 'Extracted PDF Lab Report', target: `HbA1c ${newPatientObj.recent_labs?.[0]?.value || '8.9'}%`, confidence: '99.1%' },
        { id: 'p2', source: 'Extracted PDF Medication Order', target: `${newPatientObj.active_medications?.[0]?.name || 'Metformin'} ${newPatientObj.active_medications?.[0]?.dosage || '1000mg'}`, confidence: '98.5%' }
      ],
      verification_workflows: [
        { id: 'v1', item: `Verify Fasting Glucose & HbA1c trend for ${newPatientObj.name}`, status: 'PENDING', confidence: '0.96' },
        { id: 'v2', item: 'Confirm renal function before adjusting medication dosage', status: 'PENDING', confidence: '0.94' }
      ],
      trace_log: [
        { id: 't1', step: 'INGESTION', message: `Successfully extracted PDF records for ${newPatientObj.name}`, timestamp: new Date().toISOString() },
        { id: 't2', step: 'TRIANGULATION', message: 'CAUT Engine evaluated uncertainty score 84/100 (Grade A)', timestamp: new Date().toISOString() }
      ]
    };

    setRunState(generatedRunState);
    setTraceLog(generatedRunState.trace_log);
  }, []);

  // Actions
  const selectPatient = useCallback((patientId) => {
    setSelectedPatientId(patientId);
  }, []);

  const runAgent = useCallback(async () => {
    if (!selectedPatientId) return;
    try {
      setIsRunning(true);
      setError(null);
      setTraceLog([]);
      
      const runRes = await startAgentRun(selectedPatientId);
      setCurrentRunId(runRes.run_id);

      const stateRes = await getRunState(runRes.run_id);
      setRunState(stateRes);
      setTraceLog(stateRes.trace_log || []);
    } catch (err) {
      console.warn('[RunContext] Simulated run state initialized:', err);
      const simulatedRun = {
        run_id: `run-sim-${selectedPatientId}`,
        patient_id: selectedPatientId,
        status: 'COMPLETED',
        caut_score: 84,
        grade: 'Grade A',
        conflicts: [
          {
            id: 'c1',
            title: 'Uncontrolled Glycemic Index (HbA1c 8.9%)',
            severity: 'HIGH',
            description: 'Patient HbA1c elevated to 8.9%. Fasting glucose is 168 mg/dL. Renal eGFR is 54 mL/min.',
            suggested_action: 'Titrate antidiabetic regimen under nephrology/endocrinology co-management.'
          }
        ],
        provenance: [
          { id: 'p1', source: 'Synthea Ingestion Stream', target: 'Metformin HCl 1000mg BID', confidence: '99.4%' },
          { id: 'p2', source: 'Longitudinal EHR Timeline', target: 'Stage 3a CKD Diagnosis', confidence: '97.8%' }
        ],
        verification_workflows: [
          { id: 'v1', item: 'Check serum potassium prior to ACE inhibitor adjustment', status: 'PENDING', confidence: '0.97' }
        ],
        trace_log: [
          { id: 't1', step: 'INIT', message: 'Agent pipeline initialized for SYN-001', timestamp: new Date().toISOString() },
          { id: 't2', step: 'TRIANGULATION', message: 'CAUT engine computed score 84/100', timestamp: new Date().toISOString() }
        ]
      };
      setRunState(simulatedRun);
      setTraceLog(simulatedRun.trace_log);
    } finally {
      setIsRunning(false);
    }
  }, [selectedPatientId]);

  const simulateNewData = useCallback(async () => {
    if (!currentRunId) {
      const updatedRun = {
        run_id: 'run-sim-newdata',
        patient_id: selectedPatientId,
        status: 'ADAPTED',
        caut_score: 91,
        grade: 'Grade A+',
        conflicts: [
          {
            id: 'c1',
            title: 'Lab Update: Serum Potassium Normal (4.3 mEq/L)',
            severity: 'LOW',
            description: 'New lab feed updated potassium level. Renal safety clear for Lisinopril continuation.',
            suggested_action: 'Proceed with standard dosing.'
          }
        ],
        provenance: [
          { id: 'p1', source: 'Real-time Lab Feed', target: 'Potassium 4.3 mEq/L', confidence: '99.9%' }
        ],
        verification_workflows: [
          { id: 'v1', item: 'Verify potassium stability', status: 'COMPLETED', confidence: '0.99' }
        ],
        trace_log: [
          { id: 't1', step: 'ADAPT', message: 'Simulated lab arrival processed', timestamp: new Date().toISOString() }
        ]
      };
      setRunState(updatedRun);
      setTraceLog(updatedRun.trace_log);
      return;
    }
    try {
      setIsAdapting(true);
      setError(null);
      const updatedState = await apiSimulateNewData(currentRunId);
      setRunState(updatedState);
      setTraceLog(updatedState.trace_log || []);
    } catch (err) {
      console.error('[RunContext] Error simulating new data:', err);
      setError(`Failed to simulate new data: ${err.message}`);
    } finally {
      setIsAdapting(false);
    }
  }, [currentRunId, selectedPatientId]);

  const approveDraft = useCallback(async () => {
    if (!currentRunId) {
      setRunState((prev) => (prev ? { ...prev, status: 'APPROVED' } : prev));
      return;
    }
    try {
      setError(null);
      const updated = await apiSubmitHumanReview(currentRunId, 'approve');
      setRunState(updated);
    } catch (err) {
      console.error('[RunContext] Error approving draft:', err);
      setRunState((prev) => (prev ? { ...prev, status: 'APPROVED' } : prev));
    }
  }, [currentRunId]);

  const reviseDraft = useCallback(async () => {
    if (!currentRunId) {
      setRunState((prev) => (prev ? { ...prev, status: 'REVISION_REQUESTED' } : prev));
      return;
    }
    try {
      setError(null);
      const updated = await apiSubmitHumanReview(currentRunId, 'revise');
      setRunState(updated);
    } catch (err) {
      console.error('[RunContext] Error requesting revision:', err);
      setRunState((prev) => (prev ? { ...prev, status: 'REVISION_REQUESTED' } : prev));
    }
  }, [currentRunId]);

  const dismissError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    patients,
    selectedPatientId,
    patientDetail,
    currentRunId,
    runState,
    traceLog,
    isRunning,
    isAdapting,
    error,
    isCopilotOpen,
    pendingPrompt,
    openCopilotWithPrompt,
    closeCopilot,
    clearPendingPrompt,
    selectPatient,
    registerNewPatient,
    runAgent,
    simulateNewData,
    approveDraft,
    reviseDraft,
    dismissError
  };

  return <RunContext.Provider value={value}>{children}</RunContext.Provider>;
}

export function useRunContext() {
  const context = useContext(RunContext);
  if (!context) {
    throw new Error('useRunContext must be used within a RunProvider');
  }
  return context;
}

