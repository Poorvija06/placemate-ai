import React from 'react';
import { UserProfile, UserProgress, ExplanationLanguageOption, ProgrammingLangOption } from '../types.js';
import { EXPLANATION_LANGUAGES, PROGRAMMING_LANGUAGES } from '../data/constants.js';
import { Flame, Award, Globe, Code2, LogOut, User as UserIcon, Sparkles } from 'lucide-react';
import { t } from '../lib/i18n.js';

interface NavbarProps {
  user: UserProfile | null;
  progress: UserProgress | null;
  onLanguageChange: (lang: ExplanationLanguageOption) => void;
  onProgLangChange: (lang: ProgrammingLangOption) => void;
  onLogout: () => void;
  onOpenAuth?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  progress,
  onLanguageChange,
  onProgLangChange,
  onLogout,
  onOpenAuth
}) => {
  const lang = user?.explanationLanguage || 'English';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 text-slate-900 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white text-lg shadow-sm">
            P
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-lg tracking-tight text-slate-900">
                {t('nav.title', lang)}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
              {t('nav.tagline', lang)}
            </p>
          </div>
        </div>

        {/* Center / Right controls */}
        {user ? (
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Explanation Language Selector */}
            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 hover:border-slate-300 transition-colors">
              <Globe className="w-3.5 h-3.5 text-indigo-600 mr-1.5 shrink-0" />
              <select
                value={user.explanationLanguage || 'English'}
                onChange={(e) => onLanguageChange(e.target.value as ExplanationLanguageOption)}
                className="bg-transparent focus:outline-none cursor-pointer pr-1 font-semibold text-slate-800"
                title={t('nav.explanationLanguage', lang)}
              >
                {EXPLANATION_LANGUAGES.map((l) => (
                  <option key={l} value={l} className="bg-white text-slate-900">
                    {l}
                  </option>
                ))}
              </select>
            </div>

            {/* Programming Language Selector */}
            <div className="hidden sm:flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 hover:border-slate-300 transition-colors">
              <Code2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
              <select
                value={user.programmingLanguage || 'Java'}
                onChange={(e) => onProgLangChange(e.target.value as ProgrammingLangOption)}
                className="bg-transparent focus:outline-none cursor-pointer pr-1 font-semibold text-slate-800"
                title={t('nav.programmingLanguage', lang)}
              >
                {PROGRAMMING_LANGUAGES.map((l) => (
                  <option key={l} value={l} className="bg-white text-slate-900">
                    {l}
                  </option>
                ))}
              </select>
            </div>

            {/* Streak Badge Pill */}
            <div className="hidden md:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs">
              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 shrink-0">
                <Flame className="w-3.5 h-3.5 fill-orange-500" />
              </div>
              <div className="flex flex-col items-start leading-none">
                <span className="text-[9px] text-slate-400 font-bold uppercase">{t('nav.streak', lang)}</span>
                <span className="text-xs font-black text-slate-800">{progress?.dailyStreak || 0} {t('nav.days', lang)}</span>
              </div>
            </div>

            {/* EXP Badge Pill */}
            <div className="hidden md:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs">
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <Award className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <div className="flex flex-col items-start leading-none">
                <span className="text-[9px] text-slate-400 font-bold uppercase">{t('nav.xp', lang)}</span>
                <span className="text-xs font-black text-slate-800">{progress?.xp || 0} XP</span>
              </div>
            </div>

            {/* User Profile Badge */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-slate-900">{user.fullName}</p>
                <p className="text-[10px] text-indigo-600 font-semibold">{user.targetCompany}</p>
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                title={t('nav.logout', lang)}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>
        ) : (
          onOpenAuth && (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-2 bg-slate-900 hover:bg-indigo-600 text-white font-medium text-xs px-4 py-2 rounded-lg transition-all shadow-sm"
            >
              <UserIcon className="w-4 h-4" />
              <span>{t('nav.login', lang)}</span>
            </button>
          )
        )}

      </div>
    </header>
  );
};


