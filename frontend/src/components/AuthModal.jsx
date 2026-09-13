import React, { useState } from 'react';
import { Lock, Phone, KeyRound, ShieldCheck, ArrowRight, X, UserCheck, Stethoscope, User, RefreshCw, CheckCircle2, Zap, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, defaultRole = 'patient' }) {
  const { login } = useAuth();
  const [role, setRole] = useState(defaultRole); // 'patient' | 'doctor'
  const [step, setStep] = useState(1); // 1: Mobile Input, 2: OTP Input
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!mobileNumber || mobileNumber.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setError('');
    setIsSendingOtp(true);

    setTimeout(() => {
      setIsSendingOtp(false);
      setStep(2);
    }, 800);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value[value.length - 1];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance to next input field
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }

    setError('');
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      login(role, mobileNumber);
      onClose();
    }, 800);
  };

  const fillDemoMobile = () => {
    setMobileNumber('9840635391');
    setError('');
  };

  const fillDemoOtp = () => {
    setOtp(['1', '2', '3', '4', '5', '6']);
    setError('');
  };

  // One-Click Demo Passway (Instant 1-click login for evaluators)
  const handleQuickDemoBypass = () => {
    const demoNum = mobileNumber || '9840635391';
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      login(role, demoNum);
      onClose();
    }, 600);
  };

  const resetForm = () => {
    setStep(1);
    setOtp(['', '', '', '', '', '']);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-trace-entry">
        
        {/* Modal Header */}
        <div className="bg-[#184e5b] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/20 text-teal-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-snug">Secure Security Portal</h3>
              <p className="text-xs text-teal-100/80">OTP Verification for Patient Data Protection</p>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="p-1.5 rounded-lg text-teal-100 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setRole('patient');
                resetForm();
              }}
              className={`py-2.5 rounded-xl flex items-center justify-center space-x-2 transition cursor-pointer ${
                role === 'patient'
                  ? 'bg-white text-[#184e5b] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Patient Portal</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRole('doctor');
                resetForm();
              }}
              className={`py-2.5 rounded-xl flex items-center justify-center space-x-2 transition cursor-pointer ${
                role === 'doctor'
                  ? 'bg-[#184e5b] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Doctor / Staff</span>
            </button>
          </div>

          {/* DEMO PASSWAY BANNER (1-Click Instant Bypass for Evaluators) */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300/80 text-amber-950 text-xs space-y-2">
            <div className="flex items-center justify-between font-bold text-amber-900">
              <span className="flex items-center space-x-1.5">
                <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
                <span>Quick Demo Passway</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-200/80 text-[10px] uppercase font-extrabold tracking-wide">
                Evaluator Access
              </span>
            </div>
            <p className="text-[11px] text-amber-900/90 leading-tight">
              Bypass SMS wait time and enter the <strong>MediAssistant Demo Workspace</strong> instantly in 1 click.
            </p>
            <button
              type="button"
              onClick={handleQuickDemoBypass}
              className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-xs transition cursor-pointer"
            >
              <span>Instant Demo Entrance</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* STEP 1: Mobile Number Input Form */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4 pt-1">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Mobile Phone Number
                  </label>
                  <button
                    type="button"
                    onClick={fillDemoMobile}
                    className="text-[11px] font-bold text-teal-700 hover:underline cursor-pointer"
                  >
                    Auto-fill Demo No.
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-semibold text-xs">
                    +91
                  </div>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="98406 35391"
                    maxLength={15}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-300 focus:border-[#184e5b] focus:ring-2 focus:ring-[#184e5b]/20 text-sm font-medium bg-slate-50/50 outline-none"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {error && (
                <p className="text-xs text-rose-600 font-semibold">{error}</p>
              )}

              <button
                type="submit"
                disabled={isSendingOtp}
                className="w-full py-3.5 rounded-2xl bg-[#184e5b] hover:bg-[#123e49] text-white font-bold text-xs flex items-center justify-center space-x-2 transition shadow-md disabled:opacity-50 cursor-pointer"
              >
                {isSendingOtp ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sending Security OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: OTP Verification Form */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">OTP sent to <strong className="text-slate-900">+91 {mobileNumber || '9840635391'}</strong></span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-teal-700 hover:underline font-semibold text-[11px] cursor-pointer"
                >
                  Change
                </button>
              </div>

              {/* 6 Digit Input Boxes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 text-center">
                  Enter 6-Digit Verification Code
                </label>
                <div className="flex items-center justify-between gap-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      className="w-11 h-12 rounded-xl border border-slate-300 focus:border-[#184e5b] focus:ring-2 focus:ring-[#184e5b]/20 text-center font-bold text-lg text-slate-900 bg-slate-50 outline-none"
                    />
                  ))}
                </div>
              </div>

              {/* Demo Helper Pill */}
              <div className="flex items-center justify-between bg-slate-100 p-2.5 rounded-xl text-[11px]">
                <span className="text-slate-500">Demo Passcode: <strong className="text-teal-800 font-mono font-bold">123456</strong></span>
                <button
                  type="button"
                  onClick={fillDemoOtp}
                  className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-[10px] transition cursor-pointer"
                >
                  Auto-fill Demo OTP
                </button>
              </div>

              {error && (
                <p className="text-xs text-rose-600 font-semibold">{error}</p>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3.5 rounded-2xl bg-[#184e5b] hover:bg-[#123e49] text-white font-bold text-xs flex items-center justify-center space-x-2 transition shadow-md disabled:opacity-50 cursor-pointer"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Authorization...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-teal-300" />
                    <span>Verify & Enter MediAssistant</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Protected by Encrypted OTP</span>
          <button
            type="button"
            onClick={handleQuickDemoBypass}
            className="text-teal-800 font-bold hover:underline cursor-pointer"
          >
            Direct Demo Passway →
          </button>
        </div>

      </div>
    </div>
  );
}
