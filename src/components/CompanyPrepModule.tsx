import React, { useState } from 'react';
import { UserProfile, UserProgress, CompanyPrepData } from '../types.js';
import { TARGET_COMPANIES } from '../data/constants.js';
import { getCompanyPrepData } from '../services/api.js';
import {
  Building2,
  Sparkles,
  RefreshCw,
  Layers,
  HelpCircle,
  Code2,
  Brain,
  Lightbulb
} from 'lucide-react';

interface CompanyPrepProps {
  user: UserProfile;
  progress: UserProgress;
}

export const CompanyPrepModule: React.FC<CompanyPrepProps> = ({ user }) => {
  const [company, setCompany] = useState<string>(
    user.targetCompany || 'TCS'
  );

  const [customCompany, setCustomCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [prepData, setPrepData] = useState<CompanyPrepData | null>(null);

  const activeCompany =
    company === 'Other'
      ? customCompany || 'Target Company'
      : company;

  const fetchCompanyData = async (companyName: string) => {
    setLoading(true);
    setPrepData(null);

    try {
      const data = await getCompanyPrepData(
        companyName,
        user.domain || 'Software Development',
        user.explanationLanguage || 'English'
      );

      console.log('Company Prep Data:', data);

      setPrepData(data);
    } catch (err) {
      console.error('Error fetching company prep data:', err);
      setPrepData(null);
    } finally {
      setLoading(false);
    }
  };

  // Automatically generate when the page opens
  React.useEffect(() => {
    fetchCompanyData(activeCompany);
  }, [user.explanationLanguage, user.domain]);

  return (
    <div className="space-y-6">

      {/* Top Company Selector */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-rose-600" />
              <span>Company-Specific Placement Hub</span>
            </h2>

            <p className="text-xs text-slate-500">
              Tailored recruitment patterns, syllabus, technical questions and interview preparation
            </p>
          </div>

          <button
            onClick={() => fetchCompanyData(activeCompany)}
            disabled={loading}
            className="bg-slate-900 hover:bg-rose-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center space-x-2 shrink-0 disabled:opacity-50 shadow-sm uppercase tracking-wider"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 text-rose-400" />
            )}

            <span>
              {loading ? 'Generating...' : 'Generate Prep Blueprint'}
            </span>
          </button>

        </div>

        {/* Company Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Target Company:
            </label>

            <select
              value={company}
              onChange={(e) => {
                setCompany(e.target.value);
                setPrepData(null);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-rose-500 font-medium"
            >
              {TARGET_COMPANIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {company === 'Other' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Enter Company Name:
              </label>

              <input
                type="text"
                value={customCompany}
                onChange={(e) => setCustomCompany(e.target.value)}
                placeholder="e.g. PayPal, Cisco, Atlassian"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-rose-500 font-medium"
              />
            </div>
          )}

        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-sm">

          <RefreshCw className="w-8 h-8 text-rose-600 animate-spin mx-auto" />

          <p className="text-sm font-bold text-slate-900">
            Generating recruitment preparation for {activeCompany}...
          </p>

          <p className="text-xs text-slate-500">
            Preparing aptitude, technical, coding and HR content.
          </p>

        </div>
      )}

      {/* Results */}
      {!loading && prepData && (
        <div className="space-y-6">

          {/* Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">

            <h2 className="text-xl font-extrabold text-white">
              {prepData.company || activeCompany} Placement Guide
            </h2>

            <p className="text-xs text-slate-300 mt-1">
              Domain: {user.domain || 'Software Development'} • Explanation: {user.explanationLanguage || 'English'}
            </p>

          </div>

          {/* Recruitment Process */}
          {prepData.examPattern?.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">

              <h3 className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center space-x-2">
                <Layers className="w-4 h-4" />
                <span>Recruitment Process & Exam Pattern</span>
              </h3>

              <div className="space-y-3">

                {prepData.examPattern.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 p-4 rounded-xl border border-slate-200/80"
                  >
                    <div className="flex items-start gap-3">

                      <span className="min-w-7 h-7 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>

                      <p className="text-xs text-slate-700 font-medium pt-1">
                        {item}
                      </p>

                    </div>
                  </div>
                ))}

              </div>
            </div>
          )}

          {/* Aptitude Focus */}
          {prepData.aptitudeFocus?.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">

              <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center space-x-2">
                <Brain className="w-4 h-4" />
                <span>Aptitude Focus Areas</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                {prepData.aptitudeFocus.map((topic, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 p-3 rounded-xl border border-slate-200/80"
                  >
                    <span className="text-xs font-medium text-slate-700">
                      • {topic}
                    </span>
                  </div>
                ))}

              </div>
            </div>
          )}

          {/* Technical Focus */}
          {prepData.technicalFocus?.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">

              <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider flex items-center space-x-2">
                <Code2 className="w-4 h-4" />
                <span>Technical & Coding Focus</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                {prepData.technicalFocus.map((topic, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 p-3 rounded-xl border border-slate-200/80"
                  >
                    <span className="text-xs font-medium text-slate-700">
                      • {topic}
                    </span>
                  </div>
                ))}

              </div>
            </div>
          )}

          {/* Technical Questions */}
          {prepData.technicalQuestions?.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">

              <h3 className="text-xs font-bold text-purple-700 uppercase tracking-wider flex items-center space-x-2">
                <Code2 className="w-4 h-4" />
                <span>Sample Technical Questions</span>
              </h3>

              <div className="space-y-4">

                {prepData.technicalQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2"
                  >

                    <p className="text-xs font-bold text-slate-900">
                      {idx + 1}. {q.question}
                    </p>

                    <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-700">
                      <strong className="text-purple-700">
                        Answer:
                      </strong>{' '}
                      {q.answer}
                    </div>

                  </div>
                ))}

              </div>
            </div>
          )}

          {/* HR Questions */}
          {prepData.hrQuestions?.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">

              <h3 className="text-xs font-bold text-orange-700 uppercase tracking-wider flex items-center space-x-2">
                <HelpCircle className="w-4 h-4" />
                <span>HR Interview Questions</span>
              </h3>

              <div className="space-y-4">

                {prepData.hrQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2"
                  >

                    <p className="text-xs font-bold text-slate-900">
                      {idx + 1}. {q.question}
                    </p>

                    <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-700">
                      <strong className="text-orange-700">
                        Ideal Answer:
                      </strong>{' '}
                      {q.idealAnswer}
                    </div>

                  </div>
                ))}

              </div>
            </div>
          )}

          {/* Pro Tips */}
          {prepData.proTips?.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">

              <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center space-x-2">
                <Lightbulb className="w-4 h-4" />
                <span>Preparation Strategy & Pro Tips</span>
              </h3>

              <ul className="list-disc list-inside text-xs text-slate-700 space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200/80 font-medium">

                {prepData.proTips.map((tip, idx) => (
                  <li key={idx}>
                    {tip}
                  </li>
                ))}

              </ul>

            </div>
          )}

        </div>
      )}

      {/* Empty State */}
      {!loading && !prepData && (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">

          <Sparkles className="w-8 h-8 text-rose-500 mx-auto mb-3" />

          <p className="text-sm font-bold text-slate-900">
            Ready to generate your placement blueprint
          </p>

          <p className="text-xs text-slate-500 mt-1">
            Select a company and click Generate Prep Blueprint.
          </p>

        </div>
      )}

    </div>
  );
};