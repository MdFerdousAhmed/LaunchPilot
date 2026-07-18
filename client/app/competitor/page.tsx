'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../providers';
import { apiRequest } from '../../utils/api';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';
import {
  Sparkles,
  Plus,
  Trash2,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  Zap,
  Target
} from 'lucide-react';

interface CompetitorItem {
  _id: string;
  name: string;
  url: string;
  strengths: string[];
  weaknesses: string[];
  features: string[];
  price: string;
  notes: string;
  score: number;
}

export default function CompetitorPage() {
  const { currentProject } = useAuth();
  const [competitors, setCompetitors] = useState<CompetitorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  
  // Analyzer form states
  const [compName, setCompName] = useState('');
  const [compUrl, setCompUrl] = useState('');
  const [error, setError] = useState('');

  const fetchCompetitors = async () => {
    if (!currentProject) return;
    setLoading(true);
    try {
      const data = await apiRequest<CompetitorItem[]>(`/competitors?projectId=${currentProject._id}`);
      setCompetitors(data);
    } catch (err) {
      console.error('Error fetching competitors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitors();
  }, [currentProject]);

  const handleAnalyzeCompetitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compName.trim() || !currentProject) return;
    
    setAnalyzing(true);
    setError('');
    
    try {
      const analyzed = await apiRequest('/competitors/analyze', {
        method: 'POST',
        body: JSON.stringify({
          name: compName,
          url: compUrl,
          projectId: currentProject._id
        })
      });
      setCompetitors((prev) => [analyzed, ...prev]);
      setCompName('');
      setCompUrl('');
    } catch (err: any) {
      setError(err.message || 'AI analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDeleteCompetitor = async (id: string) => {
    if (!confirm('Remove competitor from radar?')) return;
    try {
      await apiRequest(`/competitors/${id}`, {
        method: 'DELETE'
      });
      setCompetitors((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error('Error deleting competitor:', err);
    }
  };

  // Setup Recharts Radar Data
  const radarData = competitors.map((c) => ({
    subject: c.name,
    ThreatLevel: c.score,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Competitor Intelligence Radar
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Analyze competitors using AI to map strengths, weaknesses, and pricing structures.
            </p>
          </div>
        </div>

        {/* Top Grid: AI Analyzer & Radar Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Competitor Form */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" /> AI Competitor Scanner
            </h3>
            <p className="text-xs text-zinc-450 leading-relaxed">
              Enter a competitor name & website. LaunchPilot Gemini analyzer will crawl and summarize pricing models, core features, threat ratings, and strategic advice.
            </p>

            <form onSubmit={handleAnalyzeCompetitor} className="space-y-4 pt-2">
              {error && (
                <div className="bg-red-950/30 border border-red-800/50 text-red-200 px-3.5 py-2 rounded-lg text-xs">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-[10px] font-semibold text-zinc-450 uppercase tracking-wider mb-1">
                  Competitor Name *
                </label>
                <input
                  type="text"
                  required
                  value={compName}
                  onChange={(e) => setCompName(e.target.value)}
                  placeholder="e.g. Competitor SaaS"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-zinc-450 uppercase tracking-wider mb-1">
                  Competitor Website URL
                </label>
                <input
                  type="url"
                  value={compUrl}
                  onChange={(e) => setCompUrl(e.target.value)}
                  placeholder="https://competitor.com"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                />
              </div>

              <button
                type="submit"
                disabled={analyzing || !compName.trim()}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-lg py-2.5 text-xs font-semibold hover:opacity-95 disabled:opacity-50 cursor-pointer shadow-md"
              >
                {analyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    AI Scanning Profile...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Scan Competitor
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Threat Radar Chart */}
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" /> Threat Matrix Chart
              </h3>
              <p className="text-xs text-zinc-450 mt-1">
                Visual threat distribution. Higher scores indicate larger competitors to defend against.
              </p>
            </div>

            <div className="w-full h-56 flex items-center justify-center mt-4">
              {competitors.length >= 3 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#1f2937" />
                    <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} stroke="#4b5563" />
                    <Radar
                      name="Threat Level"
                      dataKey="ThreatLevel"
                      stroke="#818cf8"
                      fill="#818cf8"
                      fillOpacity={0.15}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center text-center text-zinc-500 gap-2 p-6 bg-zinc-950/50 rounded-xl border border-dashed border-zinc-800 w-full">
                  <ShieldAlert className="w-8 h-8 text-zinc-700" />
                  <span className="text-xs font-semibold text-zinc-400">Radar Chart Requires Competitors</span>
                  <span className="text-[10px] text-zinc-500 max-w-xs">
                    Scan at least 3 competitors to populate the multi-dimensional radar comparison.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Competitor Profiles Listing */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-zinc-900 pb-3">
            Tracked Competitors ({competitors.length})
          </h3>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
              <div className="h-44 bg-zinc-900 rounded-2xl border border-zinc-800"></div>
              <div className="h-44 bg-zinc-900 rounded-2xl border border-zinc-800"></div>
            </div>
          ) : competitors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {competitors.map((comp) => (
                <div
                  key={comp._id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 hover:border-zinc-750/80 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/5 rounded-full blur-xl pointer-events-none"></div>
                  
                  {/* Top line with score badge */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                        {comp.name}
                        {comp.url && (
                          <a
                            href={comp.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-500 hover:text-zinc-300"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </h4>
                      <span className="text-[11px] text-zinc-400 font-semibold">{comp.price || 'Freemium'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md border flex items-center gap-1.5 ${
                          comp.score >= 8
                            ? 'bg-red-500/10 border-red-500/20 text-red-400'
                            : comp.score >= 5
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                            : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                        }`}
                      >
                        <ShieldAlert className="w-3 h-3" /> Threat {comp.score}/10
                      </span>
                      <button
                        onClick={() => handleDeleteCompetitor(comp._id)}
                        className="p-1.5 rounded-lg text-zinc-650 hover:text-red-400 hover:bg-zinc-950 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                        title="Remove competitor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* SWOT Grid */}
                  <div className="grid grid-cols-2 gap-4 border-t border-b border-zinc-800/80 py-3 text-xs">
                    <div>
                      <span className="block font-bold text-emerald-400 mb-1.5 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-emerald-400" /> Strengths
                      </span>
                      <ul className="space-y-1 text-zinc-300">
                        {comp.strengths.slice(0, 3).map((st, i) => (
                          <li key={i} className="list-disc ml-3.5 text-[11px] leading-tight">{st}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="block font-bold text-red-400 mb-1.5 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> Weaknesses
                      </span>
                      <ul className="space-y-1 text-zinc-300">
                        {comp.weaknesses.slice(0, 3).map((wk, i) => (
                          <li key={i} className="list-disc ml-3.5 text-[11px] leading-tight">{wk}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Features tags */}
                  {comp.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 text-[10px]">
                      {comp.features.map((ft, idx) => (
                        <span key={idx} className="bg-zinc-950 border border-zinc-850 px-2 py-0.5 rounded text-zinc-400">
                          {ft}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Positioning Advice */}
                  {comp.notes && (
                    <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-850 text-[11px] leading-relaxed text-zinc-400">
                      <strong className="text-zinc-300 block mb-0.5">AI Competitive Positioning:</strong>
                      {comp.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-zinc-900/10 border border-dashed border-zinc-800 rounded-2xl">
              <ShieldAlert className="w-12 h-12 text-zinc-700 mb-3" />
              <h4 className="text-zinc-400 font-semibold text-sm">No competitors mapped yet</h4>
              <p className="text-zinc-500 text-xs mt-1 max-w-xs">
                Scan your first competitor above to compile pricing models, strengths, and positioning tactics.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
