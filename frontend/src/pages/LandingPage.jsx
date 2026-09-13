import React, { useState } from 'react';
import { Activity, Phone, UserCheck, Stethoscope, ShieldCheck, CheckCircle2, ArrowRight, HeartPulse, Clock, Award, Users, Mail, Send, ChevronRight, GitBranch, Cpu, FileCheck, Lock, Sparkles, RefreshCw, Layers, Zap, UserPlus, FileText } from 'lucide-react';
import AuthModal from '../components/AuthModal';
import AddPatientModal from '../components/AddPatientModal';

export default function LandingPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [authRole, setAuthRole] = useState('patient');
  const [activeTab, setActiveTab] = useState('home');

  const openAuth = (role) => {
    setAuthRole(role);
    setIsAuthOpen(true);
  };

  const scrollToSection = (id) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] text-slate-900 font-sans flex flex-col">
      
      {/* 1. TOP HEADER NAVBAR */}
      <header className="bg-[#184e5b] text-white sticky top-0 z-40 px-6 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => scrollToSection('home')}>
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center font-bold text-white shadow-sm">
              <Activity className="w-5 h-5 text-teal-300" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              MediAssistant <span className="text-teal-300 font-light text-base">v2.0</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold text-teal-100/90">
            <button
              onClick={() => scrollToSection('home')}
              className={`hover:text-white transition relative py-1 cursor-pointer ${activeTab === 'home' ? 'text-white font-bold border-b-2 border-teal-300' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('motive')}
              className={`hover:text-white transition relative py-1 cursor-pointer ${activeTab === 'motive' ? 'text-white font-bold border-b-2 border-teal-300' : ''}`}
            >
              Project Motive
            </button>
            <button
              onClick={() => scrollToSection('capabilities')}
              className={`hover:text-white transition relative py-1 cursor-pointer ${activeTab === 'capabilities' ? 'text-white font-bold border-b-2 border-teal-300' : ''}`}
            >
              Architecture & Capabilities
            </button>
            <button
              onClick={() => scrollToSection('security')}
              className={`hover:text-white transition relative py-1 cursor-pointer ${activeTab === 'security' ? 'text-white font-bold border-b-2 border-teal-300' : ''}`}
            >
              Security & Contact
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsAddPatientOpen(true)}
              className="hidden lg:inline-flex items-center px-3.5 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-extrabold text-xs shadow-sm transition cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 mr-1.5 text-slate-950" />
              Register Patient (PDF)
            </button>

            <button
              onClick={() => openAuth('patient')}
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#184e5b] font-bold text-xs shadow-xs transition cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 mr-1.5 text-teal-700" />
              Patient Login
            </button>

            <button
              onClick={() => openAuth('doctor')}
              className="px-4 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 border border-teal-400/40 font-bold text-xs transition cursor-pointer"
            >
              <Stethoscope className="w-3.5 h-3.5 mr-1.5 text-teal-300" />
              Doctor / Staff Portal
            </button>

            <a
              href="tel:9840635391"
              className="hidden xl:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Emergency Support</span>
            </a>
          </div>

        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section id="home" className="bg-gradient-to-b from-[#e6ecf0] to-[#f4f7f9] py-16 px-6 border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Content Left */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 text-[#184e5b] text-xs font-bold border border-teal-300/60">
              <Sparkles className="w-4 h-4 text-teal-700" />
              <span>Agentic Clinical Documentation & Follow-up Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight">
              Investigating Clinical <br />
              <span className="text-[#184e5b]">Fragmented Records</span>
            </h1>

            <p className="text-slate-600 text-base leading-relaxed">
              MediAssistant autonomously investigates fragmented patient data, detects and prioritizes clinical uncertainty, traces evidence provenance, generates verification workflows, and produces validated drafts that <strong>always remain under human clinician review</strong>.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => setIsAddPatientOpen(true)}
                className="px-5 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-sm shadow-md flex items-center space-x-2 transition cursor-pointer"
              >
                <UserPlus className="w-4.5 h-4.5 text-teal-200" />
                <span>Register Patient & PDF Ingestion</span>
              </button>

              <button
                onClick={() => openAuth('doctor')}
                className="px-5 py-3.5 rounded-2xl bg-[#184e5b] hover:bg-[#123e49] text-white font-bold text-sm shadow-md flex items-center space-x-2 transition cursor-pointer"
              >
                <Stethoscope className="w-4 h-4 text-teal-300" />
                <span>Doctor Command Center</span>
                <ChevronRight className="w-4 h-4 text-teal-300" />
              </button>

              <button
                onClick={() => openAuth('patient')}
                className="px-5 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm shadow-md flex items-center space-x-2 transition cursor-pointer"
              >
                <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
                <span>1-Click Demo Passway</span>
              </button>
            </div>

            {/* Hero Stat Boxes tailored to MediAssistant Architecture */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs text-center space-y-1">
                <div className="p-2 w-8 h-8 rounded-xl bg-teal-100 text-teal-700 mx-auto flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <div className="font-black text-xl text-slate-900">81 / 100</div>
                <div className="text-[10px] text-slate-500 font-semibold uppercase">Grade A Clinical Score</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs text-center space-y-1">
                <div className="p-2 w-8 h-8 rounded-xl bg-rose-100 text-rose-700 mx-auto flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="font-black text-xl text-slate-900">3 Signals</div>
                <div className="text-[10px] text-slate-500 font-semibold uppercase">Discrepancies Flagged</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs text-center space-y-1">
                <div className="p-2 w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="font-black text-xl text-slate-900">100%</div>
                <div className="text-[10px] text-slate-500 font-semibold uppercase">Doctor In-The-Loop</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs text-center space-y-1">
                <div className="p-2 w-8 h-8 rounded-xl bg-purple-100 text-purple-700 mx-auto flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="font-black text-xl text-slate-900">184ms</div>
                <div className="text-[10px] text-slate-500 font-semibold uppercase">Trace Latency</div>
              </div>
            </div>

          </div>

          {/* Hero Image Right: Clinical AI Dashboard Graphic */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80"
                alt="Clinical AI Data Graph Monitoring"
                className="w-full h-[420px] object-cover opacity-90 hover:opacity-100 transition duration-500"
              />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-950/85 backdrop-blur-md text-white border border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <span className="w-3 h-3 rounded-full bg-teal-400 animate-ping"></span>
                  <div>
                    <div className="font-bold text-white">Clinical Truth Graph Active</div>
                    <div className="text-[10px] text-teal-300">CAUT Score: 0.4(wf) + 0.3(acc) + 0.3(saf)</div>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddPatientOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-teal-400 text-slate-950 font-extrabold text-[11px] hover:bg-teal-300 transition cursor-pointer"
                >
                  + Add New Patient PDF
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. PROJECT MOTIVE & ARCHITECTURE */}
      <section id="motive" className="bg-[#1e293b] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Visual Left */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-700 bg-slate-900 p-6 space-y-4">
              <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <GitBranch className="w-5 h-5 text-teal-400" />
                  <span className="font-bold text-white">Agentic Pipeline Flow</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono text-[10px]">Pure Loop</span>
              </div>

              <div className="space-y-2 font-mono text-xs text-slate-300">
                <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between">
                  <span>1. PDF Extraction</span>
                  <span className="text-teal-400">Groq AI Ingestion</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between">
                  <span>2. CAUT Triangulation</span>
                  <span className="text-amber-400">Score 84/100</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between">
                  <span>3. PGV Evidence Mapping</span>
                  <span className="text-sky-400">Provenance Proven</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between">
                  <span>4. SVWG Checklist</span>
                  <span className="text-emerald-400">Verification Draft</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#184e5b] text-white border border-teal-500/40 flex items-center justify-between font-bold">
                  <span>5. Clinician Review</span>
                  <span className="text-teal-300">Human Signed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Motive Content Right */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold">
              <HeartPulse className="w-4 h-4" />
              <span>Project Core Purpose</span>
            </div>

            <h2 className="text-3xl font-black tracking-tight text-white">
              Why We Built MediAssistant: Eliminating Clinical Uncertainty
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed">
              Medical records in modern healthcare are severely fragmented across independent labs, pharmacy systems, and clinical notes. When doctors consult a patient, missing lab values or medication discrepancies often go undetected until a safety incident happens.
            </p>

            <p className="text-slate-300 text-sm leading-relaxed">
              <strong>MediAssistant solves this problem</strong> by constructing an in-memory <em>Clinical Truth Graph</em>. Our AI agents continuously sense new evidence, quantify uncertainty using the <em>CAUT formula</em>, map line-by-line provenance in the <em>PGV Map</em>, and generate an actionable <em>SVWG Verification Checklist</em>—guaranteeing that final clinical decisions remain strictly under human doctor governance.
            </p>

            {/* Registration CTA Card */}
            <div className="p-5 rounded-2xl bg-teal-900/40 border border-teal-500/40 flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-bold text-white text-sm">Have a new patient PDF lab record?</div>
                <div className="text-xs text-teal-200">Register patient details and let Groq AI parse & populate the workspace.</div>
              </div>
              <button
                onClick={() => setIsAddPatientOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-teal-400 text-slate-950 font-extrabold text-xs hover:bg-teal-300 transition flex-shrink-0 cursor-pointer"
              >
                + Register Patient
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 4. PLATFORM CAPABILITIES & INNOVATIONS */}
      <section id="capabilities" className="bg-slate-900 text-white py-20 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl font-black tracking-tight text-white">Platform Core Innovations</h2>
            <p className="text-slate-400 text-sm">
              The 5 core architectural breakthroughs powering MediAssistant's agentic decision support engine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-white text-slate-900 shadow-md hover:shadow-xl transition space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                <GitBranch className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Clinical Truth Graph</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                In-memory mutable patient graph memory holding node metadata, evidence relations, and automated diff detection across updates.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-white text-slate-900 shadow-md hover:shadow-xl transition space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">CAUT Triangulation Engine</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Context-Aware Uncertainty Triangulation mathematical formula quantifying risk: <code className="bg-slate-100 text-slate-800 px-1 rounded font-mono text-[11px]">(0.4×wf) + (0.3×acc) + (0.3×saf)</code>.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-white text-slate-900 shadow-md hover:shadow-xl transition space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">PGV Provenance Map</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Provenance-Gap Visualization rendering interactive node-link graphs connecting raw lab values to inferred clinical diagnoses.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-white text-slate-900 shadow-md hover:shadow-xl transition space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">SVWG Verification Generator</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Synthetic Verification Workflow Generator producing deterministic rule-based checklists for clinical action before sign-off.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-6 rounded-2xl bg-white text-slate-900 shadow-md hover:shadow-xl transition space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Adaptive Evidence Loop</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Real-time environment change invalidation (`[ Simulate New Data ]`) replanning whenever new labs or PDFs are ingested.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-6 rounded-2xl bg-white text-slate-900 shadow-md hover:shadow-xl transition space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Code-Level Safety Assertions</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enforces strict code assertions: <code className="bg-slate-100 text-rose-900 px-1 rounded font-mono text-[10px]">synthetic_only: true</code> and <code className="bg-slate-100 text-rose-900 px-1 rounded font-mono text-[10px]">human_review_required: true</code>.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. SECURITY & CONTACT SECTION */}
      <section id="security" className="bg-[#e6ecf0] py-20 px-6 border-t border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Patient Security & Support</h2>
            <p className="text-slate-600 text-sm">
              Patient clinical records are protected behind end-to-end encrypted Mobile + OTP verification.
            </p>
            <p className="text-xs text-slate-700 font-semibold pt-2">
              For support or emergency inquiries, call us at <strong className="text-rose-700">+91 98406 35391</strong>.<br />
              Or email us at <strong className="text-[#184e5b]">support@mediassistant.clinical</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Security Info */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center space-x-4">
                <div className="p-3.5 rounded-xl bg-teal-100 text-teal-700">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">Mobile + OTP Security</div>
                  <div className="text-xs text-slate-500">Authorized Patient & Doctor Access Only</div>
                  <div className="text-xs font-bold text-teal-700 mt-0.5">Encrypted Authorization Gate</div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center space-x-4">
                <div className="p-3.5 rounded-xl bg-rose-100 text-rose-600">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">Emergency Support Line</div>
                  <div className="text-xs text-slate-500">24/7 Clinical Desk</div>
                  <div className="text-xs font-bold text-rose-600 mt-0.5">+91 98406 35391</div>
                </div>
              </div>
            </div>

            {/* Right Contact Message Form */}
            <div className="lg:col-span-7 p-8 rounded-3xl bg-white border border-slate-200 shadow-lg space-y-5">
              <h3 className="font-bold text-xl text-slate-900">Send Support Message</h3>
              
              <form className="space-y-4 text-xs font-sans" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#184e5b] text-xs outline-none bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#184e5b] text-xs outline-none bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Message *</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your inquiry or support request..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#184e5b] text-xs outline-none bg-slate-50"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#184e5b] hover:bg-[#123e49] text-white font-bold text-xs flex items-center space-x-2 transition shadow-md cursor-pointer"
                >
                  <Send className="w-4 h-4 text-teal-300" />
                  <span>Send Support Request</span>
                </button>
              </form>
            </div>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-8 px-6 text-xs text-center border-t border-slate-800 space-y-2">
        <p>© 2026 MediAssistant — Agentic Clinical Documentation Platform. Synthetic Data Only.</p>
        <p className="text-[11px] text-slate-500">Enforcing strict human-in-the-loop clinician review and mobile OTP authorization.</p>
      </footer>

      {/* AUTH MODAL FOR PATIENT / DOCTOR MOBILE+OTP VERIFICATION */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultRole={authRole}
      />

      {/* ADD PATIENT MODAL FOR REGISTERING NEW PATIENT & PDF INGESTION */}
      <AddPatientModal
        isOpen={isAddPatientOpen}
        onClose={() => setIsAddPatientOpen(false)}
      />

    </div>
  );
}
