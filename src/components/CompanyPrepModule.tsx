import React, { useState } from 'react';
import { UserProfile, UserProgress, CompanyPrepData } from '../types.js';
import { TARGET_COMPANIES } from '../data/constants.js';
import { getCompanyPrepData } from '../services/api.js';
import { Building2, Sparkles, CheckCircle, RefreshCw, Layers, Award, HelpCircle } from 'lucide-react';

interface CompanyPrepProps {
  user: UserProfile;
  progress: UserProgress;
}

export const CompanyPrepModule: React.FC<CompanyPrepProps> = ({ user }) => {
  const [company, setCompany] = useState<string>(user.targetCompany || 'TCS');
  const [customCompany, setCustomCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [prepData, setPrepData] = useState<CompanyPrepData | null>(null);

  const fetchCompanyData = async (companyName: string) => {
    setLoading(true);
    setPrepData(null);
    try {
      const data = await getCompanyPrepData(
        companyName,
        user.domain || 'Software Development',
        user.explanationLanguage || 'English'
      );
      setPrepData(data);
    } catch (err) {
      console.error('Error fetching company prep data:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeCompany = company === 'Other' ? customCompany || 'Target Company' : company;

  React.useEffect(() => {
    if (prepData) {
      fetchCompanyData(activeCompany);
    }
  }, [user.explanationLanguage]);

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
            <p className="text-xs text-slate-500">Tailored recruitment patterns, syllabus, and frequently asked campus questions</p>
          </div>

          <button
            onClick={() => fetchCompanyData(activeCompany)}
            disabled={loading}
            className="bg-slate-900 hover:bg-rose-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center space-x-2 shrink-0 disabled:opacity-50 shadow-sm uppercase tracking-wider"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-rose-400" />}
            <span>Generate Prep Blueprint</span>
          </button>
        </div>

        {/* Company dropdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Company:</label>
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-rose-500 font-medium"
            >
              {TARGET_COMPANIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {company === 'Other' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Enter Company Name:</label>
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

      {/* Results View */}
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-sm">
          <RefreshCw className="w-8 h-8 text-rose-600 animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-900">Generating recruitment pattern for {activeCompany}...</p>
        </div>
      ) : prepData ? (
        <div className="space-y-6">
          
          {/* Header Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-white">{prepData.companyName} Placement Guide</h2>
            <p className="text-xs text-slate-300 mt-1">Domain: {user.domain} • Explanation: {user.explanationLanguage}</p>
          </div>

          {/* Recruitment Rounds */}
          {prepData.rounds && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <h3 className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center space-x-2">
                <Layers className="w-4 h-4" />
                <span>Recruitment Process & Selection Rounds</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {prepData.rounds.map((r, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold text-indigo-700 uppercase">Round {r.roundNumber}</span>
                    <h4 className="text-xs font-bold text-slate-900">{r.name}</h4>
                    <p className="text-xs text-slate-600">{r.description}</p>
                    {r.focusAreas && (
                      <p className="text-[11px] text-emerald-700 mt-1 font-bold">Focus: {r.focusAreas.join(', ')}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Frequently Asked Questions */}
          {prepData.frequentlyAskedQuestions && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <h3 className="text-xs font-bold text-cyan-700 uppercase tracking-wider flex items-center space-x-2">
                <HelpCircle className="w-4 h-4" />
                <span>Frequently Asked Interview Questions</span>
              </h3>

              <div className="space-y-3">
                {prepData.frequentlyAskedQuestions.map((q, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-700">[{q.category}]</span>
                      <span className="text-[10px] text-slate-500 font-bold">Freq: {q.frequency}</span>
                    </div>
                    <p className="font-bold text-slate-900 mt-1">"{q.question}"</p>
                    <p className="text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200/80">
                      💡 <strong>Sample/Approach:</strong> {q.sampleAnswerOrApproach}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strategy & Tips */}
          {prepData.preparationTips && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm">
              <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Preparation Strategy</h3>
              <ul className="list-disc list-inside text-xs text-slate-700 space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200/80 font-medium">
                {prepData.preparationTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

        </div>
      ) : null}

    </div>
  );
};
