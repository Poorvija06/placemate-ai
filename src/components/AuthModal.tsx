import React, { useState } from 'react';
import { 
  YEAR_OPTIONS, 
  DEPARTMENT_OPTIONS, 
  PROGRAMMING_LANGUAGES, 
  DOMAIN_OPTIONS, 
  TARGET_COMPANIES, 
  EXPLANATION_LANGUAGES 
} from '../data/constants.js';
import { registerUser, loginUser } from '../services/api.js';
import { UserProfile, UserProgress, ResumeReport } from '../types.js';
import { Sparkles, ArrowRight, User, Mail, Lock, Building, GraduationCap, Code, Layers, Globe } from 'lucide-react';

interface AuthModalProps {
  onSuccess: (user: UserProfile, progress: UserProgress, resumeReport?: ResumeReport) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Registration state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [year, setYear] = useState('');
  const [department, setDepartment] = useState('');
  const [programmingLanguage, setProgrammingLanguage] = useState<any>('Java');
  const [domain, setDomain] = useState<any>('Software Development');
  const [targetCompany, setTargetCompany] = useState<any>('TCS');
  const [customCompany, setCustomCompany] = useState('');
  const [explanationLanguage, setExplanationLanguage] = useState<any>('English');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await loginUser({ email, password });
        onSuccess(res.user, res.progress, res.resumeReport);
      } else {
        if (!fullName.trim() || !email.trim() || !password) {
          throw new Error('Please fill in all required fields.');
        }
        if (password !== confirmPassword) {
          throw new Error('Password and Confirm Password do not match.');
        }
        if (!year) {
          throw new Error('Please select your college Year.');
        }
        if (!department) {
          throw new Error('Please select your Department.');
        }

        const res = await registerUser({
          fullName,
          email,
          password,
          confirmPassword,
          collegeName,
          year,
          department,
          programmingLanguage,
          domain,
          targetCompany,
          customCompany,
          explanationLanguage
        });

        onSuccess(res.user, res.progress);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-indigo-900/50 via-slate-900 to-slate-900 p-6 border-b border-slate-800 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 mb-3 border border-indigo-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Welcome to <span className="text-indigo-400">PlaceMate AI</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            {mode === 'login' 
              ? 'Login to access your personalized placement training path.' 
              : 'Create an account to start your zero-baseline placement preparation.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs p-3 rounded-xl">
              {error}
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="student@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Confirm Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">College Name</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="e.g. National Institute of Technology"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* YEAR DROPDOWN */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Year *</label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <select
                      required
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="" disabled>Select Your Year</option>
                      {YEAR_OPTIONS.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* DEPARTMENT DROPDOWN */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Department *</label>
                  <div className="relative">
                    <Layers className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <select
                      required
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="" disabled>Select Your Department</option>
                      {DEPARTMENT_OPTIONS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* PROGRAMMING LANGUAGE */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Programming Language *</label>
                  <div className="relative">
                    <Code className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <select
                      value={programmingLanguage}
                      onChange={(e) => setProgrammingLanguage(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      {PROGRAMMING_LANGUAGES.map((lang) => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* DOMAIN */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Domain *</label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    {DOMAIN_OPTIONS.map((dom) => (
                      <option key={dom} value={dom}>{dom}</option>
                    ))}
                  </select>
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* TARGET COMPANY */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Target Company *</label>
                  <select
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    {TARGET_COMPANIES.map((comp) => (
                      <option key={comp} value={comp}>{comp}</option>
                    ))}
                  </select>

                  {targetCompany === 'Other' && (
                    <input
                      type="text"
                      required
                      placeholder="Enter company name"
                      value={customCompany}
                      onChange={(e) => setCustomCompany(e.target.value)}
                      className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  )}
                </div>

                {/* EXPLANATION LANGUAGE */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Explanation Language *</label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <select
                      value={explanationLanguage}
                      onChange={(e) => setExplanationLanguage(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      {EXPLANATION_LANGUAGES.map((lang) => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
          >
            <span>{loading ? 'Please wait...' : mode === 'login' ? 'Sign In to Dashboard' : 'Create Account & Start Fresh'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        <div className="p-4 bg-slate-900/60 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError(null);
            }}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            {mode === 'login' 
              ? "Don't have an account? Register here" 
              : "Already have an account? Login here"}
          </button>
        </div>

      </div>
    </div>
  );
};
