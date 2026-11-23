import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Wrench, 
  Coins, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  Car, 
  Zap, 
  RotateCcw,
  Check
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Link } from 'react-router-dom';

export const AICoPilot: React.FC = () => {
  const { 
    chatMessages, 
    sendUserMessage, 
    isAiTyping, 
    activeVehicle 
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isAiTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isAiTyping) return;
    sendUserMessage(inputQuery.trim());
    setInputQuery('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendUserMessage(suggestion);
  };

  const promptSuggestions = [
    'Is my upcoming 30,000 km service estimate of ₹15,000 fair?',
    'Why is my XUV700 showing DPF soot alert P2463?',
    'Should I switch from Diesel to an EV or Hybrid for 1200 km/mo?',
    'How do I check pending Bangalore traffic e-challans online?',
    'What is the current fair market resale value of my car?',
    'Explain how to maintain healthy battery life on Tata Nexon EV',
  ];

  return (
    <div className="h-[calc(100vh-7.5rem)] flex flex-col space-y-4 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 p-0.5 shadow-glow-blue flex items-center justify-center">
            <div className="w-full h-full bg-dark-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                SphereAI Automotive Co-Pilot
              </h1>
              <Badge variant="electric" size="xs">
                Context: {activeVehicle.make} {activeVehicle.model}
              </Badge>
            </div>
            <p className="text-xs text-slate-400">
              Trained on Indian OEM service schedules, MoRTH Parivahan regulations, and OBD-II diagnostics
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Telematics Synced</span>
        </div>
      </div>

      {/* Main Chat Box Container */}
      <div className="flex-1 bg-dark-900 border border-slate-800 rounded-2xl shadow-card overflow-hidden flex flex-col">
        {/* Messages Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
          {chatMessages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                    isUser
                      ? 'bg-slate-200 text-slate-950'
                      : 'bg-gradient-to-tr from-sky-500 to-cyan-400 text-dark-950 shadow-glow-subtle'
                  }`}
                >
                  {isUser ? 'ME' : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className="space-y-2 max-w-[85%]">
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-cyan-500 text-slate-950 font-medium rounded-tr-none shadow-glow-subtle'
                        : 'bg-dark-850 border border-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Structured Data Attachment (if returned by AI) */}
                  {msg.structuredData && (
                    <div className="p-4 rounded-xl bg-dark-800/90 border border-cyan-500/30 space-y-3 shadow-glow-subtle">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                        <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          {msg.structuredData.title}
                        </span>
                        <Badge variant="electric" size="xs">
                          AutoSphere Verified
                        </Badge>
                      </div>

                      <div className="divide-y divide-slate-700/50 text-xs">
                        {msg.structuredData.items.map((item, idx) => (
                          <div key={idx} className="py-1.5 flex items-center justify-between">
                            <span className="text-slate-400">{item.label}</span>
                            <span className="font-semibold text-white font-mono">{item.value}</span>
                          </div>
                        ))}
                      </div>

                      {msg.structuredData.actionButton && (
                        <div className="pt-2">
                          <Link
                            to={msg.structuredData.actionButton.link}
                            className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                          >
                            <span>{msg.structuredData.actionButton.label}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Follow-up Suggestions Pills */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestions.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(s)}
                          className="text-[11px] px-2.5 py-1 rounded-full bg-dark-800 hover:bg-dark-750 border border-slate-700/60 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-all text-left"
                        >
                          💬 {s}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="text-[10px] text-slate-500 block px-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isAiTyping && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-dark-800 border border-slate-700 flex items-center justify-center text-cyan-400">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 rounded-2xl bg-dark-850 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <span>SphereAI is analyzing OEM parts telemetry...</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompt Carousel Bar */}
        <div className="px-4 py-2 border-t border-slate-800/60 bg-dark-950/40 overflow-x-auto flex gap-2 no-scrollbar">
          {promptSuggestions.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestionClick(p)}
              className="shrink-0 text-xs px-3 py-1.5 rounded-lg bg-dark-850 hover:bg-dark-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar Form */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-800 flex items-center gap-3 bg-dark-900">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={`Ask SphereAI anything about your ${activeVehicle.make} ${activeVehicle.model}, maintenance costs, FASTag, or buying advice...`}
            className="flex-1 bg-dark-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <Button
            type="submit"
            variant="primary"
            disabled={!inputQuery.trim() || isAiTyping}
            icon={<Send className="w-4 h-4" />}
          >
            Ask
          </Button>
        </form>
      </div>
    </div>
  );
};
