import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, ChatMessage } from '../types.js';
import { sendAICoachMessage } from '../services/api.js';
import { Bot, Send, Mic, MicOff, RefreshCw, User, Sparkles } from 'lucide-react';

interface AICoachProps {
  user: UserProfile;
}

export const AICoachModule: React.FC<AICoachProps> = ({ user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setInput(text);
        setIsListening(false);
      };

      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);

      recognitionRef.current = rec;
    }
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your query in the box below!');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInput('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const replyText = await sendAICoachMessage(query, messages, user, user.explanationLanguage || 'English');
      const aiMsg: ChatMessage = {
        id: 'msg_' + (Date.now() + 1),
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('AI Coach error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl flex flex-col h-[650px] overflow-hidden shadow-sm">
      
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200/60 flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
              <span>PlaceMate AI Coach</span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            </h2>
            <p className="text-[10px] text-slate-500 font-medium">
              Personal placement mentor • Responding in {user.explanationLanguage}
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages([])}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          title="Clear Chat"
        >
          Clear History
        </button>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
        
        {/* Welcome message if empty */}
        {messages.length === 0 && (
          <div className="bg-white border border-slate-200 p-6 rounded-2xl text-center space-y-4 my-auto max-w-lg mx-auto mt-8 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center border border-indigo-100">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Hi, {user.fullName}! I'm your AI Placement Coach.</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ask me anything about Aptitude, DSA, Programming in {user.programmingLanguage}, Spoken Practice, Mock Interviews, or target company preparation for {user.targetCompany}.
            </p>

            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {[
                `How should I prepare for ${user.targetCompany}?`,
                `Explain Time & Work logic simply`,
                `Indha Python code yen error varudhu?`,
                `Tips for HR interview self introduction`
              ].map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(sample)}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs px-3 py-1.5 rounded-xl border border-slate-200 transition-all text-left font-medium"
                >
                  "{sample}"
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start space-x-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'ai' && (
              <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-[80%] rounded-2xl p-4 text-xs space-y-1 ${
              m.sender === 'user'
                ? 'bg-slate-900 text-white rounded-tr-none font-medium'
                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none whitespace-pre-line leading-relaxed shadow-xs'
            }`}>
              <p>{m.text}</p>
              <p className={`text-[9px] text-right ${m.sender === 'user' ? 'text-slate-400' : 'text-slate-400'}`}>
                {m.timestamp}
              </p>
            </div>

            {m.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-3 text-slate-500 text-xs italic">
            <RefreshCw className="w-4 h-4 animate-spin text-cyan-600" />
            <span>AI Coach is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Footer */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
        <button
          onClick={toggleMic}
          className={`p-2.5 rounded-xl transition-all ${
            isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          title="Voice Input"
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Ask AI Coach in ${user.explanationLanguage} (e.g. Tamil, Tanglish, English)...`}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-cyan-600 font-medium"
        />

        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="bg-slate-900 hover:bg-cyan-700 text-white p-2.5 rounded-xl transition-all disabled:opacity-50 shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
