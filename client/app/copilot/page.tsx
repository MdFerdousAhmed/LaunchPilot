'use client';

import React, { useEffect, useState, useRef } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../providers';
import { apiRequest } from '../../utils/api';
import { Sparkles, Send, Bot, User, Code } from 'lucide-react';

interface ChatMessage {
  _id?: string;
  sender: 'user' | 'assistant';
  text: string;
  createdAt?: string;
}

const SUGGESTIONS = [
  'How do I price my product?',
  'Draft high-converting Twitter hook copy',
  'Define target audience profiles',
  'Plan standard Product Hunt launch day checklist'
];

export default function CopilotPage() {
  const { currentProject } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingHistory, setFetchingHistory] = useState(true);
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
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || !currentProject || loading) return;
    setLoading(true);
    
    // Add user message to UI immediately for response responsiveness
    const tempUserMsg: ChatMessage = { sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, tempUserMsg]);
    setInput('');

    try {
      const res = await apiRequest('/copilot/chat', {
        method: 'POST',
        body: JSON.stringify({
          projectId: currentProject._id,
          text: textToSend
        })
      });

      // Update message with matching Mongo object data and append AI response
      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg !== tempUserMsg);
        return [...filtered, res.userMessage, res.copilotMessage];
      });
    } catch (err) {
      console.error('Error in AI Copilot chat:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format text with linebreaks and bold blocks
  const renderMessageText = (text: string) => {
    // Simple parser for markdown-like formatting (bold ** and code blocks)
    return text.split('\n').map((line, idx) => {
      let content: React.ReactNode = line;
      
      // Parse bolding
      if (line.includes('**')) {
        const parts = line.split('**');
        content = parts.map((part, i) => (i % 2 === 1 ? <strong key={i} className="text-white font-bold">{part}</strong> : part));
      }
      
      // Parse list bullet points
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

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)] min-h-[400px]">
        {/* Chat Title */}
        <div className="pb-4 border-b border-zinc-900 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" /> AI Startup Copilot
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Ask Gemini strategy, copywriting, legal structures, or pitch preparation questions.
            </p>
          </div>
        </div>

        {/* Message Panel */}
        <div className="flex-1 overflow-y-auto py-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800">
          {fetchingHistory ? (
            <div className="space-y-4">
              <div className="h-10 bg-zinc-900 animate-pulse rounded-lg max-w-sm"></div>
              <div className="h-16 bg-zinc-900 animate-pulse rounded-lg max-w-md ml-auto"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center space-y-6 py-12">
              <div className="w-14 h-14 bg-indigo-600/10 text-indigo-400 rounded-2xl flex items-center justify-center border border-indigo-500/10">
                <Bot className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Startup Copilot Initialized</h3>
                <p className="text-zinc-500 text-xs mt-1.5 leading-relaxed">
                  I have analyzed your business: <strong>{currentProject?.name}</strong>. Ask me anything, or pick one of these templates to start:
                </p>
              </div>

              {/* Suggestions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
                {SUGGESTIONS.map((sug) => (
                  <button
                    key={sug}
                    onClick={() => handleSendMessage(sug)}
                    className="text-left p-3.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-750 rounded-xl text-xs text-zinc-300 transition-all font-medium cursor-pointer"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Intro message */}
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="flex-1 bg-zinc-900 border border-zinc-850 px-4 py-3.5 rounded-2xl text-sm leading-relaxed max-w-2xl text-zinc-300">
                  Hi founder! I&apos;m ready to refine <strong>{currentProject?.name}</strong> with you. Ask me to write code, review features, draft copy, or detail launch plans.
                </div>
              </div>

              {messages.map((msg, index) => {
                const isUser = msg.sender === 'user';
                return (
                  <div key={index} className={`flex items-start gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                        isUser
                          ? 'bg-blue-600/10 border-blue-500/20 text-blue-400'
                          : 'bg-indigo-600/10 border-indigo-500/20 text-indigo-400'
                      }`}
                    >
                      {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                    </div>
                    <div
                      className={`flex-1 px-4 py-3.5 rounded-2xl text-sm leading-relaxed max-w-2xl border ${
                        isUser
                          ? 'bg-zinc-950 border-zinc-800 text-zinc-200'
                          : 'bg-zinc-900 border-zinc-850 text-zinc-300 space-y-1.5'
                      }`}
                    >
                      {isUser ? msg.text : renderMessageText(msg.text)}
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {loading && (
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="bg-zinc-900 border border-zinc-850 px-4 py-3.5 rounded-2xl flex items-center gap-1.5 py-4">
                    <div className="w-2.5 h-2.5 bg-zinc-500 rounded-full animate-bounce"></div>
                    <div className="w-2.5 h-2.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2.5 h-2.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-4 border-t border-zinc-900 bg-zinc-950">
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
              placeholder="Ask anything or generate launch ideas..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-4 pr-12 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 placeholder-zinc-500 disabled:opacity-50"
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
