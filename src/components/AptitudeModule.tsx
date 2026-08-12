import React, { useState } from 'react';
import { UserProfile, UserProgress, AptitudeLesson } from '../types.js';
import { APTITUDE_TOPICS } from '../data/constants.js';
import { getAptitudeLesson, updateUserProgress } from '../services/api.js';
import { BrainCircuit, Play, BookOpen, CheckCircle, HelpCircle, ArrowRight, Sparkles, RefreshCw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { t } from '../lib/i18n.js';

interface AptitudeModuleProps {
  user: UserProfile;
  progress: UserProgress;
  onProgressUpdate: (progress: UserProgress) => void;
}

export const AptitudeModule: React.FC<AptitudeModuleProps> = ({ user, progress, onProgressUpdate }) => {
  const lang = user.explanationLanguage || 'English';
  const [started, setStarted] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('Percentages');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [loading, setLoading] = useState(false);
  const [lesson, setLesson] = useState<AptitudeLesson | null>(null);
  
  // MCQ state
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: number }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  React.useEffect(() => {
    if (started) {
      loadTopicLesson(selectedTopic, difficulty);
    }
  }, [user.explanationLanguage]);

  const loadTopicLesson = async (topicTitle: string, diff: 'Easy' | 'Medium' | 'Hard') => {
    setLoading(true);
    setLesson(null);
    setSubmitted(false);
    setSelectedAnswers({});
    setScore(null);
    try {
      const data = await getAptitudeLesson(topicTitle, diff, user.explanationLanguage || 'English');
      setLesson(data);
    } catch (err) {
      console.error('Failed to load aptitude lesson:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
    setStarted(true);
    loadTopicLesson(selectedTopic, difficulty);
  };

  const handleTopicSelect = (topicTitle: string) => {
    setSelectedTopic(topicTitle);
    if (started) {
      loadTopicLesson(topicTitle, difficulty);
    }
  };

  const handleAnswerSelect = (qId: string, optionIdx: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmitMCQ = async () => {
    if (!lesson) return;
    let correctCount = 0;
    lesson.mcqQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const calculatedScore = Math.round((correctCount / lesson.mcqQuestions.length) * 100);
    setScore(calculatedScore);
    setSubmitted(true);

    if (calculatedScore >= 60) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }

    // Update real progress
    try {
      const res = await updateUserProgress(user.email, {
        aptitudeSolved: correctCount,
        xp: correctCount * 15,
        aptitudeTopic: lesson.topic
      });
      onProgressUpdate(res.progress);
    } catch (err) {
      console.error('Progress update error:', err);
    }
  };

  // FIRST-TIME WELCOME SCREEN (Clean start requirement)
  if (!started) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-200/60">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Welcome to Aptitude & Logical Reasoning</h1>
            <p className="text-xs text-slate-500 mt-1">
              Interactive AI Tutor for Quantitative Aptitude, Logical Reasoning, and Problem-Solving.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
          <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl space-y-2">
            <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs">
              <BookOpen className="w-4 h-4" />
              <span>Step-by-Step AI Teaching</span>
            </div>
            <p className="text-xs text-slate-600">
              Concepts are explained simply with step-by-step examples before testing your skills.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl space-y-2">
            <div className="flex items-center space-x-2 text-emerald-600 font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Adaptive Learning</span>
            </div>
            <p className="text-xs text-slate-600">
              Progress smoothly from Easy to Medium and Hard questions with guided hints.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl space-y-2">
            <div className="flex items-center space-x-2 text-cyan-600 font-bold text-xs">
              <HelpCircle className="w-4 h-4" />
              <span>Multilingual Explanations</span>
            </div>
            <p className="text-xs text-slate-600">
              Explanations are tailored to your selected language: <strong className="text-slate-900">{user.explanationLanguage}</strong>.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            Topic progress starts at <strong className="text-amber-600 font-bold">0%</strong>. Select a topic to begin learning.
          </p>
          <button
            onClick={handleStart}
            className="w-full sm:w-auto bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-sm uppercase tracking-wider"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Learning Aptitude</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Topic Selector */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <BrainCircuit className="w-5 h-5 text-amber-600" />
              <span>Aptitude & Logic Topics</span>
            </h2>
            <p className="text-xs text-slate-500">Select any topic to generate AI-powered explanations and practice</p>
          </div>

          {/* Difficulty Selector */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
            {(['Easy', 'Medium', 'Hard'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => {
                  setDifficulty(diff);
                  loadTopicLesson(selectedTopic, diff);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  difficulty === diff 
                    ? 'bg-amber-500 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Pills */}
        <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
          {APTITUDE_TOPICS.map((t) => {
            const isSelected = selectedTopic === t.title;
            const isCompleted = progress?.completedTopics?.aptitude?.includes(t.title);
            return (
              <button
                key={t.id}
                onClick={() => handleTopicSelect(t.title)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
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

      {/* Lesson Content Body */}
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-sm">
          <RefreshCw className="w-8 h-8 text-amber-600 animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-900">AI Tutor is preparing lesson for "{selectedTopic}"...</p>
          <p className="text-xs text-slate-500">Tailoring explanation to {user.explanationLanguage} in {difficulty} mode.</p>
        </div>
      ) : lesson ? (
        <div className="space-y-6">
          
          {/* 1. Concept Title & Explanation */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Concept Lesson</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                {difficulty} Level
              </span>
            </div>
            
            <h2 className="text-lg font-bold text-slate-900">{lesson.conceptTitle || selectedTopic}</h2>
            <div className="text-xs text-slate-700 leading-relaxed space-y-2 whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              {lesson.simpleExplanation && lesson.simpleExplanation.trim().length > 0 
                ? lesson.simpleExplanation 
                : `Comprehensive step-by-step breakdown for ${selectedTopic} in ${user.explanationLanguage || 'English'}. Review the worked examples and practice problems below to master this topic.`}
            </div>
          </div>

          {/* 2. Example Problem */}
          {lesson.exampleProblem && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm">
              <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider">Worked Example</span>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs text-slate-800 font-semibold">
                <strong>Question:</strong> {lesson.exampleProblem.question}
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-slate-700">Solution Steps:</p>
                <ol className="list-decimal list-inside text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  {lesson.exampleProblem.solutionSteps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {/* 3. Guided Practice */}
          {lesson.guidedPractice && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Guided Practice</span>
              <p className="text-xs text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200/80 font-medium">
                {lesson.guidedPractice.question}
              </p>
              <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-800">
                💡 <strong>Hint:</strong> {lesson.guidedPractice.hint}
              </div>
            </div>
          )}

          {/* 4. MCQ Practice Test */}
          {lesson.mcqQuestions && lesson.mcqQuestions.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Topic MCQ Assessment</h3>
                  <p className="text-xs text-slate-500">Answer all questions to test your mastery and update your progress</p>
                </div>
                {score !== null && (
                  <div className="flex items-center space-x-1 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-bold">
                    <Award className="w-4 h-4 text-indigo-600" />
                    <span>Score: {score}%</span>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {lesson.mcqQuestions.map((q, qIdx) => {
                  const userAns = selectedAnswers[q.id];
                  return (
                    <div key={q.id || qIdx} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
                      <p className="text-xs font-bold text-slate-900">
                        {qIdx + 1}. {q.question}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = userAns === optIdx;
                          const isCorrect = submitted && optIdx === q.correctIndex;
                          const isWrong = submitted && isSelected && !isCorrect;

                          let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:border-slate-300';
                          if (isSelected) btnStyle = 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold';
                          if (submitted) {
                            if (isCorrect) btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold';
                            if (isWrong) btnStyle = 'bg-rose-50 border-rose-500 text-rose-800';
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={submitted}
                              onClick={() => handleAnswerSelect(q.id, optIdx)}
                              className={`text-left text-xs p-3 rounded-xl border transition-all ${btnStyle}`}
                            >
                              <span className="font-bold mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {submitted && (
                        <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-700">
                          <strong className="text-amber-600">Explanation:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!submitted ? (
                <button
                  onClick={handleSubmitMCQ}
                  disabled={Object.keys(selectedAnswers).length < lesson.mcqQuestions.length}
                  className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-sm disabled:opacity-50 uppercase tracking-wider"
                >
                  Submit Answers & Save Progress
                </button>
              ) : (
                <button
                  onClick={() => loadTopicLesson(selectedTopic, difficulty)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs py-3 rounded-xl transition-all flex items-center justify-center space-x-2 uppercase tracking-wider"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Practice More Questions</span>
                </button>
              )}

            </div>
          )}

        </div>
      ) : null}

    </div>
  );
};
