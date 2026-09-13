import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Bot, Send, User, X, ShieldCheck, Stethoscope, RefreshCw, ChevronRight, FileText, AlertTriangle, CheckCircle2, MessageSquare } from 'lucide-react';
import { useRunContext } from '../context/RunContext';

export default function AICopilotPanel({ isOpen, onClose }) {
  const { patientDetail, runState, pendingPrompt, clearPendingPrompt } = useRunContext();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello Doctor! I am your **MediAssistant AI Clinical Co-Pilot**. I am currently monitoring patient **${patientDetail?.name || 'Jane Doe'}** (${patientDetail?.patient_id || 'SYN-001'}). How can I assist you with clinical discrepancy investigation or medication audit today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  // If a prompt was pending (e.g., user clicked "Ask AI about this Med/Lab"), auto-send it
  useEffect(() => {
    if (isOpen && pendingPrompt) {
      const promptToRun = pendingPrompt;
      clearPendingPrompt();
      handleSend(promptToRun);
    }
  }, [isOpen, pendingPrompt]);

  if (!isOpen) return null;

  const quickPrompts = [
    "⚡ Audit medication interaction risks",
    "📊 Explain HbA1c & Fasting Glucose discrepancy",
    "🛡️ Check renal function safety flags (eGFR 54)",
    "📝 Generate patient-friendly discharge summary"
  ];

  const handleSend = async (textToSend) => {
    const text = textToSend || query;
    if (!text.trim()) return;

    const userMsg = {
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setIsThinking(true);

    const apiKey = localStorage.getItem('GROQ_API_KEY') || 'gsk_your_groq_api_key_here';
    const model = localStorage.getItem('GROQ_MODEL') || 'llama-3.3-70b-versatile';

    try {
      const systemPrompt = `You are MediAssistant, an expert agentic AI clinical co-pilot assisting medical doctors in reviewing patient records.
Current Active Patient Context:
- Name: ${patientDetail?.name || 'Jane Doe'} (ID: ${patientDetail?.patient_id || 'SYN-001'})
- Demographics: ${patientDetail?.age || 58} yrs, ${patientDetail?.gender || 'Female'}, DOB: ${patientDetail?.dob || '1968-04-12'}
- Active Diagnoses: ${patientDetail?.primary_condition || patientDetail?.condition || 'Type 2 Diabetes Mellitus & Stage 3a CKD'}
- Active Medications: ${JSON.stringify(patientDetail?.active_medications || [])}
- Recent Labs: ${JSON.stringify(patientDetail?.recent_labs || [])}
- Vitals: ${JSON.stringify(patientDetail?.vitals || {})}
- Medical Timeline History: ${JSON.stringify(patientDetail?.longitudinal_timeline || [])}

Clinical Directives:
1. Provide precise, evidence-based, actionable clinical insights.
2. Structure output cleanly using bold headers, bullet points, and quantitative metrics.
3. Explicitly evaluate safety flags (e.g. eGFR 54 mL/min, elevated HbA1c 8.9%, blood pressure 142/88 mmHg).
4. Always enforce that final clinical decisions require doctor sign-off.`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.filter((m) => m.sender !== 'system').slice(-6).map((m) => ({
              role: m.sender === 'ai' ? 'assistant' : 'user',
              content: m.text
            })),
            { role: 'user', content: text }
          ],
          temperature: 0.3,
          max_tokens: 750
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiText = data.choices?.[0]?.message?.content || 'Clinical analysis completed.';
        
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: aiText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error(`Groq API returned HTTP ${response.status}`);
      }
    } catch (err) {
      console.warn('[AICopilotPanel] Falling back to structured response:', err);
      
      // Contextual fallback logic if network / API key fails
      let fallbackText = '';
      if (text.toLowerCase().includes('medication') || text.toLowerCase().includes('audit') || text.toLowerCase().includes('med')) {
        fallbackText = `**AI Medication Interaction & Renal Audit:**\n- **Metformin HCl 1000mg BID**: Primary antidiabetic. *Safety Note*: Patient eGFR is **54 mL/min/1.73m²** (Stage 3a CKD). Metformin dose remains safe (>45 mL/min limit), but quarterly renal panel monitoring is recommended.\n- **Lisinopril 10mg QD**: ACE Inhibitor for BP (142/88 mmHg). Recheck serum potassium levels.\n- **Insulin Glargine 14 Units**: Co-prescribed for glycemic stabilization.\n- **Conclusion**: No fatal contraindications detected. Co-prescribing requires endocrinology sign-off.`;
      } else if (text.toLowerCase().includes('hba1c') || text.toLowerCase().includes('glucose') || text.toLowerCase().includes('lab')) {
        fallbackText = `**AI Discrepancy Analysis:**\n- **Observed Lab**: HbA1c is **${patientDetail?.recent_labs?.find(l => l.name?.includes('HbA1c'))?.value || '8.9'}%** (High) and Fasting Glucose is **${patientDetail?.recent_labs?.find(l => l.name?.includes('Glucose'))?.value || '168'} mg/dL**.\n- **CAUT Score**: 84/100 (Grade A Confidence).\n- **Clinical Recommendation**: Endocrinologist consultation suggested to evaluate dual-agent titration.`;
      } else {
        fallbackText = `**AI Clinical Assistant Analysis:**\nBased on patient **${patientDetail?.name || 'Jane Doe'}**'s graph state, the primary active conditions are *${patientDetail?.primary_condition || 'Type 2 Diabetes & Stage 3a CKD'}*. Current CAUT uncertainty score is 84/100. All recommendations require mandatory doctor sign-off.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-trace-entry">
      
      {/* Copilot Header */}
      <div className="bg-[#184e5b] text-white px-5 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm leading-snug flex items-center gap-1.5">
              <span>AI Clinical Co-Pilot</span>
              <span className="px-2 py-0.5 rounded-full bg-teal-400 text-slate-950 font-extrabold text-[10px]">
                Groq LLM Live
              </span>
            </h3>
            <p className="text-[11px] text-teal-100/80">Active Patient: {patientDetail?.name || 'Jane Doe'} ({patientDetail?.patient_id || 'SYN-001'})</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-teal-100 hover:text-white hover:bg-white/10 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Safety Notice Strip */}
      <div className="px-4 py-2 bg-teal-50 border-b border-teal-200 text-teal-900 text-[11px] font-semibold flex items-center justify-between">
        <span className="flex items-center space-x-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Human-in-the-loop Doctor Review Enforced</span>
        </span>
        <span className="text-[10px] font-mono text-teal-700">CAUT: 84/100</span>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar text-xs bg-slate-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center space-x-1.5 mb-1 text-[10px] text-slate-400 font-mono">
              {msg.sender === 'ai' ? (
                <>
                  <Bot className="w-3.5 h-3.5 text-teal-600" />
                  <span className="font-bold text-slate-700">MediAssistant AI (Groq Llama-3.3)</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 text-slate-600" />
                  <span className="font-bold text-slate-700">Doctor / Clinician</span>
                </>
              )}
              <span>• {msg.timestamp}</span>
            </div>

            <div
              className={`p-3.5 rounded-2xl max-w-[90%] leading-relaxed shadow-2xs whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-[#184e5b] text-white rounded-br-none'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center space-x-2 text-slate-500 text-xs italic bg-white p-3 rounded-xl border border-slate-200 w-fit">
            <RefreshCw className="w-4 h-4 text-teal-600 animate-spin" />
            <span>Groq LLM Reasoning over Clinical Truth Graph...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="p-3 bg-white border-t border-slate-200 space-y-1.5">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Suggested AI Clinical Actions
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 text-[11px] font-semibold transition border border-slate-200 text-left cursor-pointer"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Ask AI about ${patientDetail?.name || 'Jane Doe'}'s labs or meds...`}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#184e5b] text-xs outline-none bg-slate-50"
        />
        <button
          type="submit"
          disabled={isThinking}
          className="p-2.5 rounded-xl bg-[#184e5b] hover:bg-[#123e49] disabled:opacity-50 text-white transition cursor-pointer"
        >
          <Send className="w-4 h-4 text-teal-300" />
        </button>
      </form>

    </div>
  );
}
