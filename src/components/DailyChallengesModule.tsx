import React, { useState } from 'react';
import { UserProfile, UserProgress, DailyChallenge } from '../types.js';
import { getDailyChallenges, updateUserProgress } from '../services/api.js';
import { CalendarCheck, Play, CheckCircle, RefreshCw, Flame, Award, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyChallengesProps {
  user: UserProfile;
  progress: UserProgress;
  onProgressUpdate: (progress: UserProgress) => void;
}

export const DailyChallengesModule: React.FC<DailyChallengesProps> = ({ user, progress, onProgressUpdate }) => {
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [answers, setAnswers] = useState<{ [id: string]: string }>({});

  React.useEffect(() => {
    if (started) {
      loadChallenges();
    }
  }, [user.explanationLanguage, user.programmingLanguage]);

  const loadChallenges = async () => {
    setLoading(true);
    try {
      const data = await getDailyChallenges(user, user.explanationLanguage || 'English');
      setChallenges(data);
    } catch (err) {
      console.error('Error loading daily challenges:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
    setStarted(true);
    loadChallenges();
  };

  const handleCompleteChallenge = async (challenge: DailyChallenge) => {
    if (completedIds.includes(challenge.id)) return;

    setCompletedIds((prev) => [...prev, challenge.id]);
    confetti({ particleCount: 30, spread: 40, origin: { y: 0.7 } });

    // Update real user progress
    try {
      const res = await updateUserProgress(user.email, {
        dailyStreak: 1,
        xp: challenge.rewardXp
      });
      onProgressUpdate(res.progress);
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  // FIRST-TIME CLEAN START WELCOME SCREEN
  if (!started) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-700 rounded-2xl border border-amber-200/60">
            <CalendarCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Daily Placement Challenges</h1>
            <p className="text-xs text-slate-500 mt-1">
              Solve 3 quick bite-sized daily problems to build consistency, streak, and XP.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
          <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl space-y-1">
            <h3 className="text-xs font-bold text-amber-800">⚡ 1. Aptitude Sprint</h3>
            <p className="text-[11px] text-slate-600">1-minute quant or logical puzzle.</p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl space-y-1">
            <h3 className="text-xs font-bold text-emerald-800">💻 2. Micro Code Challenge</h3>
            <p className="text-[11px] text-slate-600">Quick algorithm snippet in {user.programmingLanguage}.</p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl space-y-1">
            <h3 className="text-xs font-bold text-indigo-800">🗣️ 3. HR / Communication Question</h3>
            <p className="text-[11px] text-slate-600">Answer 1 situational placement query.</p>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            Daily Streak: <strong className="text-amber-700 font-bold">{progress?.dailyStreak || 0} Days</strong>
          </p>
          <button
            onClick={handleStart}
            className="w-full sm:w-auto bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-sm uppercase tracking-wider"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Load Today's Challenges</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl border border-amber-200/60">
            <Flame className="w-6 h-6 fill-amber-500/20" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Today's Placement Challenges</h2>
            <p className="text-xs text-slate-500">Streak: {progress?.dailyStreak || 0} Days • Total XP: {progress?.xp || 0}</p>
          </div>
        </div>

        <button
          onClick={loadChallenges}
          disabled={loading}
          className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all border border-slate-200"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-700' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-sm">
          <RefreshCw className="w-8 h-8 text-amber-700 animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-900">Generating fresh daily challenges for you...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {challenges.map((c, idx) => {
            const isDone = completedIds.includes(c.id);
            return (
              <div key={c.id || idx} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                    {c.category} Challenge
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    +{c.rewardXp} XP
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">{c.title}</h3>
                <p className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 font-medium">
                  {c.description}
                </p>

                {c.mcqOptions && c.mcqOptions.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {c.mcqOptions.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        disabled={isDone}
                        onClick={() => handleCompleteChallenge(c)}
                        className={`text-left text-xs p-3 rounded-xl border transition-all ${
                          isDone ? 'bg-slate-100 border-slate-200 text-slate-400 font-medium' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800 font-medium'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <textarea
                      disabled={isDone}
                      value={answers[c.id] || ''}
                      onChange={(e) => setAnswers({ ...answers, [c.id]: e.target.value })}
                      placeholder="Type your answer or response here..."
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-amber-500 font-medium"
                    />
                    <button
                      disabled={isDone || !(answers[c.id] || '').trim()}
                      onClick={() => handleCompleteChallenge(c)}
                      className="bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all disabled:opacity-50 uppercase tracking-wider shadow-sm"
                    >
                      {isDone ? 'Completed!' : 'Submit Answer'}
                    </button>
                  </div>
                )}

                {isDone && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2 font-bold">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Completed! +{c.rewardXp} XP added to your profile.</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
