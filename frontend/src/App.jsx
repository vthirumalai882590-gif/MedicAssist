import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DatabaseModal from './components/DatabaseModal';
import SettingsModal from './components/SettingsModal';
import ClinicalOverviewModal from './components/ClinicalOverviewModal';
import AICopilotPanel from './components/AICopilotPanel';
import SecurityModal from './components/SecurityModal';
import Dashboard from './pages/Dashboard';
import PatientState from './pages/PatientState';
import LongitudinalHistory from './pages/LongitudinalHistory';
import Provenance from './pages/Provenance';
import Verification from './pages/Verification';
import Evaluation from './pages/Evaluation';
import LandingPage from './pages/LandingPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RunProvider, useRunContext } from './context/RunContext';
import { AlertCircle, X, Sparkles } from 'lucide-react';

function ErrorBanner() {
  const { error, dismissError } = useRunContext();
  if (!error) return null;

  return (
    <div className="max-w-[1600px] mx-auto px-6 pt-4">
      <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-between shadow-xs font-mono text-xs">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span className="font-semibold">{error}</span>
        </div>
        <button
          onClick={dismissError}
          className="p-1 rounded-lg hover:bg-rose-100 text-rose-600 transition"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function MainAppContent() {
  const { isAuthenticated } = useAuth();
  const { isCopilotOpen, openCopilotWithPrompt, closeCopilot } = useRunContext();
  const [isDatabaseOpen, setIsDatabaseOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);

  // If user is not authenticated via Mobile + OTP, render the Public Landing / Design Page
  if (!isAuthenticated) {
    return <LandingPage />;
  }

  // Once authenticated via Mobile + OTP, enter the internal MediAssistant Workspace
  return (
    <div className="min-h-screen bg-[#f4f7f9] text-slate-900 flex font-sans overflow-x-hidden relative">
      {/* Left Vertical Navigation Rail */}
      <Sidebar
        onOpenDatabase={() => setIsDatabaseOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSecurity={() => setIsSecurityOpen(true)}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 pl-16">
        <Navbar
          onOpenClinicalOverview={() => setIsOverviewOpen(true)}
          onOpenCopilot={() => openCopilotWithPrompt('')}
        />
        <ErrorBanner />
        <main className="flex-1 pt-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patient" element={<PatientState />} />
            <Route path="/history" element={<LongitudinalHistory />} />
            <Route path="/provenance" element={<Provenance />} />
            <Route path="/verification" element={<Verification />} />
            <Route path="/evaluation" element={<Evaluation />} />
          </Routes>
        </main>
      </div>

      {/* Floating Bottom-Right AI Co-Pilot Launch Button */}
      {!isCopilotOpen && (
        <button
          onClick={() => openCopilotWithPrompt('')}
          className="fixed bottom-6 right-6 z-40 px-5 py-3.5 rounded-2xl bg-[#184e5b] hover:bg-[#123e49] text-white font-extrabold text-xs shadow-2xl flex items-center space-x-2 border-2 border-teal-300/60 transition active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-teal-300 animate-pulse" />
          <span>AI Clinical Co-Pilot</span>
        </button>
      )}

      {/* Interactive Modals & Drawers */}
      <SecurityModal
        isOpen={isSecurityOpen}
        onClose={() => setIsSecurityOpen(false)}
      />
      <DatabaseModal
        isOpen={isDatabaseOpen}
        onClose={() => setIsDatabaseOpen(false)}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <ClinicalOverviewModal
        isOpen={isOverviewOpen}
        onClose={() => setIsOverviewOpen(false)}
      />
      <AICopilotPanel
        isOpen={isCopilotOpen}
        onClose={closeCopilot}
      />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <RunProvider>
          <MainAppContent />
        </RunProvider>
      </AuthProvider>
    </Router>
  );
}
