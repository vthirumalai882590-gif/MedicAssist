import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, FileText, GitPullRequest, ShieldCheck, Award, Settings, Database, Activity, Calendar } from 'lucide-react';

export default function Sidebar({ onOpenDatabase, onOpenSettings, onOpenSecurity }) {
  const navItems = [
    { to: '/', label: 'Dashboard Command Center', icon: LayoutGrid },
    { to: '/patient', label: 'Patient State', icon: FileText },
    { to: '/history', label: 'Longitudinal History (2024-2026)', icon: Calendar },
    { to: '/provenance', label: 'Provenance Map (PGV)', icon: GitPullRequest },
    { to: '/verification', label: 'Verification Workflow (SVWG)', icon: ShieldCheck },
    { to: '/evaluation', label: 'Evaluation Metrics', icon: Award }
  ];

  return (
    <aside className="fixed inset-y-0 left-0 w-16 hover:w-64 bg-white border-r border-slate-200 flex flex-col justify-between py-4 h-screen z-50 flex-shrink-0 transition-all duration-300 ease-in-out group shadow-xs hover:shadow-2xl overflow-hidden px-3">
      {/* Top Logo / App Branding */}
      <div className="flex flex-col w-full">
        <div className="flex items-center space-x-3 px-0.5">
          <div className="w-10 h-10 rounded-xl bg-[#184e5b] text-white flex items-center justify-center font-black text-xl shadow-md flex-shrink-0 cursor-pointer hover:bg-[#123e49] transition">
            <Activity className="w-5 h-5 text-teal-300" />
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden">
            <span className="font-extrabold text-slate-900 text-sm block tracking-tight">MediAssistant</span>
            <span className="text-[10px] text-teal-700 font-semibold block">Clinical Ops Platform</span>
          </div>
        </div>

        <div className="w-full border-b border-slate-200 my-3"></div>

        {/* Navigation Rail Buttons */}
        <nav className="flex flex-col space-y-2 w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                title={item.label}
                className={({ isActive }) =>
                  `w-full h-10 rounded-xl flex items-center px-2.5 transition relative ${
                    isActive
                      ? 'bg-[#184e5b] text-white shadow-md'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="ml-3 font-semibold text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden">
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Utility Icons */}
      <div className="flex flex-col space-y-2 w-full pt-3 border-t border-slate-200">
        {/* Security & HIPAA Governance */}
        <button
          onClick={onOpenSecurity}
          title="Security & HIPAA Governance Center"
          className="w-full h-10 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 flex items-center px-2.5 transition cursor-pointer"
        >
          <ShieldCheck className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          <span className="ml-3 font-semibold text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden">
            Security & HIPAA Portal
          </span>
        </button>

        {/* Database Icon: PDF/CSV Patient Data Ingestion */}
        <button
          onClick={onOpenDatabase}
          title="Patient Data Ingestion & Extractor"
          className="w-full h-10 rounded-xl text-slate-500 hover:text-teal-700 hover:bg-teal-50 flex items-center px-2.5 transition cursor-pointer"
        >
          <Database className="w-5 h-5 flex-shrink-0" />
          <span className="ml-3 font-semibold text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden">
            Patient Data & Extractor
          </span>
        </button>

        {/* Settings Icon: Groq API Key & Config */}
        <button
          onClick={onOpenSettings}
          title="Settings & Groq API Key"
          className="w-full h-10 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 flex items-center px-2.5 transition cursor-pointer"
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          <span className="ml-3 font-semibold text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden">
            Settings & Groq Key
          </span>
        </button>
      </div>
    </aside>
  );
}
