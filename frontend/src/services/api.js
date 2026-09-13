const API_BASE = 'http://localhost:8000/api';

export async function fetchPatients() {
  const res = await fetch(`${API_BASE}/patients`);
  if (!res.ok) throw new Error('Failed to fetch patients');
  return res.json();
}

export async function fetchPatientDetail(patientId) {
  const res = await fetch(`${API_BASE}/patients/${patientId}`);
  if (!res.ok) throw new Error('Failed to fetch patient detail');
  return res.json();
}

export async function startAgentRun(patientId) {
  const res = await fetch(`${API_BASE}/agent/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patient_id: patientId }),
  });
  if (!res.ok) throw new Error('Failed to start agent run');
  return res.json();
}

export async function getRunState(runId) {
  const res = await fetch(`${API_BASE}/runs/${runId}`);
  if (!res.ok) throw new Error('Failed to fetch run state');
  return res.json();
}

export async function simulateNewData(runId) {
  const res = await fetch(`${API_BASE}/runs/${runId}/simulate-new-data`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to simulate new data');
  return res.json();
}

export async function submitHumanReview(runId, decision) {
  const res = await fetch(`${API_BASE}/runs/${runId}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ decision }),
  });
  if (!res.ok) throw new Error('Failed to submit review');
  return res.json();
}

export async function fetchEvaluationMetrics() {
  const res = await fetch(`${API_BASE}/evaluation/metrics`);
  if (!res.ok) throw new Error('Failed to fetch evaluation metrics');
  return res.json();
}
