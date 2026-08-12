import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, UserProgress, SpokenEvaluation } from '../types.js';
import { evaluateSpokenTranscript, updateUserProgress } from '../services/api.js';
import { Mic, MicOff, Play, CheckCircle, RefreshCw, Sparkles, Volume2, Award, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SpokenPracticeProps {
  user: UserProfile;
  progress: UserProgress;
  onProgressUpdate: (progress: UserProgress) => void;
}

export const SpokenPracticeModule: React.FC<SpokenPracticeProps> = ({ user, progress, onProgressUpdate }) => {
  const [started, setStarted] = useState(false);
  const [topic, setTopic] = useState<'Self Introduction' | 'Daily Conversation' | 'Interview Speaking' | 'Grammar Practice' | 'Topic Speaking'>('Self Introduction');
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<SpokenEvaluation | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Web Speech API support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        let currentText = '';
        for (let i = 0; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript + ' ';
        }
        setTranscript(currentText.trim());
      };

      rec.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. You can type or paste your spoken text into the box below!');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setTranscript('');
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleEvaluate = async () => {
    if (!transcript.trim()) return;
    setEvaluating(true);
    setEvaluation(null);
    try {
      const res = await evaluateSpokenTranscript(transcript, topic, user.explanationLanguage || 'English');
      setEvaluation(res);

      if (res.overallScore >= 60) {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
      }

      // Update progress
      const progRes = await updateUserProgress(user.email, {
        speakingSessions: 1,
        xp: 30
      });
      onProgressUpdate(progRes.progress);
    } catch (err) {
      console.error('Spoken evaluation error:', err);
    } finally {
      setEvaluating(false);
    }
  };

  // FIRST-TIME CLEAN START WELCOME SCREEN
  if (!started) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-200/60">
            <Mic className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Welcome to Spoken & Communication Practice</h1>
            <p className="text-xs text-slate-500 mt-1">
              Practice speaking for campus interviews and get AI evaluation on grammar, vocabulary, clarity, and confidence.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-2">
          <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl space-y-1">
            <h3 className="text-xs font-bold text-indigo-700">🗣️ Self Introduction</h3>
            <p className="text-[11px] text-slate-600">Master your 60-second placement interview elevator pitch.</p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl space-y-1">
            <h3 className="text-xs font-bold text-cyan-700">💬 Daily Conversation</h3>
            <p className="text-[11px] text-slate-600">Improve fluency in professional tech discussions.</p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl space-y-1">
            <h3 className="text-xs font-bold text-emerald-700">🎯 Interview Speaking</h3>
            <p className="text-[11px] text-slate-600">Practice answering behavioral & situation-based HR questions.</p>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            Speaking Sessions: <strong className="text-indigo-600 font-bold">0</strong> • Communication Progress: <strong className="text-indigo-600 font-bold">0%</strong>
          </p>
          <button
            onClick={() => setStarted(true)}
            className="w-full sm:w-auto bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-sm uppercase tracking-wider"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Spoken Practice</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Topic selector */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <Mic className="w-5 h-5 text-indigo-600" />
          <span>Select Spoken Practice Topic</span>
        </h2>

        <div className="flex flex-wrap gap-2">
          {(['Self Introduction', 'Daily Conversation', 'Interview Speaking', 'Grammar Practice', 'Topic Speaking'] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTopic(t);
                setEvaluation(null);
                setTranscript('');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                topic === t
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Recording Box */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800">
            Speak into Microphone for: <strong className="text-indigo-600">{topic}</strong>
          </span>
          <span className="text-xs text-slate-500">Feedback language: {user.explanationLanguage}</span>
        </div>

        {/* Mic Control button */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
          <button
            onClick={toggleRecording}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-md ${
              isRecording 
                ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/40 ring-4 ring-rose-500/20' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30'
            }`}
          >
            {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
          </button>
          <p className="text-xs font-bold text-slate-700">
            {isRecording ? 'Listening... Speak clearly now' : 'Click microphone to start recording'}
          </p>
        </div>

        {/* Live Transcript text area */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">
            Speech Transcript (You can also edit or type directly):
          </label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={4}
            placeholder="Your spoken words will appear here in real time..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          onClick={handleEvaluate}
          disabled={evaluating || !transcript.trim()}
          className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-sm disabled:opacity-50 uppercase tracking-wider"
        >
          {evaluating ? 'AI Evaluating Speech...' : 'Analyze Grammar, Vocabulary & Confidence'}
        </button>
      </div>

      {/* Evaluation Result Report */}
      {evaluation && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <span>Spoken Evaluation Scorecard</span>
            </h3>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Overall: {evaluation.overallScore}/100
            </span>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-center">
              <p className="text-[10px] text-slate-500 uppercase font-bold">Grammar</p>
              <p className="text-base font-bold text-emerald-600">{evaluation.grammarScore}/100</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-center">
              <p className="text-[10px] text-slate-500 uppercase font-bold">Vocabulary</p>
              <p className="text-base font-bold text-cyan-600">{evaluation.vocabularyScore}/100</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-center">
              <p className="text-[10px] text-slate-500 uppercase font-bold">Clarity</p>
              <p className="text-base font-bold text-indigo-600">{evaluation.clarityScore}/100</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-center">
              <p className="text-[10px] text-slate-500 uppercase font-bold">Confidence</p>
              <p className="text-base font-bold text-amber-600">{evaluation.confidenceScore}/100</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-indigo-50 border border-indigo-200/80 p-4 rounded-xl">
              <strong className="text-indigo-900">General Feedback:</strong>
              <p className="text-slate-700 mt-1">{evaluation.generalFeedback}</p>
            </div>

            {evaluation.improvedVersion && (
              <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl">
                <strong className="text-emerald-700">Polished & Improved Expression:</strong>
                <p className="text-slate-800 mt-1 italic">"{evaluation.improvedVersion}"</p>
              </div>
            )}

            {evaluation.grammarFeedback && evaluation.grammarFeedback.length > 0 && (
              <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl space-y-1">
                <strong className="text-amber-700">Grammar Fixes:</strong>
                <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                  {evaluation.grammarFeedback.map((g, idx) => (
                    <li key={idx}>{g}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
