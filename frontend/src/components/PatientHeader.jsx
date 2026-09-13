import React from 'react';
import { Play, Zap, ShieldCheck, User, Cpu } from 'lucide-react';

export default function PatientHeader({
  patient,
  onRunAgent,
  onSimulateNewData,
  isRunning,
  isAdapting
}) {
  return (
    <div className="space-y-4 mb-6">
      
      {/* Main Hero Command Card */}
      <div className="bg-[#e8eef3] border border-[#d2dce4] rounded-2xl p-6 lg:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          
          {/* Left Text & Badges */}
          <div className="space-y-3 max-w-3xl">
            
            {/* Top Pill Badges Row */}
            <div className="flex flex-wrap items-center gap-2 font-sans text-xs">
              <span className="px-3 py-1 rounded-full bg-[#184e5b] text-white font-semibold flex items-center gap-1 shadow-xs">
                Autonomous Clinical Platform
              </span>

              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                FastAPI Sandbox Adapter
              </span>

              <span className="px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-300 font-semibold flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-cyan-600" />
                MCP-Ready Architecture
              </span>
            </div>

            {/* Hero Main Heading */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0f242a] tracking-tight leading-tight">
              Clinical Operations Command Center
            </h1>

            {/* Description */}
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-sans">
              MediAssistant continuously senses clinical discrepancies across workplace tools and synthetic EHRs, investigates root causes with specialized AI agents, and coordinates governed resolutions through FastAPI and clinical graph adapters.
            </p>

            {/* Single Locked Active Patient Profile Badge */}
            <div className="pt-2 flex flex-wrap items-center gap-3 font-sans text-xs">
              <div className="flex flex-wrap items-center gap-3 text-slate-800 font-bold bg-white px-4 py-2.5 rounded-2xl border border-slate-300 shadow-xs">
                {patient?.photo_url ? (
                  <img
                    src={patient.photo_url}
                    alt={patient.name || 'Patient'}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#184e5b] shadow-2xs"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-teal-100 border-2 border-[#184e5b] flex items-center justify-center text-[#184e5b] font-black text-sm">
                    {patient?.name?.charAt(0) || 'P'}
                  </div>
                )}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[#184e5b] font-extrabold text-sm">{patient?.name || 'Jane Doe (Synthetic)'}</span>
                    <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-mono border border-teal-200">
                      {patient?.patient_id || 'SYN-001'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-normal flex items-center space-x-2 mt-0.5">
                    <span>{patient?.age || 58} yrs ({patient?.gender || 'Female'})</span>
                    <span>•</span>
                    <span className="text-teal-800 font-semibold">{patient?.primary_condition || 'Type 2 Diabetes Mellitus & Stage 3a CKD'}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
            
            {/* Run / Launch Agent Button */}
            <button
              onClick={onRunAgent}
              disabled={isRunning || isAdapting}
              className={`px-6 py-3 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition active:scale-95 cursor-pointer ${
                isRunning
                  ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                  : 'bg-[#184e5b] hover:bg-[#123e49] text-white shadow-teal-900/10'
              }`}
            >
              <Play className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
              {isRunning ? 'Launching Agent...' : 'Launch Agent'}
            </button>

            {/* Simulate New Data Button */}
            <button
              onClick={onSimulateNewData}
              disabled={isRunning || isAdapting}
              className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition active:scale-95 cursor-pointer ${
                isAdapting
                  ? 'bg-amber-100 text-amber-700 border border-amber-300 cursor-not-allowed'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-300'
              }`}
            >
              <Zap className={`w-4 h-4 text-amber-500 ${isAdapting ? 'animate-bounce' : ''}`} />
              {isAdapting ? 'Adapting State...' : 'Simulate New Data'}
            </button>

          </div>

        </div>
      </div>

    </div>
  );
}
