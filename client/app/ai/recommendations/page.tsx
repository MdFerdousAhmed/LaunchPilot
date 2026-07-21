'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { useAuth } from '../../providers';
import Link from 'next/link';
import {
  Sparkles,
  Brain,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  ChevronRight,
  Loader2,
  Target,
  Filter,
  Star,
  Zap,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  X,
} from 'lucide-react';
import { apiRequest } from '../../../utils/api';
import { LISTING_CARDS } from '../../data/listings';

interface Recommendation {
  moduleId: string;
  title: string;
  reason: string;
  confidence: number;
  priority: string;
}

interface FeedbackItem {
  moduleId: string;
  action: 'accepted' | 'rejected';
}

const INDUSTRIES = [
  'SaaS', 'E-commerce', 'FinTech', 'HealthTech', 'EdTech', 'AI / Machine Learning',
  'MarketPlace', 'Social Media', 'Developer Tools', 'Gaming', 'IoT', 'CleanTech', 'Other',
];

const PRIORITY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  Critical: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
  High: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  Medium: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  Low: { bg: 'bg-zinc-500/10', text: 'text-zinc-400', border: 'border-zinc-500/20' },
};

const FEEDBACK_KEY = 'lp_recommendation_feedback';

export default function RecommendationsPage() {
  const { currentProject } = useAuth();

  const [description, setDescription] = useState('');
  const [industry, setIndustry] = useState('SaaS');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterPrice, setFilterPrice] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // Sync with MongoDB project context when loaded
  useEffect(() => {
    if (currentProject) {
      if (currentProject.description) setDescription(currentProject.description);
      if (currentProject.industry) setIndustry(currentProject.industry);
    }
  }, [currentProject]);

  // Load persisted feedback from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(FEEDBACK_KEY);
      if (stored) setFeedback(JSON.parse(stored));
    } catch {}
  }, []);

  const saveFeedback = (updated: FeedbackItem[]) => {
    setFeedback(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(FEEDBACK_KEY, JSON.stringify(updated));
    }
  };

  const handleGenerate = async () => {
    const descToUse = description.trim() || currentProject?.description || 'AI Powered SaaS Startup platform';
    setLoading(true);
    setHasGenerated(true);
    try {
      const moduleSummaries = LISTING_CARDS.map((m) => ({
        id: m.id,
        title: m.title,
        desc: m.desc,
        category: m.category,
        price: m.price,
      }));

      const res = await apiRequest<{ recommendations: Recommendation[] }>('/ai/recommendations', {
        method: 'POST',
        body: JSON.stringify({
          startupDescription: descToUse,
          industry,
          availableModules: moduleSummaries,
          feedbackHistory: feedback,
        }),
      });
      setRecommendations(res.recommendations);
    } catch (err) {
      console.error('Error generating recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = (moduleId: string, action: 'accepted' | 'rejected') => {
    const updated = feedback.filter((f) => f.moduleId !== moduleId);
    updated.push({ moduleId, action });
    saveFeedback(updated);
  };

  const handleClearFeedback = () => {
    saveFeedback([]);
  };

  const getFeedbackForModule = (moduleId: string): 'accepted' | 'rejected' | null => {
    const item = feedback.find((f) => f.moduleId === moduleId);
    return item ? item.action : null;
  };

  const getModuleDetails = (moduleId: string) => {
    return LISTING_CARDS.find((m) => m.id === moduleId);
  };

  const filteredRecs = recommendations.filter((rec) => {
    const mod = getModuleDetails(rec.moduleId);
    if (!mod) return true;
    if (filterCategory !== 'All' && mod.category !== filterCategory) return false;
    if (filterPrice !== 'All' && mod.price !== filterPrice) return false;
    return true;
  });

  const categories = ['All', ...new Set(LISTING_CARDS.map((m) => m.category))];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-400 animate-pulse" /> AI Recommendation Engine
            </h1>
            <p className="text-zinc-400 text-xs md:text-sm mt-1">
              Personalized LaunchPilot module recommendations for <strong>{currentProject?.name || 'your startup'}</strong> based on Gemini AI analysis.
            </p>
          </div>
        </div>

        {/* Input Form Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" /> Startup Context
              </h2>
              <p className="text-[11px] text-zinc-500">Provide details or use your active project profile.</p>
            </div>
            {currentProject && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-semibold self-start sm:self-center">
                <CheckCircle2 className="w-3.5 h-3.5" /> Synced: <span className="text-white">{currentProject.name}</span>
              </div>
            )}
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400">Startup Description</label>
              <textarea
                rows={3}
                placeholder="Describe your startup solution, target market, and goals..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400">Industry</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>

              {feedback.length > 0 && (
                <div className="mt-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Feedback Memory</span>
                    <button onClick={handleClearFeedback} className="text-[9px] text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">Clear</button>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-zinc-400">
                    <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3 text-emerald-400" /> {feedback.filter(f => f.action === 'accepted').length} Accepted</span>
                    <span className="flex items-center gap-1"><ThumbsDown className="w-3 h-3 text-rose-400" /> {feedback.filter(f => f.action === 'rejected').length} Rejected</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-bold py-3 px-6 rounded-xl shadow-lg transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing Context...</>
              ) : (
                <><Brain className="w-4 h-4" /> Get AI Recommendations</>
              )}
            </button>
            {hasGenerated && !loading && (
              <button
                onClick={handleGenerate}
                className="flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 text-sm font-semibold py-3 px-5 rounded-xl transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" /> Refine Recommendations
              </button>
            )}
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Brain className="w-8 h-8 text-purple-400 animate-pulse" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-white">Analyzing startup requirements...</p>
              <p className="text-[10px] text-zinc-500 mt-1">Matching against platform modules</p>
            </div>
            <div className="w-48 h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-850">
              <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-pulse w-2/3" />
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && hasGenerated && recommendations.length > 0 && (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-bold text-white">{recommendations.length} Recommendations</span>
                <span className="text-[9px] px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-full font-bold border border-purple-500/20">
                  AI-Ranked
                </span>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs font-semibold text-zinc-400 transition-all cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5" /> Filters
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {showFilters && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-wrap gap-4 items-center">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Category</label>
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                          filterCategory === cat
                            ? 'bg-indigo-600 text-white'
                            : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                {(filterCategory !== 'All' || filterPrice !== 'All') && (
                  <button
                    onClick={() => { setFilterCategory('All'); setFilterPrice('All'); }}
                    className="flex items-center gap-1 px-2.5 py-1 text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" /> Clear Filters
                  </button>
                )}
              </div>
            )}

            <div className="space-y-4">
              {filteredRecs.map((rec, idx) => {
                const mod = getModuleDetails(rec.moduleId);
                const fb = getFeedbackForModule(rec.moduleId);
                const priorityStyle = PRIORITY_STYLES[rec.priority] || PRIORITY_STYLES.Medium;
                const confidencePct = Math.round(rec.confidence * 100);
                const Icon = mod?.icon || Zap;

                return (
                  <div
                    key={rec.moduleId}
                    className={`bg-zinc-900 border rounded-2xl p-5 sm:p-6 transition-all ${
                      fb === 'accepted'
                        ? 'border-emerald-500/30'
                        : fb === 'rejected'
                        ? 'border-rose-500/20 opacity-60'
                        : 'border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
                      <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:gap-2 shrink-0">
                        <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-850 flex items-center justify-center text-xs font-black text-zinc-400">
                          #{idx + 1}
                        </div>
                        {mod && (
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${mod.gradient} flex items-center justify-center`}>
                            <Icon className={`w-5 h-5 ${mod.iconColor}`} />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-white">{rec.title}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border}`}>
                            {rec.priority}
                          </span>
                          {mod && (
                            <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-800 rounded-full text-[9px] font-medium text-zinc-400 uppercase tracking-wider">
                              {mod.category}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-zinc-400 leading-relaxed">{rec.reason}</p>

                        <div className="flex items-center gap-3">
                          <div className="flex-1 max-w-[200px] h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-850">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                confidencePct >= 85 ? 'bg-emerald-500' : confidencePct >= 70 ? 'bg-blue-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${confidencePct}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-zinc-400 tabular-nums">{confidencePct}% match</span>
                          {mod && (
                            <span className="flex items-center gap-0.5 text-[10px] text-zinc-500">
                              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" /> {mod.rating}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex sm:flex-col gap-2 shrink-0">
                        <button
                          onClick={() => handleFeedback(rec.moduleId, 'accepted')}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                            fb === 'accepted'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-zinc-950 hover:bg-emerald-500/20 text-zinc-400 hover:text-emerald-400 border border-zinc-800'
                          }`}
                        >
                          <ThumbsUp className="w-3 h-3" /> {fb === 'accepted' ? 'Accepted' : 'Accept'}
                        </button>
                        <button
                          onClick={() => handleFeedback(rec.moduleId, 'rejected')}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                            fb === 'rejected'
                              ? 'bg-rose-600 text-white'
                              : 'bg-zinc-950 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-zinc-800'
                          }`}
                        >
                          <ThumbsDown className="w-3 h-3" /> {fb === 'rejected' ? 'Rejected' : 'Reject'}
                        </button>
                        {mod && (
                          <Link
                            href={mod.href}
                            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white text-[10px] font-semibold transition-all text-center justify-center"
                          >
                            Launch <ChevronRight className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {!loading && hasGenerated && recommendations.length === 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center space-y-3">
            <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
            <p className="text-sm font-bold text-white">Could not generate recommendations</p>
            <p className="text-xs text-zinc-400">Please check your network connection and try again.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
