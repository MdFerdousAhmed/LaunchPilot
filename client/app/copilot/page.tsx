'use client';

import React, { useEffect, useState, useRef } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../providers';
import { apiRequest } from '../../utils/api';
import Link from 'next/link';
import {
  Sparkles,
  Send,
  Bot,
  User,
  CheckCircle2,
  Globe,
  TrendingUp,
  FileText,
  Layers,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Loader2,
  Zap,
  ShieldAlert
} from 'lucide-react';

interface ChatMessage {
  _id?: string;
  sender: 'user' | 'assistant';
  text: string;
  actionType?: 'GENERATE_TASKS' | 'GENERATE_LANDING_PAGE' | 'GENERATE_PITCH_DECK' | 'ANALYZE_COMPETITOR' | 'GENERATE_CONTENT' | 'NONE';
  actionData?: any;
  createdAt?: string;
}

const AGENT_SKILLS = [
  {
    id: 'GENERATE_TASKS',
    label: '⚡ Auto-Generate 10 Launch Tasks',
    prompt: 'Generate 10 crucial launch tasks and milestones for my startup',
    icon: CheckCircle2,
    color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20'
  },
  {
    id: 'GENERATE_LANDING_PAGE',
    label: '🎨 Build AI Landing Page',
    prompt: 'Build a modern dark-theme landing page with waitlist form for my startup',
    icon: Globe,
    color: 'text-blue-400 border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20'
  },
  {
    id: 'GENERATE_PITCH_DECK',
    label: '📊 Draft 10-Slide Pitch Deck',
    prompt: 'Draft a 10-slide investor pitch deck outline for my startup',
    icon: Layers,
    color: 'text-purple-400 border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20'
  },
  {
    id: 'ANALYZE_COMPETITOR',
    label: '🔍 Audit Competitor Strategy',
    prompt: 'Conduct an AI SWOT analysis and threat score audit for competitor',
    icon: TrendingUp,
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20'
  },
  {
    id: 'GENERATE_CONTENT',
    label: '✍️ Draft Launch Marketing Copy',
    prompt: 'Write a high-converting blog post and marketing thread about our launch',
    icon: FileText,
    color: 'text-amber-400 border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20'
  }
];

