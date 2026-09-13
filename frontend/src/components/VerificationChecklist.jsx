import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckSquare, Square, Clock } from 'lucide-react';

export default function VerificationChecklist({ workflows = [] }) {
  if (!workflows || workflows.length === 0) {
    return (
      <div className="command-card p-5 h-full flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">SVWG — Verification Protocol</h3>
              <p className="text-xs text-slate-500 font-sans">Synthetic Verification Workflow Generator</p>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-500 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 font-semibold">
            Awaiting Protocol
          </span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400 font-mono text-xs space-y-2 min-h-[240px]">
          <ShieldCheck className="w-10 h-10 text-slate-300 mb-1" />
          <span className="text-slate-700 font-bold">No Active Verification Checklist</span>
          <span>Click <strong className="text-[#184e5b]">[ Launch Agent ]</strong> to generate deterministic safety workflows.</span>
        </div>
        <div className="pt-3 border-t border-slate-200 text-[11px] font-mono text-slate-500 flex justify-between font-semibold">
          <span>Deterministic Protocol</span>
          <span>Synthetic Verification Checklist</span>
        </div>
      </div>
    );
  }

  const wf = workflows[0];
  const [items, setItems] = useState(wf.checklist || []);

  useEffect(() => {
    setItems(wf.checklist || []);
  }, [workflows]);

  const toggleItem = (id) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const completedCount = items.filter((i) => i.completed).length;

  return (
    <div className="command-card p-5 h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">SVWG — Verification Protocol</h3>
              <p className="text-xs text-slate-500 font-sans">Deterministic Rule-based Checklist</p>
            </div>
          </div>

          <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 font-bold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            {(wf.status || 'READY').replace(/_/g, ' ')}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-slate-600 mb-3">
          <span className="font-bold text-slate-800">{wf.title || 'Verification Protocol'}</span>
          <span className="text-[#184e5b] font-bold">{completedCount} / {items.length} Completed</span>
        </div>

        {/* Checklist */}
        <div className="space-y-2 font-mono text-xs max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
          {items.map((item, idx) => {
            const itemId = item.id || `step-${idx}`;
            return (
              <div
                key={itemId}
                onClick={() => toggleItem(itemId)}
                className={`p-2.5 rounded-xl border transition cursor-pointer flex items-start space-x-2.5 ${
                  item.completed
                    ? 'bg-teal-50 border-teal-200 text-teal-900'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300'
                }`}
              >
                {item.completed ? (
                  <CheckSquare className="w-4 h-4 text-teal-700 mt-0.5 flex-shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                )}
                <span className={item.completed ? 'line-through text-slate-500 font-medium' : 'font-semibold'}>
                  {item.step || item.action}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-mono text-slate-500 flex justify-between font-semibold">
        <span>Deterministic Protocol</span>
        <span>Synthetic Verification Checklist</span>
      </div>
    </div>
  );
}
