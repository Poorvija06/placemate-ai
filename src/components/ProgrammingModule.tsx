import React, { useState, useEffect } from 'react';
import { UserProfile, UserProgress, ProgrammingLangOption, ProgrammingLesson, CodeEvaluationResult } from '../types.js';
import { getProgrammingLesson, evaluateCode, sendProgrammingTutorChat, updateUserProgress } from '../services/api.js';
import { 
  Terminal, 
  Play, 
  Bug, 
  CheckCircle, 
  RefreshCw, 
  Sparkles, 
  BookOpen, 
  Award, 
  Lightbulb, 
  HelpCircle, 
  Code2, 
  Send,
  ChevronRight,
  Flame,
  Check,
  Zap,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { t } from '../lib/i18n.js';

interface ProgrammingModuleProps {
  user: UserProfile;
  progress: UserProgress;
  onProgressUpdate: (progress: UserProgress) => void;
  onProgLangChange?: (lang: ProgrammingLangOption) => void;
}

const PROGRAMMING_TOPICS = [
  '1. Introduction & Overview',
  '2. Syntax & Hello World',
  '3. Variables & Constants',
  '4. Data Types & Type Casting',
  '5. Operators & Expressions',
  '6. Input / Output Handling',
  '7. Conditional Statements (if/else, switch)',
  '8. Loops (for, while, do-while)',
  '9. Arrays & Collections',
  '10. Strings & String Handling',
  '11. Functions / Methods',
  '12. Object-Oriented Programming (OOP)',
  '13. Exception Handling',
  '14. File Handling',
  '15. Advanced Concepts (Pointers / Streams / Lambdas)',
  '16. Problem Solving & Algorithms',
  '17. Campus Coding Interview Preparation'
];

export const ProgrammingModule: React.FC<ProgrammingModuleProps> = ({ 
  user, 
  progress, 
  onProgressUpdate,
  onProgLangChange 
}) => {
  const lang = user.explanationLanguage || 'English';
  const progLang = user.programmingLanguage || 'Java';

  const [started, setStarted] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>(PROGRAMMING_TOPICS[0]);
  const [lesson, setLesson] = useState<ProgrammingLesson | null>(null);
  const [loadingLesson, setLoadingLesson] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<'teach' | 'practice' | 'tutor'>('teach');

  // Code editor state
  const [userCode, setUserCode] = useState<string>('');
  const [evaluating, setEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<CodeEvaluationResult | null>(null);

  // Hints state
  const [hintLevel, setHintLevel] = useState<number>(0);
  const [showSolution, setShowSolution] = useState<boolean>(false);

  // AI Tutor Chat state
  const [chatInput, setChatInput] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'tutor'; text: string }>>([
    {
      sender: 'tutor',
      text: lang === 'Tamil' 
        ? `வணக்கம்! நான் உங்கள் ${progLang} AI பயிற்சியாளர். உங்களுக்கு என்ன சந்தேகம் என்றாலும் என்னிடம் கேளுங்கள்!`
        : lang === 'Tanglish'
        ? `Vanakkam! Naan unga ${progLang} AI Tutor. Enna doubt irundhalum kaelunga, simple-ah explain panren!`
        : `Hello! I am your ${progLang} AI Tutor. Ask me any questions or request simpler explanations anytime!`
    }
  ]);
  const [sendingChat, setSendingChat] = useState<boolean>(false);

  // Load lesson when topic, progLang or explanationLanguage changes
  useEffect(() => {
    if (started) {
      loadLesson(selectedTopic);
    }
  }, [selectedTopic, progLang, user.explanationLanguage, started]);

  const loadLesson = async (topicStr: string) => {
    setLoadingLesson(true);
    setEvalResult(null);
    setHintLevel(0);
    setShowSolution(false);
    try {
      const data = await getProgrammingLesson(topicStr, progLang, user.explanationLanguage);
      setLesson(data);
      if (data?.practiceExercise?.starterCode) {
        setUserCode(data.practiceExercise.starterCode);
      }
    } catch (err) {
      console.error('Failed to load programming lesson:', err);
    } finally {
      setLoadingLesson(false);
    }
  };

  const handleRunCode = async () => {
    setEvaluating(true);
    setEvalResult(null);
    try {
      const res = await evaluateCode(
        userCode,
        progLang,
        lesson?.practiceExercise?.title || selectedTopic,
        lesson?.practiceExercise?.description || 'Programming Practice',
        user.explanationLanguage
      );
      setEvalResult(res);

      if (res.passed) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        const completed = progress?.completedTopics?.programming || [];
        if (!completed.includes(selectedTopic)) {
          const progRes = await updateUserProgress(user.email, {
            programmingProblemsSolved: 1,
            xp: 30,
            completedProgrammingTopic: selectedTopic
          });
          onProgressUpdate(progRes.progress);
        }
      }
    } catch (err) {
      console.error('Code evaluation error:', err);
    } finally {
      setEvaluating(false);
    }
  };

  const handleSendChat = async (questionText?: string) => {
    const q = questionText || chatInput;
    if (!q.trim() || sendingChat) return;

    const newHistory = [...chatHistory, { sender: 'user' as const, text: q }];
    setChatHistory(newHistory);
    if (!questionText) setChatInput('');
    setSendingChat(true);

    try {
      const reply = await sendProgrammingTutorChat(
        q,
        selectedTopic,
        progLang,
        userCode,
        user.explanationLanguage
      );
      setChatHistory([...newHistory, { sender: 'tutor' as const, text: reply }]);
    } catch (err) {
      console.error('Tutor chat error:', err);
    } finally {
      setSendingChat(false);
    }
  };

  // FIRST-TIME WELCOME & OVERVIEW SCREEN
  if (!started) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 bg-cyan-50 text-cyan-600 rounded-2xl border border-cyan-200/60 font-bold">
              <Terminal className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Welcome to {progLang} Programming
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                AI Interactive Tutor • Step-by-Step Course • Live Code Runner • Real-Time AI Debugger
              </p>
            </div>
          </div>

          {/* Programming Language Selector */}
          {onProgLangChange && (
            <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-600 pl-2">Language:</span>
              {(['Java', 'Python', 'C', 'C++'] as ProgrammingLangOption[]).map((l) => (
                <button
                  key={l}
                  onClick={() => onProgLangChange(l)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    progLang === l ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* What, Where, Why breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl space-y-2">
            <div className="flex items-center space-x-2 text-cyan-700 font-bold text-xs uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>What is {progLang}?</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {progLang === 'Java'
                ? 'Java is an object-oriented, strongly typed, class-based language widely used for enterprise backend systems, Android applications, and scalable software.'
                : progLang === 'Python'
                ? 'Python is a high-level, dynamically typed language known for clean syntax, data science, AI/ML models, web backends, and rapid problem solving.'
                : progLang === 'C++'
                ? 'C++ is a high-performance language combining OOP with low-level memory access, heavily used in competitive programming, systems, and gaming engines.'
                : 'C is the foundational procedural language that teaches direct memory pointers, system architecture, and core data structures.'}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl space-y-2">
            <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
              <Code2 className="w-4 h-4" />
              <span>Where is it used?</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Required in technical coding rounds by top employers like TCS, Infosys, Zoho, Wipro, Amazon, and Accenture to evaluate fundamental logic and syntax mastery.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl space-y-2">
            <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>How You Will Learn</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Teach before testing: Learn concepts with syntax breakdowns, see line-by-line explanations in {user.explanationLanguage}, write code in live editor, and get instant AI feedback.
            </p>
          </div>
        </div>

        {/* Basic Structure Example Card */}
        <div className="bg-slate-900 rounded-2xl p-5 text-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400">Basic {progLang} Program Structure:</span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">Starter Template</span>
          </div>
          <pre className="text-xs font-mono text-cyan-200 bg-slate-950 p-4 rounded-xl overflow-x-auto border border-slate-800">
            {progLang === 'Java'
              ? 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello Campus Placement!");\n    }\n}'
              : progLang === 'Python'
              ? 'def main():\n    print("Hello Campus Placement!")\n\nif __name__ == "__main__":\n    main()'
              : progLang === 'C++'
              ? '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello Campus Placement!" << endl;\n    return 0;\n}'
              : '#include <stdio.h>\n\nint main() {\n    printf("Hello Campus Placement!\\n");\n    return 0;\n}'}
          </pre>
        </div>

        {/* Bottom CTA */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            Current Explanation Mode: <strong className="text-slate-800 font-bold">{user.explanationLanguage}</strong>
          </p>
          <button
            onClick={() => setStarted(true)}
            className="w-full sm:w-auto bg-slate-900 hover:bg-cyan-600 text-white font-bold text-xs px-8 py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-sm uppercase tracking-wider"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{t('prog.startLearning', lang)}</span>
          </button>
        </div>
      </div>
    );
  }

  // MAIN AI TUTOR STUDIO INTERFACE
  return (
    <div className="space-y-6">
      
      {/* Top Studio Control Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-cyan-50 text-cyan-600 rounded-xl border border-cyan-200/60 font-bold">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <span>{progLang} AI Tutor & Studio</span>
            </h2>
            <p className="text-xs text-slate-500">
              Explanation Language: <strong className="text-cyan-700 font-semibold">{user.explanationLanguage}</strong>
            </p>
          </div>
        </div>

        {/* Topic Selector & Language Picker */}
        <div className="flex flex-wrap items-center gap-2">
          {onProgLangChange && (
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
              {(['Java', 'Python', 'C', 'C++'] as ProgrammingLangOption[]).map((l) => (
                <button
                  key={l}
                  onClick={() => onProgLangChange(l)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    progLang === l ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          )}

          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-cyan-500"
          >
            {PROGRAMMING_TOPICS.map((topic) => {
              const isComp = progress?.completedTopics?.programming?.includes(topic);
              return (
                <option key={topic} value={topic}>
                  {isComp ? '✅ ' : '📖 '} {topic}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('teach')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'teach' ? 'bg-cyan-600 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>1. Concept & Syntax</span>
        </button>

        <button
          onClick={() => setActiveTab('practice')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'practice' ? 'bg-cyan-600 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>2. Interactive Code Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('tutor')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'tutor' ? 'bg-cyan-600 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>3. Ask AI Tutor Chat</span>
        </button>
      </div>

      {/* CONTENT AREA */}
      {loadingLesson ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-sm">
          <RefreshCw className="w-8 h-8 text-cyan-600 animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-700">
            Generating custom {progLang} lesson in {user.explanationLanguage}...
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* TAB 1: TEACH CONCEPT & SYNTAX */}
          {activeTab === 'teach' && lesson && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">{lesson.conceptTitle || selectedTopic}</h3>
                  <span className="text-xs font-mono bg-cyan-50 text-cyan-700 border border-cyan-200 px-2.5 py-1 rounded-lg">
                    {progLang}
                  </span>
                </div>

                {/* Explanation */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {lesson.simpleExplanation}
                </div>

                {/* Syntax Rules */}
                {lesson.syntaxRules && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span>Syntax Rules & Structure:</span>
                    </h4>
                    <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-xl text-xs text-slate-800 font-mono whitespace-pre-line">
                      {lesson.syntaxRules}
                    </div>
                  </div>
                )}
              </div>

              {/* Code Example with Line-by-Line Breakdown */}
              {lesson.codeExample && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {progLang} Code Example & Breakdown:
                  </h4>

                  <pre className="bg-slate-900 p-4 rounded-xl text-xs font-mono text-cyan-300 overflow-x-auto border border-slate-800">
                    {lesson.codeExample.code}
                  </pre>

                  {lesson.codeExample.lineByLineExplanation && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-700">Line-by-Line Explanation ({user.explanationLanguage}):</p>
                      <div className="space-y-1.5">
                        {lesson.codeExample.lineByLineExplanation.map((line, idx) => (
                          <div key={idx} className="flex items-start space-x-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <span className="font-mono text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold">{idx + 1}</span>
                            <span>{line}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-3 flex justify-end">
                    <button
                      onClick={() => setActiveTab('practice')}
                      className="bg-slate-900 hover:bg-cyan-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all flex items-center space-x-2 uppercase tracking-wider"
                    >
                      <span>Proceed to Practice Exercise</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INTERACTIVE CODE STUDIO & PRACTICE */}
          {activeTab === 'practice' && (
            <div className="space-y-6">
              
              {/* Exercise Statement Banner */}
              {lesson?.practiceExercise && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-lg uppercase tracking-wider">
                        {lesson.practiceExercise.exerciseType || 'Coding Challenge'}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">{lesson.practiceExercise.title}</h3>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                    {lesson.practiceExercise.description}
                  </p>

                  {/* Progressive Hints & Solution Controls */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {lesson.practiceExercise.hints && lesson.practiceExercise.hints.length > 0 && (
                      <button
                        onClick={() => setHintLevel(prev => Math.min(prev + 1, lesson.practiceExercise.hints.length))}
                        className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all"
                      >
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                        <span>Show Hint ({hintLevel}/{lesson.practiceExercise.hints.length})</span>
                      </button>
                    )}

                    <button
                      onClick={() => setShowSolution(!showSolution)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                    >
                      {showSolution ? 'Hide Solution' : 'Reveal Solution'}
                    </button>
                  </div>

                  {/* Hint Boxes */}
                  {hintLevel > 0 && lesson.practiceExercise.hints && (
                    <div className="space-y-2 pt-2">
                      {lesson.practiceExercise.hints.slice(0, hintLevel).map((hint, idx) => (
                        <div key={idx} className="bg-amber-50/80 border border-amber-200/80 p-3 rounded-xl text-xs text-amber-900 flex items-start space-x-2">
                          <span className="font-bold text-amber-600">Hint {idx + 1}:</span>
                          <span>{hint}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Solution Code Box */}
                  {showSolution && lesson.practiceExercise.solutionCode && (
                    <div className="pt-2 space-y-1">
                      <span className="text-xs font-bold text-emerald-700">Reference Solution ({progLang}):</span>
                      <pre className="bg-slate-900 p-3 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto border border-slate-800">
                        {lesson.practiceExercise.solutionCode}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* Code Editor & Execution Panel */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Interactive {progLang} Editor
                  </span>
                  <span className="text-xs text-slate-500">Explanation in: {user.explanationLanguage}</span>
                </div>

                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  rows={12}
                  placeholder={`Write your ${progLang} code here...`}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs text-cyan-300 focus:outline-none focus:border-indigo-500 leading-relaxed"
                />

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      if (lesson?.practiceExercise?.starterCode) {
                        setUserCode(lesson.practiceExercise.starterCode);
                      }
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
                  >
                    Reset Starter Code
                  </button>

                  <button
                    onClick={handleRunCode}
                    disabled={evaluating}
                    className="bg-slate-900 hover:bg-cyan-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all flex items-center space-x-2 shadow-sm disabled:opacity-50 uppercase tracking-wider"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>{evaluating ? 'Analyzing & Executing...' : t('btn.runCode', lang)}</span>
                  </button>
                </div>

                {/* Evaluation & Debug Results */}
                {evalResult && (
                  <div className={`p-5 rounded-2xl border space-y-3 ${
                    evalResult.passed ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between font-bold text-xs">
                      <span className={evalResult.passed ? 'text-emerald-800' : 'text-amber-800'}>
                        {evalResult.passed ? '✅ Code Passed Evaluation!' : '⚠️ AI Debug Analysis & Feedback'}
                      </span>
                      <span className="text-slate-700">Score: {evalResult.score}/100</span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{evalResult.feedback}</p>

                    {evalResult.output && (
                      <div className="bg-slate-900 p-3 rounded-xl text-xs font-mono text-slate-200">
                        <strong className="text-cyan-400">Execution Output:</strong>
                        <pre className="mt-1 text-slate-200">{evalResult.output}</pre>
                      </div>
                    )}

                    {evalResult.bugsFound && evalResult.bugsFound.length > 0 && (
                      <div className="space-y-1 bg-rose-50 p-3 rounded-xl border border-rose-200">
                        <p className="text-xs font-bold text-rose-800">Errors & Bugs Identified ({user.explanationLanguage}):</p>
                        <ul className="list-disc list-inside text-xs text-rose-700 space-y-1">
                          {evalResult.bugsFound.map((bug, idx) => (
                            <li key={idx}>{bug}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {evalResult.optimizedCode && (
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-cyan-800">Corrected Snippet:</p>
                        <pre className="bg-slate-900 p-3 rounded-xl text-xs font-mono text-cyan-300 overflow-x-auto border border-slate-800">
                          {evalResult.optimizedCode}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: EMBEDDED AI TUTOR CHAT */}
          {activeTab === 'tutor' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm min-h-[480px] flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-3 border-b border-slate-100 pb-4 mb-4">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      AI {progLang} Tutor ({user.explanationLanguage})
                    </h3>
                    <p className="text-xs text-slate-500">Ask any question or request code explanations anytime</p>
                  </div>
                </div>

                {/* Quick Query Chips */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    lang === 'Tanglish' ? 'Indha concept puriyala' : 'Explain this concept simply',
                    lang === 'Tanglish' ? 'Why are we using this loop?' : 'Why use this loop?',
                    'Explain my current code line by line',
                    'Why am I getting this error?',
                    'Give me another simple example'
                  ].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleSendChat(chip)}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      "{chip}"
                    </button>
                  ))}
                </div>

                {/* Chat History Messages */}
                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2">
                  {chatHistory.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                          msg.sender === 'user'
                            ? 'bg-slate-900 text-white font-medium rounded-tr-none'
                            : 'bg-slate-100 text-slate-800 border border-slate-200/80 rounded-tl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {sendingChat && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 text-slate-500 text-xs p-3.5 rounded-2xl flex items-center space-x-2">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-600" />
                        <span>AI Tutor is thinking...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Input Box */}
              <div className="pt-4 border-t border-slate-200 flex items-center space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder={t('prog.askTutorPlaceholder', lang)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-500 font-medium"
                />
                <button
                  onClick={() => handleSendChat()}
                  disabled={sendingChat || !chatInput.trim()}
                  className="bg-slate-900 hover:bg-cyan-600 text-white font-bold p-2.5 rounded-xl transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
