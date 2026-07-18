'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Rocket,
  Sparkles,
  Brain,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  ChevronRight,
  Loader2,
  Target,
  Search,
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
import { useAuth } from '../../providers';

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
      setDescription(currentProject.description || '');
      setIndustry(currentProject.industry || 'SaaS');
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
    if (!description.trim()) return;
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
          startupDescription: description,
          industry,
          availableModules: moduleSummaries,
          feedbackHistory: feedback,
        }),
      });
      setRecommendations(res.recommendations);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = (moduleId: string, action: 'accepted' | 'rejected') => {
    const updated = feedback.filter((f) => f.moduleId !== moduleId);
    updated.push({ moduleId, action });
    saveFeedback(updated);
  };

  const handleRefine = () => {
    handleGenerate();
  };

  const handleClearFeedback = () => {
    saveFeedback([]);
  };

  const getFeedbackForModule = (moduleId: string): 'accepted' | 'rejected' | null => {
    const item = feedback.find((f) => f.moduleId === moduleId);
    return item ? item.action : null;
  };

  // Resolve module details from LISTING_CARDS
  const getModuleDetails = (moduleId: string) => {
    return LISTING_CARDS.find((m) => m.id === moduleId);
  };

  // Filter recommendations
  const filteredRecs = recommendations.filter((rec) => {
    const mod = getModuleDetails(rec.moduleId);
    if (!mod) return true;
    if (filterCategory !== 'All' && mod.category !== filterCategory) return false;
    if (filterPrice !== 'All' && mod.price !== filterPrice) return false;
    return true;
  });

  const categories = ['All', ...new Set(LISTING_CARDS.map((m) => m.category))];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 overflow-x-hidden">
      {/* ── NAVBAR ───────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
              LaunchPilot
            </span>
          </Link>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-zinc-400">
            <Link href="/modules" className="hover:text-white transition-colors">Explore</Link>
            <Link href="/ai/content" className="hover:text-white transition-colors">AI Content</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/login" className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white text-xs font-semibold transition-all">
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative pt-16 pb-10 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[280px] bg-purple-600/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-semibold">
            <Brain className="w-3.5 h-3.5" /> AI Recommendation Engine
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Modules{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              tailored to you
            </span>
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-lg mx-auto">
            Describe your startup and let our AI analyze your needs to recommend the most impactful
            LaunchPilot modules \u2014 ranked by confidence and priority.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-8">
        {/* ── INPUT SECTION ──────────────────────────────── */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" /> Describe Your Startup
              </h2>
              <p className="text-[10px] text-zinc-500">Provide a description and industry so the AI can match you with the right modules.</p>
            </div>
            {currentProject && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-semibold self-start sm:self-center">
                <CheckCircle2 className="w-3.5 h-3.5" /> Synced with MongoDB: <span className="text-white">{currentProject.name}</span>
              </div>
            )}
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400">Startup Description *</label>
              <textarea
                rows={4}
                placeholder="e.g., We are building an AI-powered fitness coaching app that creates personalized workout plans based on user biometrics and goals..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/50 transition-all resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400">Industry *</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>

              {/* Feedback indicator */}
              {feedback.length > 0 && (
                <div className="mt-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Feedback History</span>
                    <button onClick={handleClearFeedback} className="text-[9px] text-zinc-500 hover:text-zinc-300 transition-colors">Clear</button>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                    <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3 text-emerald-400" /> {feedback.filter(f => f.action === 'accepted').length}</span>
                    <span className="flex items-center gap-1"><ThumbsDown className="w-3 h-3 text-rose-400" /> {feedback.filter(f => f.action === 'rejected').length}</span>
                  </div>
                  <p className="text-[9px] text-zinc-500">AI uses your feedback to refine future picks.</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleGenerate}
              disabled={loading || !description.trim()}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-bold py-3 px-6 rounded-xl shadow-lg transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
              ) : (
                <><Brain className="w-4 h-4" /> Get AI Recommendations</>
              )}
            </button>
            {hasGenerated && !loading && (
              <button
                onClick={handleRefine}
                className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-sm font-semibold py-3 px-5 rounded-xl transition-all"
              >
                <RefreshCw className="w-4 h-4" /> Refine with Feedback
              </button>
            )}
          </div>
        </div>

        {/* ── RESULTS SECTION ────────────────────────────── */}
        {loading && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Brain className="w-8 h-8 text-purple-400 animate-pulse" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-white">Analyzing your startup...</p>
              <p className="text-[10px] text-zinc-500 mt-1">Matching against {LISTING_CARDS.length} platform modules</p>
            </div>
            <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-pulse w-2/3" />
            </div>
          </div>
        )}

        {!loading && hasGenerated && recommendations.length > 0 && (
          <>
            {/* Filter bar */}
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
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 rounded-xl text-xs font-semibold text-zinc-400 transition-all"
              >
                <Filter className="w-3 h-3" /> Filters
                <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
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
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                          filterCategory === cat
                            ? 'bg-indigo-600 text-white'
                            : 'bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Price</label>
                  <div className="flex gap-1.5">
                    {['All', 'Free', 'Premium'].map((p) => (
                      <button
                        key={p}
                        onClick={() => setFilterPrice(p)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                          filterPrice === p
                            ? 'bg-indigo-600 text-white'
                            : 'bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                {(filterCategory !== 'All' || filterPrice !== 'All') && (
                  <button
                    onClick={() => { setFilterCategory('All'); setFilterPrice('All'); }}
                    className="flex items-center gap-1 px-2.5 py-1 text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    <X className="w-3 h-3" /> Clear Filters
                  </button>
                )}
              </div>
            )}

            {/* Recommendation cards */}
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
                    className={`bg-zinc-900 border rounded-2xl p-5 sm:p-6 transition-all hover:shadow-xl hover:shadow-zinc-950/50 ${
                      fb === 'accepted'
                        ? 'border-emerald-500/30'
                        : fb === 'rejected'
                        ? 'border-rose-500/20 opacity-60'
                        : 'border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
                      {/* Rank + Icon */}
                      <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:gap-2 shrink-0">
                        <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-black text-zinc-400">
                          #{idx + 1}
                        </div>
                        {mod && (
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${mod.gradient} flex items-center justify-center`}>
                            <Icon className={`w-5 h-5 ${mod.iconColor}`} />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-white">{rec.title}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border}`}>
                            {rec.priority}
                          </span>
                          {mod && (
                            <span className="px-2 py-0.5 bg-zinc-800 border border-zinc-700 rounded-full text-[9px] font-medium text-zinc-400 uppercase tracking-wider">
                              {mod.category}
                            </span>
                          )}
                          {mod && (
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              mod.price === 'Free' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                            }`}>
                              {mod.price}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-zinc-400 leading-relaxed">{rec.reason}</p>

                        {/* Confidence bar */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1 max-w-[200px] h-1.5 bg-zinc-800 rounded-full overflow-hidden">
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

                      {/* Actions */}
                      <div className="flex sm:flex-col gap-2 shrink-0">
                        <button
                          onClick={() => handleFeedback(rec.moduleId, 'accepted')}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                            fb === 'accepted'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-zinc-800 hover:bg-emerald-500/20 text-zinc-400 hover:text-emerald-400 border border-zinc-700'
                          }`}
                        >
                          <ThumbsUp className="w-3 h-3" /> {fb === 'accepted' ? 'Accepted' : 'Accept'}
                        </button>
                        <button
                          onClick={() => handleFeedback(rec.moduleId, 'rejected')}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                            fb === 'rejected'
                              ? 'bg-rose-600 text-white'
                              : 'bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-zinc-700'
                          }`}
                        >
                          <ThumbsDown className="w-3 h-3" /> {fb === 'rejected' ? 'Rejected' : 'Reject'}
                        </button>
                        {mod && (
                          <Link
                            href={`/modules/${rec.moduleId}`}
                            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white text-[10px] font-semibold transition-all text-center justify-center"
                          >
                            View <ChevronRight className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredRecs.length === 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center space-y-3">
                <Filter className="w-8 h-8 text-zinc-600 mx-auto" />
                <p className="text-sm font-bold text-white">No recommendations match your filters</p>
                <p className="text-xs text-zinc-400">Try adjusting the category or price filter.</p>
              </div>
            )}
          </>
        )}

        {!loading && hasGenerated && recommendations.length === 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center space-y-3">
            <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
            <p className="text-sm font-bold text-white">Could not generate recommendations</p>
            <p className="text-xs text-zinc-400">Please check your server connection and try again.</p>
          </div>
        )}

        {/* ── CTA ──────────────────────────────────────────── */}
        <div className="relative bg-gradient-to-br from-purple-600/15 via-indigo-600/10 to-blue-600/15 border border-purple-500/20 rounded-2xl p-8 text-center overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[150px] bg-purple-600/10 rounded-full blur-[80px]" />
          </div>
          <div className="relative space-y-3">
            <h2 className="text-xl font-extrabold text-white">Need content for your launch?</h2>
            <p className="text-zinc-400 text-xs max-w-md mx-auto">
              Our AI Content Generator creates blog posts, product copy, social media content, and technical docs in seconds.
            </p>
            <Link
              href="/ai/content"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all hover:scale-[1.02]"
            >
              Generate Content <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">&copy; 2026 LaunchPilot. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-zinc-600">
            <Link href="/about" className="hover:text-zinc-400 transition-colors">About</Link>
            <Link href="/blog" className="hover:text-zinc-400 transition-colors">Blog</Link>
            <Link href="/contact" className="hover:text-zinc-400 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
