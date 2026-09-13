import React from 'react';
import { ShieldAlert, AlertCircle, CheckCircle } from 'lucide-react';

export default function CautPanel({ cautScores = [] }) {
  if (!cautScores || cautScores.length === 0) {
    return (
      <div className="command-card p-5 h-full flex flex-col justify-between">
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">CAUT — Triangulation</h3>
            <p className="text-xs text-slate-500 font-sans">Context-Aware Uncertainty Score</p>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400 font-mono text-xs space-y-2 min-h-[240px]">
          <ShieldAlert className="w-10 h-10 text-slate-300 mb-1" />
          <span className="text-slate-700 font-bold">No Active Triangulation Data</span>
          <span>Click <strong className="text-[#184e5b]">[ Launch Agent ]</strong> to calculate uncertainty priority scores.</span>
        </div>
        <div className="pt-3 border-t border-slate-200 text-[11px] font-mono text-slate-500 flex justify-between font-semibold">
          <span>Formula: 0.4(WF) + 0.3(ACC) + 0.3(SAF)</span>
          <span>Awaiting Execution</span>
        </div>
      </div>
    );
  }

  const scoreData = cautScores[0];
  const isHigh = scoreData.priority_label?.includes("HIGH");
  const isMedium = scoreData.priority_label?.includes("MEDIUM");

  return (
    <div className="command-card p-5 h-full flex flex-col justify-between">
      <div>
        {/* Title */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">CAUT — Triangulation</h3>
              <p className="text-xs text-slate-500 font-sans">Uncertainty Priority Score</p>
            </div>
          </div>
          
          <span
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold border flex items-center gap-1.5 ${
              isHigh
                ? 'bg-rose-100 text-rose-800 border-rose-300'
                : isMedium
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-emerald-100 text-emerald-800 border-emerald-300'
            }`}
          >
            {isHigh ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
            {scoreData.priority_label} ({scoreData.priority_score})
          </span>
        </div>

        <p className="text-xs text-slate-600 mb-4 leading-relaxed font-sans">
          Formula: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[#184e5b] font-bold">0.4(Workflow) + 0.3(Accessibility) + 0.3(Safety)</code>. Ranks uncertainty priority.
        </p>

        {/* Dimension Breakdown Bars */}
        <div className="space-y-4 font-mono text-xs">
          
          {/* Workflow Impact */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-700 font-semibold">Workflow Impact (0.4 weight)</span>
              <span className="text-[#184e5b] font-bold">{(scoreData.workflow_impact * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
              <div
                className="bg-[#184e5b] h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${(scoreData.workflow_impact * 100).toFixed(0)}%` }}
              ></div>
            </div>
          </div>

          {/* Evidence Accessibility */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-700 font-semibold">Evidence Accessibility (0.3 weight)</span>
              <span className="text-cyan-700 font-bold">{(scoreData.evidence_accessibility * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
              <div
                className="bg-cyan-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${(scoreData.evidence_accessibility * 100).toFixed(0)}%` }}
              ></div>
            </div>
          </div>

          {/* Safety Sensitivity */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-700 font-semibold">Safety Sensitivity (0.3 weight)</span>
              <span className="text-amber-700 font-bold">{(scoreData.safety_sensitivity * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
              <div
                className="bg-amber-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${(scoreData.safety_sensitivity * 100).toFixed(0)}%` }}
              ></div>
            </div>
          </div>

        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-mono text-slate-500 flex justify-between font-semibold">
        <span>Conflict: {scoreData.conflict_type || 'medication_conflict'}</span>
        <span>Auditable Dimension Score</span>
      </div>
    </div>
  );
}