export default function CopilotPage() {
  const { currentProject } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingHistory, setFetchingHistory] = useState(true);
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState<Record<number, number>>({});
  const chatEndRef = useRef<HTMLDivElement>(null);

  const fetchChatHistory = async () => {
    if (!currentProject) return;
    setFetchingHistory(true);
    try {
      const data = await apiRequest<ChatMessage[]>(`/copilot/chat?projectId=${currentProject._id}`);
      setMessages(data);
    } catch (err) {
      console.error('Error fetching chat history:', err);
    } finally {
      setFetchingHistory(false);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, [currentProject]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, activeStep]);

  const handleSendMessage = async (textToSend: string, requestedActionType: string = 'NONE', actionPayload: any = null) => {
    if (!textToSend.trim() || !currentProject || loading) return;
    setLoading(true);
    
    // Add user message to UI immediately
    const tempUserMsg: ChatMessage = { sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, tempUserMsg]);
    setInput('');

    // Simulate real-time agent execution pipeline steps
    setActiveStep('Analyzing project context & parameters...');
    setTimeout(() => {
      setActiveStep('Invoking Gemini AI Agent reasoning engine...');
    }, 600);
    setTimeout(() => {
      setActiveStep('Executing tool & persisting to database...');
    }, 1400);

    try {
      const res = await apiRequest<{ userMessage: ChatMessage; copilotMessage: ChatMessage }>('/copilot/chat', {
        method: 'POST',
        body: JSON.stringify({
          projectId: currentProject._id,
          text: textToSend,
          requestedActionType,
          actionPayload
        })
      });

      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg !== tempUserMsg);
        return [...filtered, res.userMessage, res.copilotMessage];
      });
    } catch (err) {
      console.error('Error in AI Copilot agent chat:', err);
    } finally {
      setLoading(false);
      setActiveStep(null);
    }
  };

  const handleCopyText = (text: string, msgIndex: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(msgIndex);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Helper to parse markdown-like text formatting
  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, idx) => {
      let content: React.ReactNode = line;
      
      if (line.includes('**')) {
        const parts = line.split('**');
        content = parts.map((part, i) => (i % 2 === 1 ? <strong key={i} className="text-white font-bold">{part}</strong> : part));
      }
      
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-zinc-300 py-0.5">
            {line.substring(2)}
          </li>
        );
      }

      return (
        <p key={idx} className="min-h-[1rem] text-zinc-300">
          {content}
        </p>
      );
    });
  };

  // Render Agentic Action Cards
  const renderActionCard = (msg: ChatMessage, msgIndex: number) => {
    if (!msg.actionType || msg.actionType === 'NONE' || !msg.actionData) return null;

    switch (msg.actionType) {
      case 'GENERATE_TASKS': {
        const tasks = msg.actionData.tasks || [];
        return (
          <div className="mt-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" /> Launch Tasks Generated ({tasks.length})
              </div>
              <Link
                href="/tasks"
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20 transition-all"
              >
                Open Task Manager <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
              {tasks.map((task: any, i: number) => (
                <div key={i} className="p-3 bg-zinc-950 rounded-xl border border-zinc-850 flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-zinc-200 block">{task.title}</span>
                    <span className="text-[11px] text-zinc-400 block line-clamp-1">{task.description}</span>
                  </div>
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-zinc-900 text-indigo-300 rounded border border-zinc-800 shrink-0">
                    {task.category || 'General'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case 'GENERATE_LANDING_PAGE': {
        const page = msg.actionData.landingPage;
        return (
          <div className="mt-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                <Globe className="w-5 h-5" /> AI Landing Page Built
              </div>
              <Link
                href="/landing-page"
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 transition-all"
              >
                Customize Page <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-850 space-y-2">
              <span className="text-xs font-bold text-white block">{page?.title || 'Landing Page Draft'}</span>
              <p className="text-xs text-zinc-400 italic">Prompt: "{page?.prompt}"</p>
              <div className="flex items-center gap-2 text-[11px] text-emerald-400 pt-1">
                <Check className="w-3.5 h-3.5" /> Includes Hero Section, Value Props, Waitlist Form, & CSS Variables
              </div>
            </div>
          </div>
        );
      }

      case 'GENERATE_PITCH_DECK': {
        const slides = msg.actionData.slides || [];
        const currentSlide = activeSlideIndex[msgIndex] || 0;

        return (
          <div className="mt-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <Layers className="w-5 h-5" /> 10-Slide Pitch Deck
              </div>
              <Link
                href="/pitch-deck"
                className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20 transition-all"
              >
                View Full Deck <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {slides.length > 0 && (
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-850 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-purple-400">
                    Slide {currentSlide + 1} of {slides.length}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      disabled={currentSlide === 0}
                      onClick={() => setActiveSlideIndex((prev) => ({ ...prev, [msgIndex]: currentSlide - 1 }))}
                      className="p-1 text-zinc-400 hover:text-white disabled:opacity-30 bg-zinc-900 rounded border border-zinc-800"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      disabled={currentSlide === slides.length - 1}
                      onClick={() => setActiveSlideIndex((prev) => ({ ...prev, [msgIndex]: currentSlide + 1 }))}
                      className="p-1 text-zinc-400 hover:text-white disabled:opacity-30 bg-zinc-900 rounded border border-zinc-800"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white mb-2">{slides[currentSlide]?.title}</h4>
                  <ul className="space-y-1.5">
                    {slides[currentSlide]?.bullets?.map((bullet: string, bIdx: number) => (
                      <li key={bIdx} className="text-xs text-zinc-300 flex items-start gap-2">
                        <span className="text-purple-400 font-bold">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        );
      }

      case 'ANALYZE_COMPETITOR': {
        const comp = msg.actionData.competitor;
        return (
          <div className="mt-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <TrendingUp className="w-5 h-5" /> Competitor Audit: {comp?.name}
              </div>
              <Link
                href="/competitor"
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 transition-all"
              >
                View Matrix <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-850">
                <span className="text-xs font-bold text-emerald-400 block mb-1.5">Strengths</span>
                <ul className="space-y-1 text-[11px] text-zinc-300 list-disc pl-3">
                  {comp?.strengths?.map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-850">
                <span className="text-xs font-bold text-rose-400 block mb-1.5">Weaknesses</span>
                <ul className="space-y-1 text-[11px] text-zinc-300 list-disc pl-3">
                  {comp?.weaknesses?.map((w: string, i: number) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>

            {comp?.score && (
              <div className="flex items-center justify-between bg-zinc-950 px-4 py-2.5 rounded-xl border border-zinc-850 text-xs">
                <span className="text-zinc-400 font-medium">Threat Rating</span>
                <span className="font-extrabold text-amber-400 px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-md">
                  {comp.score} / 10
                </span>
              </div>
            )}
          </div>
        );
      }

      case 'GENERATE_CONTENT': {
        const content = msg.actionData.content;
        return (
          <div className="mt-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <FileText className="w-5 h-5" /> Generated Copy
              </div>
              <button
                onClick={() => handleCopyText(content, msgIndex)}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 transition-all cursor-pointer"
              >
                {copiedIndex === msgIndex ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedIndex === msgIndex ? 'Copied!' : 'Copy Copy'}
              </button>
            </div>

            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-850 max-h-60 overflow-y-auto text-xs text-zinc-300 space-y-2 whitespace-pre-wrap font-mono">
              {content}
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)] min-h-[500px] space-y-4">
        {/* Top Agent Header */}
        <div className="pb-4 border-b border-zinc-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2.5">
              <Sparkles className="w-7 h-7 text-indigo-400 animate-pulse" /> AI Startup Copilot Agent
            </h1>
            <p className="text-zinc-400 text-xs md:text-sm mt-1">
              Autonomous strategy & execution agent for <strong>{currentProject?.name || 'your startup'}</strong>. Trigger agent tasks, build landing pages, draft decks, & create milestones.
            </p>
          </div>
        </div>

        {/* Agent Skill Chips Toolbar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {AGENT_SKILLS.map((skill) => (
            <button
              key={skill.id}
              disabled={loading || !currentProject}
              onClick={() => handleSendMessage(skill.prompt, skill.id)}
              className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${skill.color} disabled:opacity-40`}
            >
              <skill.icon className="w-4 h-4" />
              <span>{skill.label}</span>
            </button>
          ))}
        </div>

        {/* Message Panel */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800">
          {fetchingHistory ? (
            <div className="space-y-4">
              <div className="h-12 bg-zinc-900 animate-pulse rounded-2xl max-w-sm"></div>
              <div className="h-20 bg-zinc-900 animate-pulse rounded-2xl max-w-md ml-auto"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto text-center space-y-6 py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 text-indigo-400 rounded-2xl flex items-center justify-center border border-indigo-500/20 shadow-xl">
                <Bot className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Startup Copilot Agent Ready</h3>
                <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                  I can automatically execute launch routines for <strong>{currentProject?.name}</strong>. Select an agent skill above or type instructions below to generate tasks, pages, or deck slides.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Agent Intro Greeting */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="flex-1 bg-zinc-900 border border-zinc-800 p-5 rounded-2xl text-sm leading-relaxed max-w-2xl text-zinc-300">
                  Welcome! I&apos;m your <strong>LaunchPilot Copilot Agent</strong>. Tell me what you need for <strong>{currentProject?.name}</strong> — whether it&apos;s auto-generating launch tasks, creating landing page layouts, drafting pitch decks, or auditing competitors.
                </div>
              </div>

              {messages.map((msg, index) => {
                const isUser = msg.sender === 'user';
                return (
                  <div key={index} className={`flex items-start gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-md ${
                        isUser
                          ? 'bg-blue-600/10 border-blue-500/20 text-blue-400'
                          : 'bg-indigo-600/10 border-indigo-500/20 text-indigo-400'
                      }`}
                    >
                      {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 max-w-2xl">
                      <div
                        className={`p-5 rounded-2xl text-sm leading-relaxed border ${
                          isUser
                            ? 'bg-zinc-950 border-zinc-800 text-zinc-200'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-300 space-y-1.5'
                        }`}
                      >
                        {isUser ? msg.text : renderFormattedText(msg.text)}
                      </div>

                      {/* Render Interactive Action Card if present */}
                      {!isUser && renderActionCard(msg, index)}
                    </div>
                  </div>
                );
              })}

              {/* Execution Feedback Indicator */}
              {loading && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                    <Zap className="w-5 h-5 animate-pulse text-indigo-400" />
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-2.5 max-w-md">
                    <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{activeStep || 'Agent thinking & executing tools...'}</span>
                    </div>
                    <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-850">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full w-2/3 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-3 border-t border-zinc-900 bg-zinc-950">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className="relative flex items-center"
          >
            <input
              type="text"
              disabled={loading || !currentProject}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything or request agent actions (e.g., 'Build a landing page')..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-4 pr-12 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 placeholder-zinc-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-3 p-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-lg text-white disabled:opacity-40 transition-all cursor-pointer shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
