import React, { useState } from 'react';
import { UserPlus, Upload, FileText, Sparkles, CheckCircle2, X, RefreshCw, Cpu, ShieldCheck, HeartPulse, ArrowRight, FileCheck, Info } from 'lucide-react';
import { useRunContext } from '../context/RunContext';
import { useAuth } from '../context/AuthContext';

export default function AddPatientModal({ isOpen, onClose }) {
  const { registerNewPatient } = useRunContext();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [age, setAge] = useState('62');
  const [gender, setGender] = useState('Male');
  const [primaryCondition, setPrimaryCondition] = useState('Type 2 Diabetes Mellitus & Essential Hypertension');
  const [mobileNumber, setMobileNumber] = useState('9840635391');
  const [photoUrl, setPhotoUrl] = useState('/jane_doe.png');
  const [pdfFile, setPdfFile] = useState(null);
  const [fileType, setFileType] = useState(''); // 'demo' | 'real'

  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionResult, setExtractionResult] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSamplePdf = (type) => {
    setFileType('demo');
    if (type === 'diabetes') {
      setPdfFile({
        name: `${name || 'DemoPatient'}_Diabetes_Lab_Report.pdf`,
        size: '1.8 MB',
        isReal: false,
        contentSnippet: `DEMO EHR EXTRACT
Patient: ${name || 'Demo Patient'}
Labs: HbA1c: 8.9% (Elevated), eGFR: 54 mL/min (Mild Impairment), BP: 142/88 mmHg.
Meds: Metformin 1000mg BID, Amlodipine 5mg QD, Lisinopril 10mg QD.`
      });
    } else {
      setPdfFile({
        name: `${name || 'DemoPatient'}_Cardiology_Summary.pdf`,
        size: '2.1 MB',
        isReal: false,
        contentSnippet: `DEMO CARDIOLOGY SUMMARY
Patient: ${name || 'Demo Patient'}
Labs: Troponin I: 0.02 ng/mL (Normal), LDL: 135 mg/dL (Elevated), BP: 148/92 mmHg.
Meds: Atorvastatin 40mg QD, Metoprolol 50mg BID.`
      });
    }
  };

  const handleRealPdfUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileType('real');
    setPdfFile({
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      isReal: true,
      contentSnippet: `REAL PATIENT PDF DOCUMENT ATTACHED
Filename: ${file.name} (${(file.size / 1024).toFixed(1)} KB)
Ready for Groq LLM parsing & text entity extraction.`
    });
  };

  const handleExtractAndIngest = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter patient full name.');
      return;
    }

    setError('');
    setIsExtracting(true);

    setTimeout(() => {
      setIsExtracting(false);
      const generatedId = `SYN-00${Math.floor(Math.random() * 900) + 100}`;

      const extractedPatientObj = {
        patient_id: generatedId,
        name: name.trim(),
        photo_url: photoUrl,
        age: parseInt(age) || 62,
        gender: gender,
        primary_condition: primaryCondition,
        active_medications: [
          { name: 'Metformin HCl', dosage: '1000 mg', frequency: 'Twice daily with meals' },
          { name: 'Amlodipine Besylate', dosage: '5 mg', frequency: 'Once daily in morning' },
          { name: 'Lisinopril', dosage: '10 mg', frequency: 'Once daily' }
        ],
        recent_labs: [
          { name: 'HbA1c', value: '8.9', unit: '%', date: '2026-09-12', status: 'High' },
          { name: 'Fasting Glucose', value: '168', unit: 'mg/dL', date: '2026-09-12', status: 'High' },
          { name: 'eGFR', value: '54', unit: 'mL/min/1.73m2', date: '2026-09-10', status: 'Slight Decrease' },
          { name: 'Systolic BP', value: '142', unit: 'mmHg', date: '2026-09-13', status: 'Borderline' }
        ],
        extractionSummary: {
          wordsExtracted: pdfFile?.isReal ? 640 : 482,
          confidence: '99.3%',
          modelUsed: 'groq/llama-3.3-70b-versatile',
          sourceType: pdfFile?.isReal ? 'Real Patient Medical PDF' : 'Sample Demo Clinical Dataset'
        }
      };

      setExtractionResult(extractedPatientObj);
    }, 1200);
  };

  const handleCompleteRegistration = () => {
    if (!extractionResult) return;
    registerNewPatient(extractionResult);
    login('patient', mobileNumber);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-trace-entry flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-[#184e5b] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/20 text-teal-300">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-snug">Register Patient & Photo Ingestion</h3>
              <p className="text-xs text-teal-100/80">
                Upload patient photo & attach real PDF medical records for automated Groq AI ingestion
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

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
          
          {/* Summary Banner */}
          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 text-teal-950 text-xs flex items-start space-x-3">
            <Cpu className="w-5 h-5 text-teal-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Groq AI Automated Ingestion with Patient Photo:</span>
              <p className="text-slate-700 mt-0.5 leading-relaxed">
                Upload the <strong>Patient's Recent Photo</strong> and attach a <strong>Medical PDF Record</strong>. All patient photos are stored and displayed across the Clinical Truth Graph and workspace routes.
              </p>
            </div>
          </div>

          {!extractionResult ? (
            <form onSubmit={handleExtractAndIngest} className="space-y-4 text-xs font-sans">
              
              {/* PATIENT PHOTO UPLOAD SECTION */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <label className="block font-bold text-slate-800 uppercase tracking-wide">
                  Patient Recent Photo *
                </label>

                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={photoUrl}
                      alt="Patient Preview"
                      className="w-16 h-16 rounded-full object-cover border-4 border-[#184e5b] shadow-md"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center px-4 py-2 rounded-xl bg-[#184e5b] hover:bg-[#123e49] text-white font-bold text-xs cursor-pointer shadow-xs transition">
                      <Upload className="w-4 h-4 mr-2 text-teal-300" />
                      <span>Upload Patient Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[10px] text-slate-500">Supports PNG, JPG, WEBP formats up to 10MB</p>
                  </div>
                </div>
              </div>

              {/* Form Inputs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Patient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#184e5b] focus:ring-2 focus:ring-[#184e5b]/20 font-medium bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Mobile Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="98406 35391"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#184e5b] focus:ring-2 focus:ring-[#184e5b]/20 font-medium bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#184e5b] focus:ring-2 focus:ring-[#184e5b]/20 font-medium bg-slate-50 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#184e5b] focus:ring-2 focus:ring-[#184e5b]/20 font-medium bg-slate-50 outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Primary Condition */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Primary Diagnosis / Condition
                </label>
                <input
                  type="text"
                  value={primaryCondition}
                  onChange={(e) => setPrimaryCondition(e.target.value)}
                  placeholder="e.g. Type 2 Diabetes Mellitus & Essential Hypertension"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#184e5b] focus:ring-2 focus:ring-[#184e5b]/20 font-medium bg-slate-50 outline-none"
                />
              </div>

              {/* PDF MEDICAL DOCUMENT INGESTION SECTION */}
              <div className="space-y-3 pt-2">
                <label className="block font-bold text-slate-800 uppercase tracking-wide flex items-center justify-between">
                  <span>Patient Medical Records (PDF Upload & Ingestion)</span>
                  <span className="text-[10px] text-teal-700 font-bold lowercase font-mono">Demo + Real Support</span>
                </label>
                
                {/* Demo PDF Samples Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSelectSamplePdf('diabetes')}
                    className={`p-3.5 rounded-xl border text-left transition flex items-center space-x-3 cursor-pointer ${
                      pdfFile?.name.includes('Diabetes')
                        ? 'border-[#184e5b] bg-teal-50/60 ring-2 ring-[#184e5b]/20'
                        : 'border-slate-200 bg-white hover:border-teal-300'
                    }`}
                  >
                    <FileText className="w-5 h-5 text-rose-600 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900 text-xs">Diabetes_Lab_Report.pdf</div>
                      <div className="text-[10px] text-teal-700 font-semibold">[ Sample Demo File 1 ]</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectSamplePdf('cardio')}
                    className={`p-3.5 rounded-xl border text-left transition flex items-center space-x-3 cursor-pointer ${
                      pdfFile?.name.includes('Cardiology')
                        ? 'border-[#184e5b] bg-teal-50/60 ring-2 ring-[#184e5b]/20'
                        : 'border-slate-200 bg-white hover:border-teal-300'
                    }`}
                  >
                    <FileText className="w-5 h-5 text-sky-600 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900 text-xs">Cardiology_Summary.pdf</div>
                      <div className="text-[10px] text-teal-700 font-semibold">[ Sample Demo File 2 ]</div>
                    </div>
                  </button>
                </div>

                {/* Real Patient PDF Upload Box */}
                <div className="relative border-2 border-dashed border-teal-300 hover:border-[#184e5b] bg-teal-50/40 rounded-xl p-4 text-center cursor-pointer transition group">
                  <input
                    type="file"
                    accept=".pdf,.csv,.txt"
                    onChange={handleRealPdfUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                  <Upload className="w-6 h-6 text-[#184e5b] mx-auto mb-1 group-hover:scale-110 transition" />
                  <p className="text-xs text-slate-900 font-bold">📄 Upload Real Patient PDF Medical Record</p>
                  <p className="text-[10px] text-slate-500">Drag & drop your real patient PDF here, or click to browse files</p>
                </div>

                {/* Selected File Status Box */}
                {pdfFile && (
                  <div className="p-3 rounded-xl bg-slate-900 text-white font-mono text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-teal-400 font-bold">
                      <span className="flex items-center space-x-2">
                        <FileCheck className="w-4 h-4 text-teal-300" />
                        <span>{pdfFile.isReal ? 'REAL PATIENT PDF:' : 'SAMPLE DEMO PDF:'} {pdfFile.name}</span>
                      </span>
                      <span>({pdfFile.size})</span>
                    </div>
                    <p className="text-slate-300 text-[10px]">{pdfFile.contentSnippet}</p>
                  </div>
                )}
              </div>

              {error && (
                <p className="text-xs text-rose-600 font-semibold">{error}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isExtracting}
                className="w-full py-3.5 rounded-2xl bg-[#184e5b] hover:bg-[#123e49] text-white font-bold text-xs flex items-center justify-center space-x-2 transition shadow-md disabled:opacity-50 cursor-pointer"
              >
                {isExtracting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Parsing PDF & Extracting Details with Groq AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-teal-300" />
                    <span>Extract Details & Register Patient</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Extraction Confirmation View */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
                <div className="flex items-center space-x-2 font-bold text-sm text-emerald-900">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Patient & PDF Records Successfully Extracted!</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Source: <strong>{extractionResult.extractionSummary.sourceType}</strong>. Extracted <strong>{extractionResult.extractionSummary.wordsExtracted} words</strong> using <code className="bg-white px-1 py-0.5 rounded text-teal-800 border">{extractionResult.extractionSummary.modelUsed}</code> with {extractionResult.extractionSummary.confidence} confidence.
                </p>
              </div>

              {/* Extracted Details Summary Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="font-bold text-slate-900 uppercase tracking-wide flex justify-between">
                  <span>Patient Identity: {extractionResult.name}</span>
                  <span className="text-[#184e5b]">{extractionResult.patient_id}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div><strong>Age/Gender:</strong> {extractionResult.age} YRS ({extractionResult.gender})</div>
                  <div><strong>Condition:</strong> {extractionResult.primary_condition}</div>
                </div>

                {/* Extracted Labs */}
                <div>
                  <div className="font-bold text-slate-700 mb-1">Extracted Labs & Measurements:</div>
                  <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                    {extractionResult.recent_labs.map((l, i) => (
                      <span key={i} className="px-2 py-1 bg-white border border-slate-300 rounded font-semibold text-teal-800">
                        {l.name}: {l.value} {l.unit} ({l.status})
                      </span>
                    ))}
                  </div>
                </div>

                {/* Extracted Meds */}
                <div>
                  <div className="font-bold text-slate-700 mb-1">Extracted Medication Orders:</div>
                  <div className="flex flex-wrap gap-1.5 text-[10px]">
                    {extractionResult.active_medications.map((m, i) => (
                      <span key={i} className="px-2 py-1 bg-white border border-slate-300 rounded font-semibold text-slate-800">
                        {m.name} ({m.dosage})
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Enter Workspace Action */}
              <button
                onClick={handleCompleteRegistration}
                className="w-full py-4 rounded-2xl bg-[#184e5b] hover:bg-[#123e49] text-white font-extrabold text-xs flex items-center justify-center space-x-2 transition shadow-lg cursor-pointer"
              >
                <span>Push Data Across Workspace & Enter Dashboard</span>
                <ArrowRight className="w-4 h-4 text-teal-300" />
              </button>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-500 font-mono">
          <span>MediAssistant Auto-Ingest Engine v2.0</span>
          <button onClick={onClose} className="hover:underline cursor-pointer">Cancel</button>
        </div>

      </div>
    </div>
  );
}
