import React from 'react';
import PatientHeader from '../components/PatientHeader';
import AgentTrace from '../components/AgentTrace';
import CautPanel from '../components/CautPanel';
import ProvenanceMap from '../components/ProvenanceMap';
import VerificationChecklist from '../components/VerificationChecklist';
import FinalRecord from '../components/FinalRecord';
import { useRunContext } from '../context/RunContext';
import { TrendingUp, AlertTriangle, Users, Clock, Zap, ArrowUpRight } from 'lucide-react';

export default function Dashboard() {
  const {
    patients,
    selectedPatientId,
    patientDetail,
    runState,
    traceLog,
    isRunning,
    isAdapting,
    selectPatient,
    runAgent,
    simulateNewData,
    approveDraft,
    reviseDraft
  } = useRunContext();

  const conflictCount = runState?.conflicts?.length || 1;
  const isRunActive = Boolean(runState);

  return (
    <div className="max-w-[1600px] mx-auto px-6 pb-12">
      
      {/* 1. Hero Command Center Banner */}
      <PatientHeader
        patient={patientDetail}
        onRunAgent={runAgent}
        onSimulateNewData={simulateNewData}
        isRunning={isRunning}
        isAdapting={isAdapting}
      />

      {/* 2. Top 5 Metric Cards Row (Matches Screenshot Metric Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        
        {/* Metric Card 1: Deterministic Clinical Score */}
        <div className="command-card command-card-interactive p-5">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              DETERMINISTIC CLINICAL SCORE
            </span>
          </div>

          <div className="flex items-baseline space-x-2 mb-2">
            <span className="text-3xl font-black text-slate-900 font-sans">81</span>
            <span className="text-sm font-semibold text-slate-400">/100</span>
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 ml-1">
              Grade A
            </span>
          </div>

          <div className="flex items-center space-x-1 text-[11px] font-semibold text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14 pts Projected gain after interventions</span>
          </div>
        </div>

        {/* Metric Card 2: Active Discrepancies */}
        <div className="command-card command-card-interactive p-5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
            ACTIVE DISCREPANCIES
          </span>

          <div className="text-3xl font-black text-slate-900 mb-2">
            {isRunActive ? conflictCount : 3}
          </div>

          <div className="flex items-center space-x-1 text-[11px] font-semibold text-amber-600">
            <span className="font-bold text-amber-700">{conflictCount} critical</span>
            <span>signals</span>
          </div>
        </div>

        {/* Metric Card 3: Affected Patients */}
        <div className="command-card command-card-interactive p-5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
            AFFECTED PATIENTS
          </span>

          <div className="flex items-center space-x-2 mb-2">
            <Users className="w-5 h-5 text-teal-700" />
            <span className="text-3xl font-black text-slate-900">3</span>
          </div>

          <span className="text-[11px] font-medium text-slate-500">
            Across 3 synthetic cases
          </span>
        </div>

        {/* Metric Card 4: Recoverable Clinical Hours */}
        <div className="command-card command-card-interactive p-5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
            RECOVERABLE HOURS
          </span>

          <div className="flex items-center space-x-1.5 mb-2 text-emerald-600">
            <Clock className="w-5 h-5 text-emerald-600" />
            <span className="text-3xl font-black text-emerald-600 font-sans">312h</span>
          </div>

          <span className="text-[11px] font-medium text-slate-500">
            ≈ $29,640/mo capacity saved
          </span>
        </div>

        {/* Metric Card 5: Agent Accuracy */}
        <div className="command-card command-card-interactive p-5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
            AGENT RESOLUTION
          </span>

          <div className="flex items-center space-x-1.5 mb-2 text-cyan-700">
            <Zap className="w-5 h-5 text-cyan-600" />
            <span className="text-3xl font-black text-cyan-700 font-sans">96.5%</span>
          </div>

          <span className="text-[11px] font-medium text-slate-500">
            Avg response: 1.8s
          </span>
        </div>

      </div>

      {/* 3. Health Score Dimensions Row (Matches Screenshot Dimensions Bar) */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Clinical Health Score Dimensions</h3>
            <p className="text-xs text-slate-500">Transparent weighted breakdown of patient clinical uncertainty</p>
          </div>

          <span className="px-3 py-1 rounded-lg bg-slate-200/70 text-slate-700 border border-slate-300 font-mono text-xs font-bold">
            Sense → Understand → Act Model
          </span>
        </div>

        {/* 5 Horizontal Dimension Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          
          <div className="command-card p-3.5 bg-slate-50/50">
            <span className="text-xs font-bold text-slate-600 block mb-1">Resolution Velocity</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-xl font-black text-slate-900">81</span>
              <span className="text-xs font-semibold text-slate-400">/100</span>
            </div>
          </div>

          <div className="command-card p-3.5 bg-slate-50/50">
            <span className="text-xs font-bold text-slate-600 block mb-1">Handoff Efficiency</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-xl font-black text-slate-900">61</span>
              <span className="text-xs font-semibold text-slate-400">/100</span>
            </div>
          </div>

          <div className="command-card p-3.5 bg-slate-50/50">
            <span className="text-xs font-bold text-slate-600 block mb-1">Ownership Clarity</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-xl font-black text-slate-900">89</span>
              <span className="text-xs font-semibold text-slate-400">/100</span>
            </div>
          </div>

          <div className="command-card p-3.5 bg-slate-50/50">
            <span className="text-xs font-bold text-slate-600 block mb-1">Rework & Blockers</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-xl font-black text-slate-900">100</span>
              <span className="text-xs font-semibold text-slate-400">/100</span>
            </div>
          </div>

          <div className="command-card p-3.5 bg-slate-50/50">
            <span className="text-xs font-bold text-slate-600 block mb-1">Safety & Guardrails</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-xl font-black text-slate-900">100</span>
              <span className="text-xs font-semibold text-slate-400">/100</span>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Agent Trace & CAUT Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Left 2 Cols: Live WebSocket Agent Trace */}
        <div className="lg:col-span-2">
          <AgentTrace traceLog={traceLog} />
        </div>

        {/* Right Col: CAUT Module */}
        <div className="lg:col-span-1">
          <CautPanel cautScores={runState?.caut_scores || []} />
        </div>

      </div>

      {/* 5. Innovation Modules Row: PGV & SVWG */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ProvenanceMap provenanceData={runState?.provenance || []} />
        <VerificationChecklist workflows={runState?.verification_workflows || []} />
      </div>

      {/* 6. Final Verified Record Section */}
      <FinalRecord
        finalRecord={runState?.final_record}
        onApprove={approveDraft}
        onRevise={reviseDraft}
        status={runState?.status}
      />

    </div>
  );
}
