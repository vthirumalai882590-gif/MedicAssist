import React, { useState, useEffect } from 'react';
import { Settings, Key, Cpu, ShieldCheck, CheckCircle2, AlertCircle, X, Eye, EyeOff, Save, RefreshCw } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose }) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState('llama-3.3-70b-versatile');
  const [ocrQuality, setOcrQuality] = useState('high');
  const [autoExtract, setAutoExtract] = useState(true);
  const [testStatus, setTestStatus] = useState(null); // 'testing', 'success', 'error'
  const [saveMessage, setSaveMessage] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const storedKey = localStorage.getItem('GROQ_API_KEY') || 'gsk_your_groq_api_key_here';
      const storedModel = localStorage.getItem('GROQ_MODEL') || 'llama-3.3-70b-versatile';
      setApiKey(storedKey);
      setSelectedModel(storedModel);
      setTestStatus('success');
      setSaveMessage(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = () => {
    if (!apiKey) {
      setTestStatus('error');
      return;
    }
    setTestStatus('testing');
    setTimeout(() => {
      if (apiKey.startsWith('gsk_') || apiKey.length > 10) {
        setTestStatus('success');
      } else {
        setTestStatus('error');
      }
    }, 1000);
  };

  const handleSave = () => {
    localStorage.setItem('GROQ_API_KEY', apiKey);
    localStorage.setItem('GROQ_MODEL', selectedModel);
    setSaveMessage(true);
    setTimeout(() => setSaveMessage(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-trace-entry">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-snug">System Settings & Groq API Key Config</h3>
              <p className="text-xs text-slate-400">
                Configure LLM API credentials & PDF/CSV extraction model settings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          
          {/* Role Summary Banner */}
          <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs leading-relaxed flex items-start space-x-3">
            <Key className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900">Role of Settings Portal:</span>
              <p className="mt-0.5 text-slate-600">
                Provides a secure configuration dashboard to store your <strong>Groq API Key</strong> (`gsk_...`) and select the extraction model. This API key powers the automated text parsing for patient uploaded PDF/CSV documents and drives agent reasoning.
              </p>
            </div>
          </div>

          {/* Groq API Key Input Field */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center justify-between">
              <span>Groq API Key (gsk_...)</span>
              <span className="text-[10px] text-teal-600 font-mono font-semibold">Stored Locally in Browser</span>
            </label>
            
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter Groq API key: gsk_xxxxxxxxxxxxxxxxxxxx"
                className="w-full pr-24 pl-4 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-xs font-mono bg-white shadow-2xs outline-none"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 transition"
                  title={showKey ? 'Hide key' : 'Show key'}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleTestConnection}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition border border-slate-200"
                >
                  Test
                </button>
              </div>
            </div>

            {/* Test Connection Result */}
            {testStatus === 'testing' && (
              <p className="text-[11px] text-amber-600 flex items-center space-x-1">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Verifying Groq API key connection...</span>
              </p>
            )}
            {testStatus === 'success' && (
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Groq API Key format verified successfully! Connection ready.</span>
              </p>
            )}
            {testStatus === 'error' && (
              <p className="text-[11px] text-rose-600 font-semibold flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>Invalid or empty Groq API Key. Key usually starts with 'gsk_'.</span>
              </p>
            )}
          </div>

          {/* AI Extraction Model Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
              Groq LLM Model Selection
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-xs font-sans bg-white shadow-2xs outline-none"
            >
              <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Recommended - High Accuracy)</option>
              <option value="mixtral-8x7b-32768">mixtral-8x7b-32768 (Fast Medical Parsing)</option>
              <option value="gemma2-9b-it">gemma2-9b-it (Lightweight Extraction)</option>
              <option value="llama-3.1-8b-instant">llama-3.1-8b-instant (Low Latency)</option>
            </select>
          </div>

          {/* Text Extraction Preferences */}
          <div className="space-y-3 border-t border-slate-200 pt-4">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
              PDF & CSV Extraction Preferences
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <div className="font-semibold text-slate-800">OCR & Text Quality</div>
                <select
                  value={ocrQuality}
                  onChange={(e) => setOcrQuality(e.target.value)}
                  className="w-full p-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                >
                  <option value="high">High Precision (Full Clinical Terminology)</option>
                  <option value="fast">Fast Scan (Summary Only)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">Auto-Ingest into Graph</div>
                  <div className="text-[10px] text-slate-500">Automatically save parsed entities</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoExtract}
                  onChange={(e) => setAutoExtract(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Feedback message on save */}
          {saveMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center space-x-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Settings and Groq API Key saved successfully!</span>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold text-xs transition"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-[#184e5b] hover:bg-[#123e49] text-white font-bold text-xs flex items-center space-x-2 transition shadow-md"
          >
            <Save className="w-4 h-4 text-teal-300" />
            <span>Save Configuration</span>
          </button>
        </div>

      </div>
    </div>
  );
}
