import React from 'react';
import { useRunContext } from '../context/RunContext';
import { Database, User, ShieldCheck, Activity, Pill, FlaskConical, AlertTriangle, FileText, Sparkles, HeartPulse, ChevronRight } from 'lucide-react';

export default function PatientState() {
  const { patientDetail, openCopilotWithPrompt } = useRunContext();

  const handleAskMed = (med) => {
    openCopilotWithPrompt(`Audit safety and interaction risks for medication order: ${med.name} (${med.dosage}, ${med.frequency}) prescribed for ${patientDetail?.name || 'Jane Doe'}.`);
  };

  const handleAskLab = (lab) => {
    openCopilotWithPrompt(`Analyze clinical significance of lab measurement: ${lab.test || lab.name} = ${lab.value} ${lab.unit || ''} (Ref: ${lab.ref_range || 'Normal'}, Status: ${lab.status || 'Active'}) for ${patientDetail?.name || 'Jane Doe'}.`);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 pb-12">
      {/* Header Banner */}
      <div className="command-card p-6 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Database className="w-6 h-6 text-[#184e5b]" />
            Clinical Truth Graph — Patient State
          </h2>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Mutable in-memory graph view for patient <span className="text-[#184e5b] font-bold">{patientDetail?.name || 'Jane Doe (Synthetic)'}</span>
          </p>
        </div>

        {/* Single Locked Active Patient Badge */}
        <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-2xl border border-slate-300 shadow-2xs text-xs font-bold">
          {patientDetail?.photo_url ? (
            <img src={patientDetail.photo_url} alt={patientDetail.name} className="w-8 h-8 rounded-full object-cover border-2 border-[#184e5b]" />
          ) : (
            <User className="w-4 h-4 text-[#184e5b]" />
          )}
          <span className="text-[#184e5b]">SYN-001 — {patientDetail?.name || 'Jane Doe (Synthetic)'}</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-600">{patientDetail?.age || 58} yrs ({patientDetail?.gender || 'Female'})</span>
        </div>
      </div>

      {patientDetail ? (
        <div className="space-y-6">
          
          {/* Demographics & Baseline Summary Card */}
          <div className="command-card p-6 border-l-4 border-l-[#184e5b]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {patientDetail.photo_url ? (
                  <img
                    src={patientDetail.photo_url}
                    alt={patientDetail.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#184e5b] shadow-xs"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-teal-100 border-2 border-[#184e5b] flex items-center justify-center text-[#184e5b] font-black text-lg">
                    {patientDetail.name?.charAt(0) || 'P'}
                  </div>
                )}
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span>{patientDetail.name}</span>
                    <span className="text-xs text-slate-400 font-mono">({patientDetail.patient_id})</span>
                  </h3>
                  <p className="text-xs text-slate-500">Patient Photo Verified • Active Graph State</p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold text-xs">
                Active Graph State
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-medium block mb-0.5">Patient ID / MRN</span>
                <span className="font-bold text-slate-900">{patientDetail.patient_id} ({patientDetail.mrn || 'MRN-984210'})</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-medium block mb-0.5">Full Name</span>
                <span className="font-bold text-slate-900">{patientDetail.name}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-medium block mb-0.5">Age / Gender / DOB</span>
                <span className="font-bold text-slate-900">{patientDetail.age} YRS ({patientDetail.gender}) • {patientDetail.dob || '1968-04-12'}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-medium block mb-0.5">Primary Condition</span>
                <span className="font-bold text-teal-800">{patientDetail.primary_condition || patientDetail.condition}</span>
              </div>
            </div>
          </div>

          {/* Active Vitals Strip */}
          {patientDetail.vitals && (
            <div className="command-card p-6">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-rose-600" />
                Current Baseline Vitals
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <span className="text-slate-400 font-medium block mb-1">Blood Pressure</span>
                  <span className="font-black text-rose-700 text-sm">{patientDetail.vitals.blood_pressure}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <span className="text-slate-400 font-medium block mb-1">Heart Rate</span>
                  <span className="font-black text-slate-800 text-sm">{patientDetail.vitals.heart_rate}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <span className="text-slate-400 font-medium block mb-1">SpO2 Oxygen</span>
                  <span className="font-black text-emerald-700 text-sm">{patientDetail.vitals.spo2}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <span className="text-slate-400 font-medium block mb-1">Resp Rate</span>
                  <span className="font-black text-slate-800 text-sm">{patientDetail.vitals.respiratory_rate}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <span className="text-slate-400 font-medium block mb-1">Body Weight</span>
                  <span className="font-black text-slate-800 text-sm">{patientDetail.vitals.weight}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <span className="text-slate-400 font-medium block mb-1">Body Mass Index</span>
                  <span className="font-black text-teal-800 text-sm">{patientDetail.vitals.bmi}</span>
                </div>
              </div>
            </div>
          )}

          {/* Active Medications List */}
          <div className="command-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Pill className="w-5 h-5 text-teal-600" />
                Active Medication Orders ({patientDetail.active_medications?.length || 0})
              </h3>
              <span className="text-xs text-slate-500 font-mono">Real-time Graph State</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {patientDetail.active_medications?.map((med, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white hover:shadow-md transition space-y-2.5 relative flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="font-bold text-sm text-slate-900">{med.name}</div>
                      <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 text-[10px] font-bold border border-teal-200">
                        {med.category || 'Medication'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 font-semibold mt-1">Dosage: {med.dosage}</div>
                    <div className="text-[11px] text-teal-700 font-medium">Frequency: {med.frequency}</div>
                    {med.prescriber && (
                      <div className="text-[10px] text-slate-400 mt-1">Prescriber: {med.prescriber} • {med.prescribed}</div>
                    )}
                  </div>

                  <button
                    onClick={() => handleAskMed(med)}
                    className="w-full py-1.5 px-3 rounded-lg bg-teal-50 hover:bg-teal-100 text-[#184e5b] font-extrabold text-[11px] flex items-center justify-center space-x-1.5 border border-teal-200 transition cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>Ask AI about this Med</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Lab Measurements */}
          <div className="command-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-amber-600" />
                Recent Lab Measurements & Panels ({patientDetail.recent_labs?.length || 0})
              </h3>
              <span className="text-xs text-slate-500 font-mono">Last updated: {patientDetail.last_visit || '2026-08-28'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {patientDetail.recent_labs?.map((lab, idx) => {
                const isHigh = lab.status?.toLowerCase().includes('high');
                const isLow = lab.status?.toLowerCase().includes('low');
                const badgeColor = isHigh ? 'bg-rose-50 text-rose-700 border-rose-200' : isLow ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-700 border-slate-200';

                return (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white hover:shadow-md transition space-y-2.5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="font-bold text-xs text-slate-900">{lab.test || lab.name}</div>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${badgeColor}`}>
                          {lab.status || 'Lab Result'}
                        </span>
                      </div>
                      <div className="text-xl font-black text-[#184e5b] my-1">
                        {lab.value} <span className="text-xs font-normal text-slate-500">{lab.unit}</span>
                      </div>
                      {lab.ref_range && (
                        <div className="text-[11px] text-slate-500">Ref Range: {lab.ref_range}</div>
                      )}
                      {lab.trend && (
                        <div className="text-[10px] font-semibold text-teal-800 mt-0.5">Trend: {lab.trend}</div>
                      )}
                    </div>

                    <button
                      onClick={() => handleAskLab(lab)}
                      className="w-full py-1.5 px-3 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-extrabold text-[11px] flex items-center justify-center space-x-1.5 border border-amber-200 transition cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Ask AI about this Lab</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      ) : (
        <div className="p-8 text-center text-slate-500 text-sm">
          Loading patient state details...
        </div>
      )}
    </div>
  );
}

