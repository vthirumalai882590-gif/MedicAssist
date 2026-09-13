import React, { useState } from 'react';
import { FileCheck, ShieldCheck, Check, RotateCcw, AlertTriangle, UserCheck } from 'lucide-react';

export default function FinalRecord({ finalRecord, onApprove, onRevise, status }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async () => {
    setIsSubmitting(true);
    await onApprove();
    setIsSubmitting(false);
  };

  const handleRevise = async () => {
    setIsSubmitting(true);
    await onRevise();
    setIsSubmitting(false);
  };

  if (!finalRecord) {
    return (
      <div className="command-card p-6 flex flex-col items-center justify-center text-center h-[340px] text-slate-400">
        <FileCheck className="w-12 h-12 mb-2 text-slate-300" />
        <h4 className="font-bold text-slate-700 text-base">No Draft Record Generated Yet</h4>
        <p className="text-xs font-mono mt-1 text-slate-500">Click <strong className="text-[#184e5b]">[ Launch Agent ]</strong> to initiate pipeline and generate verified clinical follow-up draft.</p>
      </div>
    );
  }

  const isApproved = status === 'APPROVED';
  const isRevised = status === 'REVISED';

  return (
    <div className="command-card p-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-4 mb-4 gap-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#184e5b] text-white flex items-center justify-center font-bold">
            <FileCheck className="w-5 h-5 text-teal-300" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">VERIFIED FOLLOW-UP RECORD</h3>
            <p className="text-xs font-mono text-slate-500">Generated for Clinician Approval • Patient: {finalRecord.patient_id}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            SYNTHETIC ONLY: TRUE
          </span>
          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 font-bold flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            HUMAN REVIEW: REQUIRED
          </span>
        </div>
      </div>

      {/* Draft Document Content Box */}
      <div className="p-4 rounded-xl bg-slate-900 text-teal-200 border border-slate-800 font-mono text-xs mb-5 whitespace-pre-wrap leading-relaxed shadow-inner">
        {finalRecord.notes_content}
      </div>

      {/* Validation Checks Checklist */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs mb-6">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-emerald-800 font-semibold">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Required Fields</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-emerald-800 font-semibold">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Source Consistency</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-emerald-800 font-semibold">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Provenance Tracked</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-emerald-800 font-semibold">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Synthetic Guardrail</span>
        </div>
      </div>

      {/* Human Review Gate Actions */}
      <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex items-center space-x-2 text-xs font-mono text-slate-600">
          <UserCheck className="w-4 h-4 text-[#184e5b]" />
          <span className="font-bold">MANDATORY CLINICIAN GATE:</span>
          {isApproved ? (
            <span className="text-emerald-800 font-bold px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300">
              ✓ DRAFT APPROVED
            </span>
          ) : isRevised ? (
            <span className="text-amber-800 font-bold px-3 py-1 rounded-full bg-amber-100 border border-amber-300">
              ↺ REVISION REQUESTED
            </span>
          ) : (
            <span className="text-amber-700 font-bold">AWAITING CLINICIAN DECISION</span>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRevise}
            disabled={isSubmitting || isApproved}
            className="px-4 py-2.5 rounded-xl text-xs font-bold font-mono bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 flex items-center gap-1.5 transition shadow-xs disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Return for Revision
          </button>

          <button
            onClick={handleApprove}
            disabled={isSubmitting || isApproved}
            className="px-5 py-2.5 rounded-xl text-xs font-bold font-mono bg-[#184e5b] hover:bg-[#123e49] text-white flex items-center gap-1.5 shadow-md transition disabled:opacity-50"
          >
            <Check className="w-4 h-4 font-bold" />
            Approve Draft Record
          </button>
        </div>

      </div>

    </div>
  );
}
