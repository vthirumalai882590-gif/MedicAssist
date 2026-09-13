import React, { useEffect, useRef } from 'react';
import { Terminal, Search, CheckCircle, AlertTriangle, ArrowRight, Zap } from 'lucide-react';

const EVENT_TYPE_STYLES = {
  GOAL: { badge: 'bg-purple-100 text-purple-800 border-purple-200', icon: Terminal },
  DECISION: { badge: 'bg-cyan-100 text-cyan-800 border-cyan-200', icon: Search },
  ACTION: { badge: 'bg-teal-100 text-teal-800 border-teal-200', icon: ArrowRight },
  OBSERVATION: { badge: 'bg-amber-100 text-amber-800 border-amber-200', icon: AlertTriangle },
  ADAPTATION: { badge: 'bg-rose-100 text-rose-800 border-rose-200 live-pulse', icon: Zap },
  VERIFICATION: { badge: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle }
};

export default function AgentTrace({ traceLog = [] }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [traceLog]);

  return (
    <div className="command-card p-5 h-[500px] flex flex-col">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-[#184e5b] text-white flex items-center justify-center">
            <Terminal className="w-4 h-4 text-teal-300" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Live Agent Reasoning Trace</h3>
            <p className="text-xs text-slate-500 font-sans">Real-time WebSocket event streaming</p>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-600 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 font-semibold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 live-pulse"></span>
          WebSocket Feed ({traceLog.length} events)
        </span>
      </div>

      {/* Timeline List */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
        {traceLog.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs font-mono space-y-2">
            <Terminal className="w-10 h-10 text-slate-300" />
            <span className="font-semibold text-slate-500">Awaiting agent execution trace...</span>
            <span>Click <strong className="text-[#184e5b]">[ Launch Agent ]</strong> to start live event stream.</span>
          </div>
        ) : (
          traceLog.map((event, idx) => {
            const style = EVENT_TYPE_STYLES[event.event_type] || EVENT_TYPE_STYLES.ACTION;
            const Icon = style.icon;

            return (
              <div
                key={event.id || idx}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition animate-trace-entry"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono border font-bold flex items-center gap-1 ${style.badge}`}>
                      <Icon className="w-3 h-3" />
                      {event.event_type}
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {event.actor}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 font-medium">
                    {event.timestamp ? event.timestamp.split('T')[1]?.replace('Z', '') : ''}
                  </span>
                </div>

                <p className="text-xs text-slate-800 font-mono leading-relaxed">
                  {event.message}
                </p>

                {event.payload && Object.keys(event.payload).length > 0 && (
                  <details className="mt-2 text-xs font-mono text-slate-500">
                    <summary className="cursor-pointer hover:text-[#184e5b] transition font-semibold">View Event Payload</summary>
                    <pre className="mt-1.5 p-3 rounded-xl bg-slate-900 text-teal-300 text-[11px] overflow-x-auto border border-slate-800 shadow-inner">
                      {JSON.stringify(event.payload, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
