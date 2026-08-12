import React, { useState } from 'react';
import { UserProfile, UserProgress, MockInterviewResult, InterviewQnA } from '../types.js';
import { getMockInterviewQuestion, evaluateMockInterviewAnswer, finalizeMockInterview, updateUserProgress } from '../services/api.js';
import { UserCheck, Play, Award, CheckCircle, RefreshCw, Send, Mic, MessageSquare, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MockInterviewProps {
  user: UserProfile;
  progress: UserProgress;
  onProgressUpdate: (progress: UserProgress) => void;
}

export const MockInterviewModule: React.FC<MockInterviewProps> = ({ user, progress, onProgressUpdate }) => {
  const [started, setStarted] = useState(false);
  const [interviewType, setInterviewType] = useState<'HR' | 'Technical' | 'Coding' | 'Full Mock'>('HR');
  const [inProgress, setInProgress] = useState(false);

  // Active session state
  const [qnaHistory, setQnaHistory] = useState<InterviewQnA[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<{ questionNumber: number; question: string; context: string } | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [evaluatingAnswer, setEvaluatingAnswer] = useState(false);

  // Final result
  const [finalReport, setFinalReport] = useState<MockInterviewResult | null>(null);

  const startSession = async () => {
    setStarted(true);
    setInProgress(true);
    setQnaHistory([]);
    setFinalReport(null);
    setUserAnswer('');
    fetchNextQuestion([]);
  };

  const fetchNextQuestion = async (history: InterviewQnA[]) => {
    setLoadingQuestion(true);
    setCurrentQuestion(null);
    try {
      const res = await getMockInterviewQuestion(
        interviewType,
        user.targetCompany || 'TCS',
        user.domain || 'Software Development',
        history,
        user.explanationLanguage || 'English'
      );
      if (res && res.question && res.question.trim().length > 0) {
        setCurrentQuestion({
          questionNumber: res.questionNumber || history.length + 1,
          question: res.question.trim(),
          context: res.context || 'Tip: Speak clearly and structure your answer with key examples.'
        });
      } else {
        setCurrentQuestion({
          questionNumber: history.length + 1,
          question: `Tell me about yourself, your academic background, and why you want to join ${user.targetCompany || 'our company'}.`,
          context: 'Tip: Structure your response using the STAR method.'
        });
      }
    } catch (err) {
      console.error('Error getting interview question:', err);
      setCurrentQuestion({
        questionNumber: history.length + 1,
        question: `Tell me about yourself, your academic background, and why you want to join ${user.targetCompany || 'our company'}.`,
        context: 'Tip: Structure your response using the STAR method.'
      });
    } finally {
      setLoadingQuestion(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentQuestion || !userAnswer.trim()) return;
    setEvaluatingAnswer(true);
    try {
      const evalRes = await evaluateMockInterviewAnswer(
        currentQuestion.question,
        userAnswer,
        interviewType,
        user.targetCompany || 'TCS',
        user.explanationLanguage || 'English'
      );

      const updatedHistory: InterviewQnA[] = [
        ...qnaHistory,
        {
          question: currentQuestion.question,
          answer: userAnswer,
          feedback: evalRes.feedback,
          score: evalRes.score
        }
      ];
      setQnaHistory(updatedHistory);
      setUserAnswer('');

      // If reached 4 questions, finish interview!
      if (updatedHistory.length >= 4) {
        finishInterviewSession(updatedHistory);
      } else {
        fetchNextQuestion(updatedHistory);
      }
    } catch (err) {
      console.error('Error evaluating answer:', err);
    } finally {
      setEvaluatingAnswer(false);
    }
  };

  const finishInterviewSession = async (history: InterviewQnA[]) => {
    setLoadingQuestion(true);
    try {
      const result = await finalizeMockInterview(
        history,
        interviewType,
        user.targetCompany || 'TCS',
        user.email,
        user.explanationLanguage || 'English'
      );
      setFinalReport(result);
      setInProgress(false);

      if (result.score >= 65) {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      }

      // Update progress
      const progRes = await updateUserProgress(user.email, {
        mockInterviews: 1,
        xp: 50
      });
      onProgressUpdate(progRes.progress);
    } catch (err) {
      console.error('Error finalizing interview:', err);
    } finally {
      setLoadingQuestion(false);
    }
  };

  // FIRST-TIME CLEAN START WELCOME SCREEN
  if (!started) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-violet-50 text-violet-600 rounded-2xl border border-violet-200/60">
            <UserCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Welcome to AI Mock Interview</h1>
            <p className="text-xs text-slate-500 mt-1">
              Realistic step-by-step interview rounds for <strong className="text-violet-700 font-bold">{user.targetCompany}</strong> in <strong className="text-slate-900">{user.domain}</strong>.
            </p>
          </div>
        </div>

        {/* Interview Type Selection */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700">Select Mock Interview Type:</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { type: 'HR', title: 'HR Interview', desc: 'Behavioral, background, cultural fit, situational STAR questions.' },
              { type: 'Technical', title: 'Technical Interview', desc: 'Domain concepts, OOP, DBMS, system basics.' },
              { type: 'Coding', title: 'Coding Interview', desc: 'Problem-solving logic, algorithm strategy.' },
              { type: 'Full Mock', title: 'Full Mock Interview', desc: 'Comprehensive multi-round campus placement interview.' }
            ].map((item) => (
              <div
                key={item.type}
                onClick={() => setInterviewType(item.type as any)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  interviewType === item.type
                    ? 'bg-violet-50 border-violet-500 text-slate-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xs font-bold">{item.title}</h3>
                  {interviewType === item.type && <CheckCircle className="w-4 h-4 text-violet-600" />}
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            Mock Interviews: <strong className="text-violet-600 font-bold">0</strong> • Interview Score: <strong className="text-violet-600 font-bold">0</strong>
          </p>
          <button
            onClick={startSession}
            className="w-full sm:w-auto bg-slate-900 hover:bg-violet-600 text-white font-bold text-xs px-8 py-3 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-sm uppercase tracking-wider"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>START INTERVIEW</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Session Top Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-violet-600" />
            <span>AI Mock Interviewer ({interviewType})</span>
          </h2>
          <p className="text-xs text-slate-500">Targeting {user.targetCompany} • {user.domain}</p>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
          Question {qnaHistory.length + 1} of 4
        </span>
      </div>

      {/* Active Question & Answer Area */}
      {inProgress ? (
        <div className="space-y-6">
          
          {/* Previous Q&A history if any */}
          {qnaHistory.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Previous Turns</p>
              {qnaHistory.map((qna, idx) => (
                <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl space-y-2 text-xs shadow-xs">
                  <div className="font-bold text-violet-900">Q{idx + 1}: {qna.question}</div>
                  <div className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">Your Answer: {qna.answer}</div>
                  <div className="text-slate-600 italic font-medium">Feedback: {qna.feedback} (Score: {qna.score}/100)</div>
                </div>
              ))}
            </div>
          )}

          {/* Current Question */}
          {loadingQuestion ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-3 shadow-sm">
              <RefreshCw className="w-7 h-7 text-violet-600 animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-900">Interviewer is framing question {qnaHistory.length + 1}...</p>
            </div>
          ) : currentQuestion ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="space-y-2">
                <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">
                  Interviewer Question #{currentQuestion.questionNumber}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  "{currentQuestion.question}"
                </h3>
                {currentQuestion.context && (
                  <p className="text-xs text-slate-500 italic">💡 Context: {currentQuestion.context}</p>
                )}
              </div>

              {/* Answer Box */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Your Answer:</label>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  rows={4}
                  placeholder="Type your structured answer here..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => finishInterviewSession(qnaHistory)}
                  className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors"
                >
                  End Interview Early
                </button>
                <button
                  onClick={handleSubmitAnswer}
                  disabled={evaluatingAnswer || !userAnswer.trim()}
                  className="bg-slate-900 hover:bg-violet-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all flex items-center space-x-2 shadow-sm disabled:opacity-50 uppercase tracking-wider"
                >
                  <Send className="w-4 h-4" />
                  <span>{evaluatingAnswer ? 'Evaluating Answer...' : 'Submit Answer & Continue'}</span>
                </button>
              </div>

            </div>
          ) : null}

        </div>
      ) : finalReport ? (
        /* Final Interview Performance Scorecard */
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Award className="w-6 h-6 text-violet-600" />
                <span>Interview Performance Report</span>
              </h2>
              <p className="text-xs text-slate-500">{interviewType} Interview for {user.targetCompany}</p>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black text-violet-600">{finalReport.score}/100</span>
              <p className="text-[10px] text-slate-500 font-bold">Overall Interview Score</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-2">
              <h3 className="text-xs font-bold text-emerald-800">Key Strengths Demonstrated</h3>
              <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                {finalReport.strengths.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-2">
              <h3 className="text-xs font-bold text-amber-800">Areas to Improve</h3>
              <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                {finalReport.areasToImprove.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
            <h3 className="text-xs font-bold text-indigo-900">Placement Mentor Suggestions</h3>
            <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
              {finalReport.suggestions.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                setStarted(false);
                setFinalReport(null);
              }}
              className="bg-slate-900 hover:bg-violet-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all uppercase tracking-wider shadow-sm"
            >
              Start New Mock Interview
            </button>
          </div>
        </div>
      ) : null}

    </div>
  );
};
