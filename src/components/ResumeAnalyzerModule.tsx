import React, { useState } from 'react';
import { UserProfile, UserProgress, ResumeReport } from '../types.js';
import { uploadResume, updateUserProgress } from '../services/api.js';
import { FileText, Upload, CheckCircle, AlertTriangle, RefreshCw, Sparkles, Award, HelpCircle, FileCheck, Info } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResumeAnalyzerProps {
  user: UserProfile;
  progress: UserProgress;
  resumeReport: ResumeReport | null;
  onReportGenerated: (report: ResumeReport) => void;
  onProgressUpdate: (progress: UserProgress) => void;
}

export const ResumeAnalyzerModule: React.FC<ResumeAnalyzerProps> = ({
  user,
  progress,
  resumeReport,
  onReportGenerated,
  onProgressUpdate
}) => {
  const [started, setStarted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a valid PDF or DOCX file.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const res = await uploadResume(file, user.email);
      onReportGenerated(res.report);

      if (res.report.resumeScore >= 70) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }

      // Update progress
      const progRes = await updateUserProgress(user.email, {
        xp: 40
      });
      onProgressUpdate(progRes.progress);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze resume file.');
    } finally {
      setUploading(false);
    }
  };

  // FIRST-TIME CLEAN START WELCOME SCREEN
  if (!started && !resumeReport) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-200/60">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Truthful Resume & ATS Auditor</h1>
            <p className="text-xs text-slate-500 mt-1">
              Upload your actual PDF or DOCX resume for accurate text extraction, CGPA detection, and project-based interview question generation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
          <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl space-y-2">
            <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xs">
              <FileCheck className="w-4 h-4" />
              <span>Actual File Parsing</span>
            </div>
            <p className="text-xs text-slate-600">
              Extracts text directly from your uploaded PDF or DOCX file without depending on manual input.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl space-y-2">
            <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs">
              <CheckCircle className="w-4 h-4" />
              <span>Truthful CGPA Detection</span>
            </div>
            <p className="text-xs text-slate-600">
              Scans your entire resume to accurately detect CGPA (e.g. 8.4/10) and prevents false "missing CGPA" claims.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl space-y-2">
            <div className="flex items-center space-x-2 text-cyan-700 font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Project-Driven Questions</span>
            </div>
            <p className="text-xs text-slate-600">
              Generates technical & HR interview questions derived strictly from your real projects and skills.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end border-t border-slate-200">
          <button
            onClick={() => setStarted(true)}
            className="w-full sm:w-auto bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs px-8 py-3 rounded-xl transition-all shadow-sm uppercase tracking-wider"
          >
            Upload Resume
          </button>
        </div>
      </div>
    );
  }

  const report = resumeReport;

  return (
    <div className="space-y-6">
      
      {/* Upload Box */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>Resume File Upload (PDF / DOCX)</span>
            </h2>
            <p className="text-xs text-slate-500">Select your actual resume file for evidence-based analysis</p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center space-x-2 font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="file"
            accept=".pdf,.docx,.doc"
            onChange={handleFileChange}
            className="w-full text-xs text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-800 hover:file:bg-slate-200 cursor-pointer"
          />

          <button
            onClick={handleUpload}
            disabled={uploading || !file}
            className="w-full sm:w-auto bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shrink-0 flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50 uppercase tracking-wider"
          >
            {uploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            <span>{uploading ? 'Analyzing Resume Text...' : 'Analyze Resume'}</span>
          </button>
        </div>
      </div>

      {/* Analysis Report View */}
      {report && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Resume Scan</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">{report.fileName}</h2>
              <p className="text-xs text-slate-500">Uploaded on {new Date(report.uploadDate).toLocaleDateString()}</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-center min-w-[100px]">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Resume Score</p>
                <p className="text-xl font-black text-indigo-600">{report.resumeScore}/100</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-center min-w-[100px]">
                <p className="text-[10px] text-slate-500 uppercase font-bold">ATS Estimate</p>
                <p className="text-xl font-black text-cyan-600">{report.atsReadiness}%</p>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
            ℹ️ AI-generated resume assessment based strictly on extracted text content.
          </p>

          {/* Extracted Details Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Contact & Education Info */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                <Info className="w-4 h-4 text-indigo-600" />
                <span>Extracted Credentials</span>
              </h3>

              <div className="text-xs text-slate-700 space-y-1.5">
                <div><strong>CGPA / Marks:</strong> {report.detectedCgpa ? <span className="text-emerald-700 font-bold ml-1">{report.detectedCgpa} — Present</span> : <span className="text-amber-700 ml-1">Not explicitly found</span>}</div>
                <div><strong>Name:</strong> {report.detectedName || 'Found in text'}</div>
                <div><strong>Email:</strong> {report.detectedEmail || 'Found in text'}</div>
                <div><strong>Phone:</strong> {report.detectedPhone || 'Found in text'}</div>
              </div>

              {report.detectedEducation && report.detectedEducation.length > 0 && (
                <div className="pt-2 border-t border-slate-200">
                  <p className="text-[11px] font-bold text-slate-500 mb-1">Education History:</p>
                  {report.detectedEducation.map((edu, idx) => (
                    <div key={idx} className="text-xs text-slate-700">
                      • {edu.degree} - {edu.institution} ({edu.score || 'Present'})
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Detected Skills & Tech Stack */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
              <h3 className="text-xs font-bold text-slate-900">Detected Technical Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {report.detectedSkills.map((s, idx) => (
                  <span key={idx} className="bg-white text-indigo-800 px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-200/80 shadow-xs">
                    {s}
                  </span>
                ))}
              </div>

              {report.detectedProjects && report.detectedProjects.length > 0 && (
                <div className="pt-2 border-t border-slate-200 space-y-2">
                  <p className="text-[11px] font-bold text-slate-500">Extracted Projects:</p>
                  {report.detectedProjects.map((p, idx) => (
                    <div key={idx} className="text-xs text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200/80">
                      <strong className="text-cyan-800 font-bold">{p.title}</strong>
                      <p className="text-slate-600 text-[11px] mt-0.5">{p.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Fact-Checked Strengths & Improvement Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-2">
              <h3 className="text-xs font-bold text-emerald-800">Verified Resume Strengths</h3>
              <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                {report.strengths.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-2">
              <h3 className="text-xs font-bold text-amber-800">Areas for Improvement & Missing Items</h3>
              <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                {report.missingInformation.map((m, idx) => (
                  <li key={idx}>{m}</li>
                ))}
                {report.areasForImprovement.map((a, idx) => (
                  <li key={idx}>{a}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Custom Resume-Driven Interview Questions */}
          {report.customInterviewQuestions && report.customInterviewQuestions.length > 0 && (
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-cyan-600" />
                <span>Interview Questions Generated From Your Actual Resume</span>
              </h3>

              <div className="space-y-2">
                {report.customInterviewQuestions.map((q, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1 shadow-xs">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {q.category}
                    </span>
                    <p className="font-bold text-slate-900 mt-1">"{q.question}"</p>
                    {q.context && <p className="text-[11px] text-slate-500 italic">Context: {q.context}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
