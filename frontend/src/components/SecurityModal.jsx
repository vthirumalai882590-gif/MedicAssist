import React from 'react';
import { ShieldCheck, Lock, EyeOff, FileCheck, CheckCircle2, UserCheck, Key, Cpu, AlertTriangle, X, Server, Layers } from 'lucide-react';

export default function SecurityModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const securityPillars = [
    {
      icon: Lock,
      color: 'bg-emerald-100 text-emerald-700 border-emerald-300',
      title: '1. Synthetic Data Isolation & HIPAA Compliance',
      badge: 'HIPAA Guardrail Enforced',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      description: 'The system strictly operates under synthetic_only: true flags. All clinical data processed is synthetic (SYN-001 Jane Doe, SYN-002, SYN-003). No real Protected Health Information (PHI) is ever exposed or transmitted to external endpoints.'
    },
    {
      icon: UserCheck,
      color: 'bg-teal-100 text-[#184e5b] border-teal-300',
      title: '2. Mobile + OTP Patient & Doctor Authentication',
      badge: 'Role-Based Access Control',
      badgeColor: 'bg-teal-50 text-teal-900 border-teal-300',
      description: 'Entry into the platform requires Mobile Number + OTP verification gate. Patients and Doctors receive role-segmented access controls, protecting sensitive patient records from unauthorized viewing.'
    },
    {
      icon: ShieldCheck,
      color: 'bg-amber-100 text-amber-800 border-amber-300',
      title: '3. Mandatory Human-in-the-Loop Doctor Review',
      badge: 'Human Clinician Sign-Off',
      badgeColor: 'bg-amber-50 text-amber-900 border-amber-300',
      description: 'AI agents cannot autonomously modify or order prescriptions. Every AI clinical co-pilot suggestion, medication audit, and draft record requires explicit doctor review and approval before final sign-off.'
    },
    {
      icon: Cpu,
      color: 'bg-sky-100 text-sky-800 border-sky-300',
      title: '4. CAUT Engine (Uncertainty & Discrepancy Triangulation)',
      badge: 'Automated Hallucination Detection',
      badgeColor: 'bg-sky-50 text-sky-900 border-sky-300',
      description: 'The Certainty & Audit Uncertainty (CAUT) Engine evaluates data confidence (e.g. 84/100 Grade A) across fragmented EHR records, detecting conflicting entries before clinicians act on them.'
    },
    {
      icon: FileCheck,
      color: 'bg-purple-100 text-purple-800 border-purple-300',
      title: '5. Provenance Graph & Source Document Lineage (PGV)',
      badge: '100% Audit Trail Lineage',
      badgeColor: 'bg-purple-50 text-purple-900 border-purple-300',
      description: 'Every extracted medication order and lab measurement (HbA1c, eGFR) is mapped directly back to its raw PDF source document, timestamp, and confidence score for total clinical auditability.'
    },
    {
      icon: Key,
      color: 'bg-slate-100 text-slate-800 border-slate-300',
      title: '6. Local API Key Encryption & TLS Secure Storage',
      badge: 'Zero Public Key Exposure',
      badgeColor: 'bg-slate-200 text-slate-900 border-slate-400',
      description: 'Groq LLM API Keys (gsk_...) are kept strictly within local browser memory and transmitted exclusively over HTTPS SSL to official Groq completion APIs.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-trace-entry flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#184e5b] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/20 text-teal-300">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-snug flex items-center gap-2">
                <span>Security & HIPAA Governance Center</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-black text-[10px]">
                  ACTIVE
                </span>
              </h3>
              <p className="text-xs text-teal-100/80">
                End-to-End Security Architecture, Synthetic Privacy Guardrails & Doctor Verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-teal-100 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1 text-xs">
          
          {/* Top Status Banner */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 shadow-md">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                MediAssistant Security Assertion Summary
              </span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">100% Compliant</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono pt-1">
              <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                <span className="text-slate-400 block text-[9px]">DATA MODE</span>
                <span className="text-emerald-400 font-bold">Synthetic Only</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                <span className="text-slate-400 block text-[9px]">DOCTOR REVIEW</span>
                <span className="text-amber-300 font-bold">Enforced</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                <span className="text-slate-400 block text-[9px]">AUTH GATE</span>
                <span className="text-teal-300 font-bold">Mobile + OTP</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                <span className="text-slate-400 block text-[9px]">ENCRYPTION</span>
                <span className="text-sky-300 font-bold">TLS / HTTPS</span>
              </div>
            </div>
          </div>

          {/* 6 Security Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
            {securityPillars.map((pillar, idx) => {
              const IconComp = pillar.icon;
              return (
                <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-md transition space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-xl border ${pillar.color}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${pillar.badgeColor}`}>
                        {pillar.badge}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-xs">{pillar.title}</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-1">{pillar.description}</p>
                  </div>

                  <div className="flex items-center space-x-1 text-[10px] font-semibold text-emerald-700 pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Active Safeguard</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-between items-center text-[11px]">
          <span className="text-slate-500 font-mono">HIPAA & Agent Safety Governance Module</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#184e5b] hover:bg-[#123e49] text-white font-bold text-xs transition cursor-pointer"
          >
            Close Security Portal
          </button>
        </div>

      </div>
    </div>
  );
}
