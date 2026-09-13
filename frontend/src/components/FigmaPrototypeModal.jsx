import React, { useState } from 'react';
import { Monitor, X, Layers, Copy, Check, Download, ExternalLink, Sparkles, Sliders, Palette, Layout, Box } from 'lucide-react';

export default function FigmaPrototypeModal({ isOpen, onClose }) {
  const [activeFrame, setActiveFrame] = useState('frame1');
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const figmaFrames = [
    {
      id: 'frame1',
      title: 'Frame 01: Command Center Dashboard',
      specs: '1600 x 1020 px • Desktop Grid (12 Col)',
      description: 'Primary clinical operations workspace showing CAUT score 81/100, active discrepancies, and live agent execution trace.',
      tokens: ['#184e5b (Primary Teal)', '#f4f7f9 (Canvas)', '#0f172a (Slate 900)', 'Border Radius: 16px']
    },
    {
      id: 'frame2',
      title: 'Frame 02: Provenance-Gap Visualization (PGV)',
      specs: '1600 x 1020 px • Dynamic Node-Link Graph',
      description: 'Interactive SVG node-link graph mapping raw lab evidence to inferred clinical claims with gap detection.',
      tokens: ['#0d9488 (Teal 600)', '#f43f5e (Rose 500)', '#f59e0b (Amber 500)', 'Stroke: 2px dashed']
    },
    {
      id: 'frame3',
      title: 'Frame 03: CAUT Uncertainty Triangulation Engine',
      specs: '1200 x 800 px • Weighted Breakdown Card',
      description: 'Breakdown of (0.4 × Workflow) + (0.3 × Accessibility) + (0.3 × Safety) math formulation.',
      tokens: ['#0284c7 (Sky 600)', '#8b5cf6 (Purple 600)', 'Font: Inter SemiBold 14px']
    },
    {
      id: 'frame4',
      title: 'Frame 04: Deterministic SVWG Verification Checklist',
      specs: '1200 x 800 px • Action Workflow List',
      description: 'Human clinician review checklist with status checkboxes, confidence metrics, and approval action buttons.',
      tokens: ['#10b981 (Emerald 500)', '#e2e8f0 (Slate 200)', 'Padding: 16px 24px']
    },
    {
      id: 'frame5',
      title: 'Frame 05: Evaluation Metrics Dashboard',
      specs: '1600 x 1020 px • Analytics & Benchmarks',
      description: 'Live test execution output scoring accuracy, precision, latency (184ms avg), and Grade A clinical safety.',
      tokens: ['Grade A Badge: #d1fae5', '#065f46 (Text)', 'Font: JetBrains Mono 12px']
    }
  ];

  const currentFrameObj = figmaFrames.find((f) => f.id === activeFrame);

  const handleCopyTokens = () => {
    const tokenText = JSON.stringify({
      designSystem: "MediAssistant UI v2",
      colors: {
        primaryTeal: "#184e5b",
        primaryTealHover: "#123e49",
        bgCanvas: "#f4f7f9",
        cardBg: "#ffffff",
        cardBorder: "#e2e8f0",
        textPrimary: "#0f172a"
      },
      typography: {
        fontFamily: "Inter, system-ui, sans-serif",
        h1: "24px SemiBold",
        h2: "18px Bold",
        body: "14px Regular",
        code: "12px JetBrains Mono"
      },
      spacing: ["8px", "12px", "16px", "24px", "32px"]
    }, null, 2);

    navigator.clipboard.writeText(tokenText);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleCopyCode = () => {
    const codeSnippet = `<div className="w-full bg-[#f4f7f9] p-6 font-sans">
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
    <h1 className="text-xl font-bold text-slate-900">MediAssistant Clinical Workspace</h1>
  </div>
</div>`;
    navigator.clipboard.writeText(codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl overflow-hidden animate-trace-entry flex flex-col max-h-[90vh]">
        
        {/* Figma Header Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Monitor className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-lg leading-snug">Figma-Ready Interactive Prototype</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Figma Design System v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pixel-perfect UI specs, design tokens, frame architecture & component breakdown
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyTokens}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center space-x-1.5 transition shadow-sm"
            >
              {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedToken ? 'Tokens Copied!' : 'Copy Figma Tokens'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Body: 2 Columns */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Column: Frame Selector Navigation */}
          <div className="w-72 bg-slate-50 border-r border-slate-200 p-4 space-y-3 overflow-y-auto">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2">
              Figma UI Frame Library (5 Frames)
            </div>

            <div className="space-y-1.5">
              {figmaFrames.map((frame) => (
                <button
                  key={frame.id}
                  onClick={() => setActiveFrame(frame.id)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition flex flex-col space-y-1 ${
                    activeFrame === frame.id
                      ? 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-600/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-100/80'
                  }`}
                >
                  <span className="font-bold text-slate-900">{frame.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{frame.specs}</span>
                </button>
              ))}
            </div>

            {/* Design System Tokens Box */}
            <div className="mt-6 p-4 rounded-xl bg-slate-900 text-white space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-purple-400 font-bold text-[11px] uppercase tracking-wide">
                <Palette className="w-4 h-4" />
                <span>Primary Color Tokens</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#184e5b] border border-white/20"></span>
                  <span>#184e5b</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#f4f7f9] border border-slate-400"></span>
                  <span>#f4f7f9</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#10b981]"></span>
                  <span>#10b981</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#f43f5e]"></span>
                  <span>#f43f5e</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Frame Preview & Specs */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
            
            {/* Active Frame Canvas Preview */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-4 shadow-inner">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <Layout className="w-4 h-4 text-purple-400" />
                  <span className="font-bold text-sm">{currentFrameObj?.title}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[11px]">
                  {currentFrameObj?.specs}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {currentFrameObj?.description}
              </p>

              {/* Visual Simulated Mockup Box */}
              <div className="h-44 rounded-xl bg-slate-950 border border-slate-800 p-4 flex flex-col justify-between relative overflow-hidden group">
                <div className="flex items-center justify-between text-[11px] border-b border-slate-800/80 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                    <span className="font-mono text-slate-400 ml-2">figma.com/@mediassistant/{activeFrame}</span>
                  </div>
                  <span className="text-purple-400 font-mono">Zoom: 100%</span>
                </div>

                <div className="flex items-center justify-center space-x-3 text-slate-400 text-xs font-mono py-6">
                  <Box className="w-8 h-8 text-purple-400 animate-pulse" />
                  <span>[ Interactive Figma Frame Node: {activeFrame.toUpperCase()} ]</span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-800/80">
                  <span>Autolayout: Horizontal & Vertical Fill</span>
                  <span>Grid: 8px Baseline</span>
                </div>
              </div>
            </div>

            {/* Token Tags */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2 flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-purple-600" />
                <span>Applied Frame Tokens & Specifications</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentFrameObj?.tokens.map((token, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 text-xs font-mono font-medium"
                  >
                    {token}
                  </span>
                ))}
              </div>
            </div>

            {/* Code Export Action */}
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-purple-950">Export Figma Component Code</div>
                <div className="text-purple-800/80 text-[11px]">Clean JSX + Tailwind CSS components ready for design handoff.</div>
              </div>
              <button
                onClick={handleCopyCode}
                className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold transition flex items-center space-x-1.5 shadow-xs"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Code Copied!' : 'Copy Component Code'}</span>
              </button>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">MediAssistant Figma Prototype System • Ready for Design & Engineering Hand-off</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
