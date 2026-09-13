import React from 'react';
import VerificationChecklist from '../components/VerificationChecklist';
import { useRunContext } from '../context/RunContext';
import { ShieldCheck, User } from 'lucide-react';

export default function Verification() {
  const { patientDetail, runState } = useRunContext();

  return (
    <div className="max-w-[1600px] mx-auto px-6 pb-12">
      {/* Header Banner */}
      <div className="command-card p-6 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#184e5b]" />
            SVWG — Synthetic Verification Workflow Generator
          </h2>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Rules-based verification checklist protocol manager.
          </p>
        </div>

        {/* Single Locked Active Patient Badge */}
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl border border-slate-300 shadow-2xs text-xs font-bold">
          <User className="w-4 h-4 text-[#184e5b]" />
          <span className="text-[#184e5b]">SYN-001 — {patientDetail?.name || 'Jane Doe (Synthetic)'}</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-600">{patientDetail?.age || 58} yrs ({patientDetail?.gender || 'Female'})</span>
        </div>
      </div>

      <div className="min-h-[550px]">
        <VerificationChecklist workflows={runState?.verification_workflows || []} />
      </div>
    </div>
  );
}
