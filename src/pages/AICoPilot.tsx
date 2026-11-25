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
  Check,
  Copy,
  Trash2,
  RefreshCw,
  Info,
  CarFront,
  MessageSquare,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Link } from 'react-router-dom';
import { STARTER_PROMPTS } from '../services/aiAssistantService';

export const AICoPilot: React.FC = () => {
  const { 
    chatMessages, 
    sendUserMessage, 
    clearChatHistory,
    isAiTyping, 
    activeVehicle 
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isAiTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isAiTyping) return;
    const query = inputQuery.trim();
    setInputQuery('');
    sendUserMessage(query);
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (isAiTyping) return;
    sendUserMessage(suggestion);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleRetry = (msgContent: string) => {
    if (isAiTyping) return;
    // Find the nearest previous user query or use message content
    sendUserMessage(msgContent);
  };

  const handleClear = () => {
    clearChatHistory();
    setShowClearConfirm(false);
  };

  // Helper to format text with lightweight markdown bold, bullets & headings
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-bold text-white text-sm mt-2 mb-1 text-cyan-300">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const text = line.substring(2);
        return (
          <div key={idx} className="flex items-start gap-2 my-1">
            <span className="text-cyan-400 mt-1 shrink-0 text-xs">●</span>
            <span className="text-slate-200" dangerouslySetInnerHTML={{ __html: formatBold(text) }} />
          </div>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={idx} className="my-1 text-slate-200" dangerouslySetInnerHTML={{ __html: formatBold(line) }} />
        );
      }
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="my-0.5 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatBold(line) }} />
      );
    });
  };

  const formatBold = (str: string) => {
    return str.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
  };

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col space-y-3 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-600 to-indigo-600 p-0.5 shadow-glow-blue flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-dark-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                AutoSphere AI
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Automotive Intelligence: OEM maintenance schedules, RTO road taxes, TCO math, and Indian market catalogue
            </p>
          </div>
        </div>

        {/* Vehicle Telematics Context Pill & Clear History */}
        <div className="flex items-center gap-2 shrink-0">
          {activeVehicle && (
            <div className="px-3 py-1.5 rounded-xl bg-dark-900 border border-slate-800 flex items-center gap-2 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white">
                {activeVehicle.make} {activeVehicle.model}
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400 font-mono">{activeVehicle.city}</span>
            </div>
          )}

          {showClearConfirm ? (
            <div className="flex items-center gap-1.5 bg-rose-950/40 border border-rose-800/60 rounded-xl p-1 text-xs">
              <span className="text-rose-200 px-1 text-[11px]">Clear all?</span>
              <button
                onClick={handleClear}
                className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-[10px]"
              >
                Yes
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-2 py-1 bg-dark-800 hover:bg-dark-700 text-slate-300 rounded-lg text-[10px]"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowClearConfirm(true)}
              title="Clear Conversation History"
              className="p-2 rounded-xl bg-dark-900 hover:bg-dark-800 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Chat Box Container */}
      <div className="flex-1 bg-dark-900 border border-slate-800 rounded-2xl shadow-card overflow-hidden flex flex-col min-h-0">
        {/* Messages Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
          {chatMessages.length === 0 ? (
            <div className="py-12 text-center max-w-lg mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto shadow-glow-subtle">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white">Start a conversation with AutoSphere AI</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your connected co-pilot understands your active vehicle telemetry, periodic maintenance schedules, state-specific RTO taxes, and Indian car prices.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-left">
                {STARTER_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(p)}
                    className="p-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-white transition-all text-left flex items-start gap-2"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                    <span>{p}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            chatMessages.map((msg) => {
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
                        ? 'bg-slate-200 text-slate-950 font-mono shadow-sm'
                        : 'bg-gradient-to-tr from-cyan-500 to-indigo-600 text-dark-950 shadow-glow-subtle'
                    }`}
                  >
                    {isUser ? 'YOU' : <Bot className="w-4 h-4 text-white" />}
                  </div>

                  {/* Message Bubble */}
                  <div className="space-y-2 max-w-[88%] sm:max-w-[85%]">
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-cyan-500 text-slate-950 font-medium rounded-tr-none shadow-glow-subtle'
                          : 'bg-dark-850 border border-slate-800 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {renderFormattedContent(msg.content)}
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

                    {/* AI Message Action Strip: Copy & Retry */}
                    {!isUser && (
                      <div className="flex items-center gap-3 pt-0.5 text-[11px] text-slate-500">
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="hover:text-cyan-400 flex items-center gap-1 transition-colors"
                          title="Copy Response"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                        <span>•</span>
                        <span className="text-[10px] text-slate-500">
                          {msg.timestamp}
                        </span>
                      </div>
                    )}

                    {/* Follow-up Suggestions Pills */}
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.suggestions.map((s, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSuggestionClick(s)}
                            className="text-[11px] px-2.5 py-1 rounded-full bg-dark-800 hover:bg-dark-750 border border-slate-700/60 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-all text-left flex items-center gap-1"
                          >
                            <span>💬</span>
                            <span>{s}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {isUser && (
                      <span className="text-[10px] text-slate-500 block px-1 text-right">
                        {msg.timestamp}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {/* Typing Indicator */}
          {isAiTyping && (
            <div className="flex items-center gap-3 animate-in fade-in">
              <div className="w-8 h-8 rounded-lg bg-dark-800 border border-slate-700 flex items-center justify-center text-cyan-400 shadow-glow-subtle">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-dark-850 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                <span>AutoSphere AI is analyzing automotive intelligence...</span>
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

        {/* Suggested Starter Quick Prompts Bar */}
        <div className="px-4 py-2 border-t border-slate-800/60 bg-dark-950/60 overflow-x-auto flex gap-2 no-scrollbar">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold self-center shrink-0 pr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            Suggested:
          </span>
          {STARTER_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestionClick(p)}
              disabled={isAiTyping}
              className="shrink-0 text-xs px-3 py-1.5 rounded-lg bg-dark-850 hover:bg-dark-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar Form */}
        <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-slate-800 flex items-center gap-3 bg-dark-900 shrink-0">
          <input
            ref={inputRef}
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isAiTyping}
            placeholder={
              activeVehicle
                ? `Ask AutoSphere AI about your ${activeVehicle.make} ${activeVehicle.model}, maintenance, pricing, or replacements...`
                : 'Ask AutoSphere AI anything about car buying, costs, maintenance, or EV savings...'
            }
            className="flex-1 bg-dark-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50"
          />
          <Button
            type="submit"
            variant="primary"
            disabled={!inputQuery.trim() || isAiTyping}
            isLoading={isAiTyping}
            icon={<Send className="w-4 h-4" />}
          >
            Ask
          </Button>
        </form>
      </div>
    </div>
  );
};
