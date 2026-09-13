import React from 'react';
import { Activity, X, Shield, GitBranch, ArrowRight, CheckCircle2, Cpu, FileCheck } from 'lucide-react';

export default function ClinicalOverviewModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-trace-entry">
        
        {/* Modal Header */}
        <div className="bg-[#184e5b] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-snug">MediAssistant Clinical Architecture Overview</h3>
              <p className="text-xs text-teal-100/80">
                Agentic clinical workflow, uncertainty triangulation & safety architecture
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-teal-100 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          
          {/* Agentic Loop Diagram */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
            <div className="text-xs font-bold uppercase tracking-wide text-teal-400">
              Agent Execution Loop Cycle
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                <div className="font-bold text-teal-300">1. Sense</div>
                <div className="text-[10px] text-slate-400">Patient DB & Labs</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                <div className="font-bold text-teal-300">2. Triangulate</div>
                <div className="text-[10px] text-slate-400">CAUT Engine</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                <div className="font-bold text-teal-300">3. Map</div>
                <div className="text-[10px] text-slate-400">PGV Graph</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                <div className="font-bold text-teal-300">4. Plan</div>
                <div className="text-[10px] text-slate-400">SVWG Workflow</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                <div className="font-bold text-teal-300">5. Review</div>
                <div className="text-[10px] text-slate-400">Human Clinician</div>
              </div>
            </div>
          </div>

          {/* Core Innovations */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                <GitBranch className="w-4 h-4 text-teal-700" />
                <span>Clinical Truth Graph</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                In-memory patient graph with node metadata, line-by-line evidence provenance, and diff detection.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                <Cpu className="w-4 h-4 text-amber-600" />
                <span>CAUT Engine</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Formula: <code className="bg-slate-200 text-slate-800 px-1 rounded">(0.4×wf) + (0.3×acc) + (0.3×saf)</code> quantifying discrepancy uncertainty.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>SVWG Generator</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Rule-based verification checklist producing structured follow-up items under human governance.
              </p>
            </div>
          </div>

          {/* Safety Architecture Assertions */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1">
            <div className="font-bold flex items-center space-x-2 text-emerald-950">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Safety Architecture & Governance</span>
            </div>
            <p className="text-slate-700">
              Code-level assertions enforce <code className="bg-white border border-emerald-300 px-1.5 py-0.5 rounded font-mono text-[10px]">synthetic_only: true</code> and <code className="bg-white border border-emerald-300 px-1.5 py-0.5 rounded font-mono text-[10px]">human_review_required: true</code> across all agent outputs.
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#184e5b] hover:bg-[#123e49] text-white font-bold text-xs transition"
          >
            Close Overview
          </button>
        </div>

      </div>
    </div>
  );
}
