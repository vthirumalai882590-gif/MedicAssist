import React from 'react';
import { GitPullRequest, FileText, AlertOctagon, CheckCircle2 } from 'lucide-react';

export default function ProvenanceMap({ provenanceData = [] }) {
  if (!provenanceData || provenanceData.length === 0) {
    return (
      <div className="command-card p-5 h-full flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center">
              <GitPullRequest className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">PGV — Provenance Map</h3>
              <p className="text-xs text-slate-500 font-sans">Provenance-Gap Visualization Trail</p>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-500 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 font-semibold">
            Awaiting Run
          </span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400 font-mono text-xs space-y-2 min-h-[240px]">
          <GitPullRequest className="w-10 h-10 text-slate-300 mb-1" />
          <span className="text-slate-700 font-bold">No Provenance Graph Active</span>
          <span>Click <strong className="text-[#184e5b]">[ Launch Agent ]</strong> to map source evidence node trails.</span>
        </div>
        <div className="pt-3 border-t border-slate-200 text-[11px] font-mono text-slate-500 flex justify-between font-semibold">
          <span>PGV Renderer</span>
          <span>Verified Evidence Trail</span>
        </div>
      </div>
    );
  }

  const pgv = provenanceData[0];

  return (
    <div className="command-card p-5 h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center">
              <GitPullRequest className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">PGV — Provenance Map</h3>
              <p className="text-xs text-slate-500 font-sans">Source-to-Fact Evidence Trail</p>
            </div>
          </div>
          <span className="text-xs font-mono text-cyan-800 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 font-bold">
            Node-Link Trail
          </span>
        </div>

        <p className="text-xs text-slate-600 mb-4 font-sans">
          Source trail generated directly from Clinical Truth Graph fields for fact <code className="bg-slate-100 text-[#184e5b] px-1.5 py-0.5 rounded font-mono font-bold">{pgv.fact || 'medication.active_regimen'}</code>.
        </p>

        {/* Node Link Flow */}
        <div className="relative py-2 px-1">
          <div className="flex flex-col space-y-3">
            
            {pgv.nodes && pgv.nodes.map((nodeName, idx) => {
              const isConflict = nodeName === pgv.conflict_node;
              const isLast = idx === pgv.nodes.length - 1;

              return (
                <React.Fragment key={idx}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border flex-shrink-0 ${
                      isConflict
                        ? 'bg-rose-100 border-rose-300 text-rose-700 live-pulse'
                        : isLast
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                        : 'bg-purple-100 border-purple-300 text-purple-700'
                    }`}>
                      {isConflict ? (
                        <AlertOctagon className="w-4 h-4" />
                      ) : isLast ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                    </div>

                    <div className={`flex-1 p-2.5 rounded-xl border text-xs font-mono shadow-2xs ${
                      isConflict
                        ? 'bg-rose-50 border-rose-200 text-rose-900'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}>
                      <span className={isConflict ? 'text-rose-700 font-bold' : isLast ? 'text-emerald-700 font-bold' : 'text-purple-700 font-bold'}>
                        {isConflict ? 'DISCREPANCY DETECTED: ' : isLast ? 'RESOLUTION PATH: ' : 'SOURCE NODE: '}
                      </span>
                      {nodeName}
                    </div>
                  </div>

                  {!isLast && (
                    <div className="pl-4 text-slate-300 text-xs font-mono font-bold">│</div>
                  )}
                </React.Fragment>
              );
            })}

          </div>
        </div>

      </div>

      <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-mono text-slate-500 flex justify-between font-semibold">
        <span>Nodes: {pgv.nodes?.length || 0}</span>
        <span>Verified Evidence Trail</span>
      </div>
    </div>
  );
}
