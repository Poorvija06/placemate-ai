import React from 'react';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  Code, 
  Terminal, 
  Mic, 
  UserCheck, 
  FileText, 
  Bot, 
  Building2, 
  CalendarCheck,
  Globe
} from 'lucide-react';
import { UserProfile } from '../types.js';
import { t } from '../lib/i18n.js';

export type ActiveTab = 
  | 'dashboard'
  | 'aptitude'
  | 'dsa'
  | 'programming'
  | 'spoken'
  | 'interview'
  | 'resume'
  | 'coach'
  | 'company'
  | 'daily';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  user?: UserProfile | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab, user }) => {
  const lang = user?.explanationLanguage || 'English';

  const mainLearning = [
    { id: 'dashboard', label: t('sidebar.dashboard', lang), icon: LayoutDashboard },
    { id: 'aptitude', label: t('sidebar.aptitude', lang), icon: BrainCircuit },
    { id: 'dsa', label: t('sidebar.dsa', lang), icon: Code },
    { id: 'programming', label: `${t('sidebar.programming', lang)} (${user?.programmingLanguage || 'Java'})`, icon: Terminal },
  ];

  const interviewPrep = [
    { id: 'spoken', label: t('sidebar.spokenPractice', lang), icon: Mic },
    { id: 'interview', label: t('sidebar.mockInterview', lang), icon: UserCheck },
    { id: 'resume', label: t('sidebar.resumeAnalyzer', lang), icon: FileText },
    { id: 'coach', label: t('sidebar.aiCoach', lang), icon: Bot },
    { id: 'company', label: t('sidebar.companyPrep', lang), icon: Building2 },
    { id: 'daily', label: t('sidebar.dailyChallenges', lang), icon: CalendarCheck }
  ];

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 text-slate-800 z-20">
      
      <div className="p-4 flex-1 overflow-y-auto">
        {/* Main Learning Category */}
        <div className="px-3 mb-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
          {t('sidebar.mainLearning', lang)}
        </div>
        <nav className="space-y-1 mb-6">
          {mainLearning.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id as ActiveTab)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'text-indigo-700 bg-indigo-50 border-r-4 border-indigo-600 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Interview Prep Category */}
        <div className="px-3 mb-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
          {t('sidebar.interviewPractice', lang)}
        </div>
        <nav className="space-y-1">
          {interviewPrep.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id as ActiveTab)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'text-indigo-700 bg-indigo-50 border-r-4 border-indigo-600 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Explanation Language Box at Bottom */}
      {user && (
        <div className="p-4 border-t border-slate-200">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>{t('sidebar.explanationMode', lang)}</span>
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <div className="text-xs font-bold text-slate-900 flex items-center justify-between uppercase tracking-wider">
              <span>{user.explanationLanguage || 'English'}</span>
              <span className="text-[9px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-mono border border-indigo-200/60 font-bold">
                {t('sidebar.active', lang)}
              </span>
            </div>
          </div>
        </div>
      )}

    </aside>
  );
};


