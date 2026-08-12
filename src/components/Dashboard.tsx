import React from 'react';
import { UserProfile, UserProgress } from '../types.js';
import { ActiveTab } from './Sidebar.js';
import { 
  BrainCircuit, 
  Code, 
  Terminal, 
  Mic, 
  UserCheck, 
  Building2, 
  Flame, 
  Award, 
  Target, 
  ArrowUpRight,
  Sparkles,
  FileText,
  Send
} from 'lucide-react';
import { t } from '../lib/i18n.js';

interface DashboardProps {
  user: UserProfile;
  progress: UserProgress;
  onNavigate: (tab: ActiveTab) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, progress, onNavigate }) => {
  const readiness = progress?.placementReadiness || 0;
  const lang = user.explanationLanguage || 'English';

  const moduleMetrics = [
    { title: t('sidebar.aptitude', lang), label: 'APTITUDE', value: progress?.aptitude || 0, icon: BrainCircuit, tab: 'aptitude' as ActiveTab, color: 'text-amber-600', bg: 'bg-amber-50 text-amber-600' },
    { title: t('sidebar.dsa', lang), label: 'DSA', value: progress?.dsa || 0, icon: Code, tab: 'dsa' as ActiveTab, color: 'text-emerald-600', bg: 'bg-emerald-50 text-emerald-600' },
    { title: t('sidebar.programming', lang), label: 'PROG', value: progress?.programming || 0, icon: Terminal, tab: 'programming' as ActiveTab, color: 'text-cyan-600', bg: 'bg-cyan-50 text-cyan-600' },
    { title: t('sidebar.spokenPractice', lang), label: 'COMM.', value: progress?.communication || 0, icon: Mic, tab: 'spoken' as ActiveTab, color: 'text-indigo-600', bg: 'bg-indigo-50 text-indigo-600' },
    { title: t('sidebar.mockInterview', lang), label: 'MOCK', value: progress?.mockInterview || 0, icon: UserCheck, tab: 'interview' as ActiveTab, color: 'text-violet-600', bg: 'bg-violet-50 text-violet-600' },
    { title: t('sidebar.companyPrep', lang), label: 'COMPANY', value: progress?.companyPrep || 0, icon: Building2, tab: 'company' as ActiveTab, color: 'text-rose-600', bg: 'bg-rose-50 text-rose-600' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Info Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{t('dash.welcome', lang)} {user.fullName}</h1>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-tight mt-1">
            {user.year || '3rd Year'} • {user.department || 'CSE'} • {t('dash.targetCompanyLabel', lang)} {user.targetCompany || 'Top Tech'} • {user.programmingLanguage || 'Java'}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-full border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 shrink-0 font-bold">
              🔥
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="text-[10px] text-slate-400 font-bold uppercase">{t('nav.streak', lang)}</span>
              <span className="text-sm font-black text-slate-800">{progress?.dailyStreak || 0} {t('nav.days', lang)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-full border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 font-bold">
              ⚡
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="text-[10px] text-slate-400 font-bold uppercase">{t('nav.xp', lang)}</span>
              <span className="text-sm font-black text-slate-800">{progress?.xp || 0} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Placement Readiness Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-hidden relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{t('dash.readinessLabel', lang)}</h2>
                <p className="text-xs text-slate-500">
                  {readiness === 0 ? 'Start your first module to increase your readiness score.' : 'Keep completing practice sessions to boost your score.'}
                </p>
              </div>
              <div className="text-4xl font-black text-indigo-600 tracking-tighter">
                {readiness}%
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-500 h-full transition-all duration-700 rounded-full"
                style={{ width: `${readiness}%` }}
              />
            </div>

            {/* Module Scores Grid */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {moduleMetrics.slice(0, 4).map((m) => (
                <div key={m.label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">{m.label}</div>
                  <div className="text-lg font-bold text-slate-900">{m.value}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Resume Analyzer Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-indigo-300 group cursor-pointer transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase">ATS SCAN</span>
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{t('sidebar.resumeAnalyzer', lang)}</h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Upload your PDF resume for evidence-based ATS and skill analysis, project extraction, and tailored interview prep.
                </p>
              </div>
              <button 
                onClick={() => onNavigate('resume')}
                className="w-full py-2 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold rounded-lg transition-colors uppercase tracking-wider"
              >
                Upload Resume
              </button>
            </div>

            {/* Spoken Practice Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-indigo-300 group cursor-pointer transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                    <Mic className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase">VOICE AI</span>
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{t('sidebar.spokenPractice', lang)}</h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Improve your English communication and confidence through voice AI sessions. Start with a self-introduction.
                </p>
              </div>
              <button 
                onClick={() => onNavigate('spoken')}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors uppercase tracking-wider"
              >
                {t('btn.start', lang)}
              </button>
            </div>

          </div>

          {/* Module Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              {t('dash.quickActionsTitle', lang)}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {moduleMetrics.map((item) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={item.title}
                    onClick={() => onNavigate(item.tab)}
                    className="group border border-slate-200/80 hover:border-indigo-300 p-4 rounded-xl transition-all cursor-pointer bg-slate-50/50 hover:bg-white hover:shadow-xs"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg ${item.bg}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {item.title}
                    </h3>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Progress</span>
                      <span className="font-bold text-slate-800">{item.value}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* AI Coach Dark Box */}
          <div className="bg-slate-900 rounded-2xl p-6 shadow-xl flex flex-col relative overflow-hidden text-white border border-slate-800 min-h-[360px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-3xl rounded-full translate-x-10 -translate-y-10" />
            <div className="relative z-10 flex-1 flex flex-col">
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-indigo-500 border-2 border-white/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-indigo-400 font-bold tracking-wider uppercase">{t('sidebar.aiCoach', lang)}</span>
                  <span className="text-sm text-white font-medium">Online & Ready ({user.explanationLanguage})</span>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-4 border border-white/10 mb-4">
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "Hi {user.fullName}! I'm your AI Placement Trainer. Let me guide your preparation for {user.targetCompany}. Which topic should we tackle first?"
                </p>
              </div>

              <div className="space-y-2 mb-6">
                <button 
                  onClick={() => onNavigate('aptitude')}
                  className="w-full text-left px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-white/10 transition-colors"
                >
                  How do I start Aptitude preparation?
                </button>
                <button 
                  onClick={() => onNavigate('company')}
                  className="w-full text-left px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-white/10 transition-colors"
                >
                  Tell me about {user.targetCompany} interview pattern
                </button>
              </div>

            </div>

            <div className="mt-auto relative z-10">
              <button 
                onClick={() => onNavigate('coach')}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <Sparkles className="w-4 h-4" />
                Open 24/7 AI Coach
              </button>
            </div>
          </div>

          {/* Daily Challenges Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('sidebar.dailyChallenges', lang)}</h3>
              <button 
                onClick={() => onNavigate('daily')}
                className="text-[10px] font-bold text-indigo-600 hover:underline uppercase"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              <div 
                onClick={() => onNavigate('daily')}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span className="text-xs font-semibold text-slate-700">Aptitude Logic Quiz</span>
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase">Not Started</span>
              </div>

              <div 
                onClick={() => onNavigate('daily')}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-slate-700">DSA Code Snippet</span>
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase">Not Started</span>
              </div>

              <div 
                onClick={() => onNavigate('daily')}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-xs font-semibold text-slate-700">Communication Practice</span>
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase">Not Started</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};


