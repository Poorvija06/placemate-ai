import React, { useState } from 'react';
import { UserProfile, UserProgress, DSALesson, CodeEvaluationResult } from '../types.js';
import { DSA_TOPICS } from '../data/constants.js';
import { getDSALesson, evaluateCode, updateUserProgress } from '../services/api.js';
import { Code, Play, CheckCircle, RefreshCw, Terminal, Sparkles, Award, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { t } from '../lib/i18n.js';

interface DSAModuleProps {
  user: UserProfile;
  progress: UserProgress;
  onProgressUpdate: (progress: UserProgress) => void;
}

export const DSAModule: React.FC<DSAModuleProps> = ({ user, progress, onProgressUpdate }) => {
  const lang = user.explanationLanguage || 'English';
  const [started, setStarted] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('Arrays');
  const [loading, setLoading] = useState(false);
  const [lesson, setLesson] = useState<DSALesson | null>(null);

  // Practice problem code runner state
  const [userCode, setUserCode] = useState<string>('');
  const [evaluating, setEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<CodeEvaluationResult | null>(null);

  React.useEffect(() => {
    if (started) {
      loadTopicLesson(selectedTopic);
    }
  }, [user.explanationLanguage, user.programmingLanguage]);

  const loadTopicLesson = async (topicTitle: string) => {
    setLoading(true);
    setLesson(null);
    setEvalResult(null);
    try {
      const data = await getDSALesson(topicTitle, user.programmingLanguage || 'Java', user.explanationLanguage || 'English');
      setLesson(data);
      if (data?.practiceProblem?.starterCode) {
        setUserCode(data.practiceProblem.starterCode);
      }
    } catch (err) {
      console.error('Error loading DSA lesson:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
    setStarted(true);
    loadTopicLesson(selectedTopic);
  };

  const handleTopicSelect = (topicTitle: string) => {
    setSelectedTopic(topicTitle);
    if (started) {
      loadTopicLesson(topicTitle);
    }
  };

  const handleRunCode = async () => {
    if (!lesson?.practiceProblem) return;
    setEvaluating(true);
    setEvalResult(null);
    try {
      const res = await evaluateCode(
        userCode,
        user.programmingLanguage || 'Java',
        lesson.practiceProblem.title,
        lesson.practiceProblem.description,
        user.explanationLanguage || 'English'
      );
      setEvalResult(res);

      if (res.passed) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        // Update real progress
        const progRes = await updateUserProgress(user.email, {
          dsaProblemsSolved: 1,
          xp: 25,
          dsaTopic: lesson.topic
        });
        onProgressUpdate(progRes.progress);
      }
    } catch (err) {
      console.error('Code evaluation error:', err);
    } finally {
      setEvaluating(false);
    }
  };

  // FIRST-TIME CLEAN START WELCOME SCREEN
  if (!started) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-200/60">
            <Code className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Welcome to Data Structures & Algorithms</h1>
            <p className="text-xs text-slate-500 mt-1">
              Master Arrays, Linked Lists, Trees, Graphs, and DP in your selected language (<strong className="text-emerald-600 font-bold">{user.programmingLanguage}</strong>).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
          <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl space-y-2">
            <div className="flex items-center space-x-2 text-emerald-600 font-bold text-xs">
              <Terminal className="w-4 h-4" />
              <span>Language Focus</span>
            </div>
            <p className="text-xs text-slate-600">
              All code implementations and starter templates follow your selected language: <strong className="text-slate-900">{user.programmingLanguage}</strong>.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl space-y-2">
            <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Line-by-Line Breakdown</span>
            </div>
            <p className="text-xs text-slate-600">
              Understand data structures with detailed step-by-step code walkthroughs.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl space-y-2">
            <div className="flex items-center space-x-2 text-cyan-600 font-bold text-xs">
              <Award className="w-4 h-4" />
              <span>Interactive Evaluation</span>
            </div>
            <p className="text-xs text-slate-600">
              Solve practice problems in the browser and get instant AI feedback on correctness & time complexity.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            DSA readiness starts at <strong className="text-emerald-600 font-bold">0%</strong>. Select a topic to begin learning.
          </p>
          <button
            onClick={handleStart}
            className="w-full sm:w-auto bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-sm uppercase tracking-wider"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Learning DSA</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Topic Selector */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Code className="w-5 h-5 text-emerald-600" />
              <span>DSA Topics in {user.programmingLanguage}</span>
            </h2>
            <p className="text-xs text-slate-500">Select any topic to view concept walkthroughs and solve coding challenges</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            {user.programmingLanguage} Mode
          </span>
        </div>

        {/* Topic Pills */}
        <div className="flex flex-wrap gap-2">
          {DSA_TOPICS.map((t) => {
            const isSelected = selectedTopic === t.title;
            const isCompleted = progress?.completedTopics?.dsa?.includes(t.title);
            return (
              <button
                key={t.id}
                onClick={() => handleTopicSelect(t.title)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <span>{t.title}</span>
                {isCompleted && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lesson Body */}
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-sm">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-900">AI Tutor generating DSA lesson for "{selectedTopic}" in {user.programmingLanguage}...</p>
        </div>
      ) : lesson ? (
        <div className="space-y-6">
          
          {/* Concept Explanation */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">{lesson.conceptTitle || selectedTopic}</h2>
            <div className="text-xs text-slate-700 leading-relaxed space-y-2 whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              {lesson.explanation && lesson.explanation.trim().length > 0 
                ? lesson.explanation 
                : `Comprehensive breakdown for ${selectedTopic} in ${user.programmingLanguage} with explanations in ${user.explanationLanguage || 'English'}. See the code example and practice problem below.`}
            </div>
          </div>

          {/* Code Example */}
          {lesson.codeExample && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  Implementation Example ({lesson.codeExample.language || user.programmingLanguage})
                </span>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto">
                <pre>{lesson.codeExample.code}</pre>
              </div>

              {lesson.codeExample.lineByLineExplanation && lesson.codeExample.lineByLineExplanation.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-700">Line-by-Line Explanation:</p>
                  <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    {lesson.codeExample.lineByLineExplanation.map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Practice Coding Workspace */}
          {lesson.practiceProblem && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider">Interactive Practice Problem</span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">{lesson.practiceProblem.title}</h3>
                <p className="text-xs text-slate-600 mt-1">{lesson.practiceProblem.description}</p>
              </div>

              {/* Code Editor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold text-slate-700">Code Editor ({user.programmingLanguage})</span>
                  <span>Expected Output: {lesson.practiceProblem.expectedOutput}</span>
                </div>
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  rows={10}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-300 focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="text-xs text-amber-700 font-medium">
                  💡 Hint: {lesson.practiceProblem.hint}
                </div>
                <button
                  onClick={handleRunCode}
                  disabled={evaluating}
                  className="bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all flex items-center space-x-2 shrink-0 shadow-sm disabled:opacity-50 uppercase tracking-wider"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{evaluating ? 'Evaluating Code...' : 'Submit & Test Solution'}</span>
                </button>
              </div>

              {/* Evaluation Result */}
              {evalResult && (
                <div className={`p-4 rounded-xl border space-y-3 ${
                  evalResult.passed ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}>
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span>{evalResult.passed ? '✅ Test Cases Passed!' : '❌ Solution Issues Found'}</span>
                    <span>Score: {evalResult.score}/100</span>
                  </div>

                  <p className="text-xs text-slate-700">{evalResult.feedback}</p>

                  {evalResult.output && (
                    <div className="bg-slate-900 p-3 rounded-lg text-xs font-mono text-slate-200">
                      <strong>Console Output:</strong> {evalResult.output}
                    </div>
                  )}

                  {evalResult.complexity && (
                    <div className="flex items-center space-x-4 text-xs font-bold text-slate-700">
                      <span>Time: {evalResult.complexity.time}</span>
                      <span>Space: {evalResult.complexity.space}</span>
                    </div>
                  )}

                  {evalResult.optimizedCode && (
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-800">Reference Optimized Code:</p>
                      <pre className="bg-slate-900 p-3 rounded-lg text-xs font-mono text-emerald-400 overflow-x-auto">
                        {evalResult.optimizedCode}
                      </pre>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

        </div>
      ) : null}

    </div>
  );
};
