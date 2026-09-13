import React from 'react';
import { Activity, Moon, Cloud, LogOut, ShieldCheck, UserCheck, Stethoscope, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRunContext } from '../context/RunContext';

export default function Navbar({ onOpenClinicalOverview, onOpenCopilot }) {
  const { user, logout } = useAuth();
  const { patientDetail } = useRunContext();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-3">
      <div className="flex items-center justify-between">
        
        {/* Left Side: Brand Logo + Track Badges */}
        <div className="flex items-center space-x-3">
          {/* Logo Badge */}
          <div className="w-7 h-7 rounded-lg bg-[#184e5b] text-white flex items-center justify-center font-bold text-sm">
            <Activity className="w-4 h-4 text-teal-300" />
          </div>

          <span className="font-extrabold text-slate-900 text-lg tracking-tight">MediAssistant</span>

          {/* Track 1 Pill Badge */}
          <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300">
            Track 1: Clinical Decision Support
          </span>

          {/* User Auth & Active Patient Photo Badge */}
          {user && (
            <span className="hidden md:inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-900 border border-teal-300">
              {patientDetail?.photo_url ? (
                <img src={patientDetail.photo_url} alt={patientDetail.name} className="w-5 h-5 rounded-full object-cover border border-teal-700" />
              ) : (
                <Stethoscope className="w-3.5 h-3.5 text-teal-700" />
              )}
              <span className="font-bold text-[#184e5b]">{patientDetail?.name || 'Jane Doe'} ({patientDetail?.patient_id || 'SYN-001'})</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            </span>
          )}
        </div>

        {/* Right Side Action Controls */}
        <div className="flex items-center space-x-2 font-sans text-xs">
          
          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-950 border border-teal-300 font-extrabold shadow-2xs transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>AI Co-Pilot</span>
          </button>

          <button
            onClick={onOpenClinicalOverview}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold transition cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5 text-teal-600" />
            Clinical Overview
          </button>

          <div className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 font-semibold flex items-center gap-1.5">
            <Cloud className="w-3.5 h-3.5 text-teal-600" />
            <span>Cloud connected</span>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            title="Log Out & Lock Session"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600" />
            <span>Log Out</span>
          </button>

        </div>

      </div>
    </header>
  );
}
