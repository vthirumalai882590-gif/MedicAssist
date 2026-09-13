import React, { useState } from 'react';
import { useRunContext } from '../context/RunContext';
import { Calendar, User, FileText, AlertTriangle, Activity, ShieldCheck, HeartPulse, Bone, Wind, Cpu, Sparkles, Filter, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function LongitudinalHistory() {
  const { patientDetail } = useRunContext();
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const historyEvents = [
    {
      id: 'h1',
      year: '2024',
      date: '2024-03-14',
      category: 'orthopedic',
      categoryLabel: 'Orthopedic Trauma',
      title: 'Left Tibia-Fibula Leg Fracture & ORIF Surgery',
      pdfSource: 'Trauma_Discharge_March2024.pdf',
      summary: 'Patient sustained left closed tibia-fibula shaft fracture following a fall. Underwent successful Open Reduction Internal Fixation (ORIF) with intramedullary nailing.',
      labsAndVitals: 'Post-op Hb: 11.8 g/dL • BP: 132/82 mmHg • Recovery: Full weight bearing achieved by Sept 2024.',
      medications: 'Ibuprofen 600mg TID (Discontinued) • Enoxaparin 40mg QD (14 days DVT prophylaxis)',
      aiRiskNote: 'NSAIDs used in 2024 monitored for transient renal impact prior to 2026 diabetes diagnosis.',
      icon: Bone,
      color: 'bg-[#184e5b] text-white',
      badgeBg: 'bg-[#184e5b]/10 text-[#184e5b] border-[#184e5b]/30'
    },
    {
      id: 'h2',
      year: '2025',
      date: '2025-11-08',
      category: 'pulmonary',
      categoryLabel: 'Pulmonary / ICU',
      title: 'Acute Lung Failure & Severe Pneumonia ICU Episode',
      pdfSource: 'Pulmonary_ICU_Report_Nov2025.pdf',
      summary: 'Admitted to Medical ICU with acute hypoxemic lung failure secondary to viral bronchopneumonia. Required non-invasive positive pressure ventilation (BiPAP) & O2 therapy.',
      labsAndVitals: 'SpO2: 88% on room air -> 97% on 4L O2 • PaO2/FiO2 ratio: 180 • Chest X-Ray: Bilateral pulmonary infiltrates.',
      medications: 'Ceftriaxone 2g IV QD • Azithromycin 500mg IV QD • Dexamethasone 6mg QD (7 days)',
      aiRiskNote: 'Critical Safety Flag: Metformin was temporarily withheld during acute lung failure episode to prevent lactic acidosis.',
      icon: Wind,
      color: 'bg-sky-600 text-white',
      badgeBg: 'bg-sky-50 text-sky-800 border-sky-300'
    },
    {
      id: 'h3',
      year: '2026',
      date: '2026-09-12',
      category: 'metabolic',
      categoryLabel: 'Metabolic & Renal',
      title: 'Type 2 Diabetes & Essential Hypertension Ingestion',
      pdfSource: `${patientDetail?.name || 'Patient'}_Clinical_Lab_Report.pdf`,
      summary: 'Latest PDF ingestion reveals uncontrolled glycemic markers alongside mild renal function decline. Agentic CAUT Engine evaluated uncertainty score 84/100.',
      labsAndVitals: 'HbA1c: 8.9% (Elevated) • Fasting Glucose: 168 mg/dL • eGFR: 54 mL/min/1.73m2 (Mild Impairment) • BP: 142/88 mmHg.',
      medications: 'Metformin 1000mg BID • Amlodipine 5mg QD • Lisinopril 10mg QD',
      aiRiskNote: 'Cross-Condition Triangulation: CAUT engine cross-referenced 2025 acute lung failure history + 2026 eGFR 54 to validate safe Metformin dosing.',
      icon: HeartPulse,
      color: 'bg-rose-600 text-white',
      badgeBg: 'bg-rose-50 text-rose-800 border-rose-300'
    }
  ];

  const filteredEvents = historyEvents.filter((ev) => {
    const yearMatch = selectedYear === 'ALL' || ev.year === selectedYear;
    const catMatch = selectedCategory === 'ALL' || ev.category === selectedCategory;
    return yearMatch && catMatch;
  });

  return (
    <div className="max-w-[1600px] mx-auto px-6 pb-12 font-sans space-y-6">
      
      {/* 1. Header Command Card */}
      <div className="command-card p-6 border-l-4 border-l-[#184e5b]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#184e5b] mb-1 uppercase tracking-wide">
              <Calendar className="w-4 h-4 text-teal-600" />
              <span>Multi-Year Longitudinal Patient Medical Route</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Longitudinal Medical History & Cross-Condition Route Analyzer
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Multi-year PDF ingestion route aligning <strong>2024 leg fracture surgery</strong>, <strong>2025 acute lung failure ICU stay</strong>, and <strong>2026 diabetes lab records</strong>.
            </p>
          </div>

          {/* Active Patient Badge */}
          <div className="flex items-center space-x-3 bg-slate-100 p-2.5 px-4 rounded-2xl border border-slate-200 text-xs font-bold flex-shrink-0">
            {patientDetail?.photo_url ? (
              <img src={patientDetail.photo_url} alt={patientDetail.name} className="w-8 h-8 rounded-full object-cover border-2 border-[#184e5b]" />
            ) : (
              <User className="w-4 h-4 text-[#184e5b]" />
            )}
            <span className="text-[#184e5b]">SYN-001 — {patientDetail?.name || 'Jane Doe (Synthetic)'}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600">{patientDetail?.age || 62} YRS ({patientDetail?.gender || 'Female'})</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Year & Category Filter Bar */}
      <div className="command-card p-4 flex flex-wrap items-center justify-between gap-4 text-xs font-sans">
        
        {/* Year Filter Buttons */}
        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-700 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#184e5b]" /> Filter Year:
          </span>
          {['ALL', '2024', '2025', '2026'].map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                selectedYear === year
                  ? 'bg-[#184e5b] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {year === 'ALL' ? 'All Years (2024-2026)' : year}
            </button>
          ))}
        </div>

        {/* Category Filter Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Conditions
          </button>
          <button
            onClick={() => setSelectedCategory('orthopedic')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              selectedCategory === 'orthopedic'
                ? 'bg-[#184e5b] text-white'
                : 'bg-teal-50 text-teal-800 hover:bg-teal-100'
            }`}
          >
            🦵 Leg Fracture (2024)
          </button>
          <button
            onClick={() => setSelectedCategory('pulmonary')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              selectedCategory === 'pulmonary'
                ? 'bg-sky-700 text-white'
                : 'bg-sky-50 text-sky-800 hover:bg-sky-100'
            }`}
          >
            🫁 Lung Failure (2025)
          </button>
          <button
            onClick={() => setSelectedCategory('metabolic')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              selectedCategory === 'metabolic'
                ? 'bg-rose-700 text-white'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
            }`}
          >
            🩸 Diabetes & Renal (2026)
          </button>
        </div>

      </div>

      {/* 3. Multi-Year Longitudinal Timeline View */}
      <div className="space-y-6 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-300 pl-4">
        {filteredEvents.map((event) => {
          const IconComponent = event.icon;
          return (
            <div key={event.id} className="relative pl-10 animate-trace-entry">
              
              {/* Timeline Node Dot */}
              <div className={`absolute left-2.5 top-5 -translate-x-1/2 w-8 h-8 rounded-full ${event.color} flex items-center justify-center shadow-md ring-4 ring-white`}>
                <IconComponent className="w-4 h-4" />
              </div>

              {/* Event Card */}
              <div className="command-card p-6 space-y-4 hover:shadow-md transition">
                
                {/* Event Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-black text-slate-900 text-sm bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                      {event.date} ({event.year})
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${event.badgeBg}`}>
                      {event.categoryLabel}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-mono">
                    <FileText className="w-3.5 h-3.5 text-teal-600" />
                    <span>Ingested PDF Source: <strong className="text-slate-800">{event.pdfSource}</strong></span>
                  </div>
                </div>

                {/* Event Description */}
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 mb-1">{event.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{event.summary}</p>
                </div>

                {/* Grid: Labs/Vitals + Medications */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800 uppercase tracking-wide text-[10px] block">
                      Extracted Vitals & Clinical Measurements:
                    </span>
                    <p className="font-mono text-slate-700 text-[11px]">{event.labsAndVitals}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800 uppercase tracking-wide text-[10px] block">
                      Historical Medication Regimen:
                    </span>
                    <p className="text-slate-700 text-[11px] font-medium">{event.medications}</p>
                  </div>
                </div>

                {/* AI Cross-Condition Safety Note */}
                <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-300 text-amber-950 text-xs flex items-start space-x-2.5 font-medium">
                  <Sparkles className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-900">AI Longitudinal Cross-Condition Note: </span>
                    <span className="text-slate-800">{event.aiRiskNote}</span>
                  </div>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* 4. AI Multi-Year Cross-Condition Synthesis Banner */}
      <div className="p-6 rounded-3xl bg-[#184e5b] text-white space-y-4 shadow-xl border border-teal-500/30">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-teal-500/20 text-teal-300">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base">Longitudinal Multi-Year Clinical Synthesis</h3>
            <p className="text-xs text-teal-100/80">Cross-organ system analysis covering 2024 Leg Fracture → 2025 Lung Failure → 2026 Diabetes Ingestion</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-teal-500/30 space-y-1">
            <div className="font-bold text-teal-300">🦵 2024 Trauma History</div>
            <p className="text-slate-300 text-[11px]">Tibia ORIF surgery healed with zero long-term orthopedic complications. No active NSAID use.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-teal-500/30 space-y-1">
            <div className="font-bold text-teal-300">🫁 2025 Respiratory History</div>
            <p className="text-slate-300 text-[11px]">Acute hypoxemic lung failure resolved post-BiPAP & steroids. Normal baseline pulmonary status restored.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-teal-500/30 space-y-1">
            <div className="font-bold text-teal-300">🩸 2026 Diabetes & Renal Status</div>
            <p className="text-slate-300 text-[11px]">Uncontrolled HbA1c (8.9%) + eGFR 54. CAUT score 84/100 safely validated under doctor review.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
