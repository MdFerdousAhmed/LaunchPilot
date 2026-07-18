'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../providers';
import { apiRequest } from '../../utils/api';
import { Sparkles, Presentation, ChevronLeft, ChevronRight, Copy, Check, Info } from 'lucide-react';

interface Slide {
  slideNumber: number;
  title: string;
  bullets: string[];
}

export default function PitchDeckPage() {
  const { currentProject } = useAuth();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const fetchPitchDeck = async () => {
    if (!currentProject) return;
    // We don't auto-generate to avoid unnecessary AI calls; we let user trigger it
    setSlides([]);
    setActiveSlideIndex(0);
  };

  useEffect(() => {
    fetchPitchDeck();
  }, [currentProject]);

  const handleGenerateDeck = async () => {
    if (!currentProject || loading) return;
    setLoading(true);
    try {
      const res = await apiRequest('/copilot/pitch-deck', {
        method: 'POST',
        body: JSON.stringify({ projectId: currentProject._id })
      });
      setSlides(res.slides);
      setActiveSlideIndex(0);
    } catch (err) {
      console.error('Error generating pitch deck:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopySlideContent = () => {
    if (slides.length === 0) return;
    const slide = slides[activeSlideIndex];
    const text = `Slide ${slide.slideNumber}: ${slide.title}\n` + slide.bullets.map((b) => `- ${b}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
              <Presentation className="w-6 h-6 text-indigo-400" /> VC Pitch Deck Outliner
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Structure a professional 10-slide pitch presentation for investors using Gemini.
            </p>
          </div>
          {slides.length === 0 && (
            <button
              onClick={handleGenerateDeck}
              disabled={loading}
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl py-3 px-5 text-sm font-semibold hover:opacity-95 disabled:opacity-50 cursor-pointer shadow-lg shrink-0"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Drafting Pitch Structure...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Draft Pitch Deck
                </>
              )}
            </button>
          )}
        </div>

        {/* Workspace panel */}
        {slides.length > 0 ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Slide Presentation Card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 min-h-[350px] flex flex-col justify-between shadow-lg relative overflow-hidden">
              {/* Background glows */}
              <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-600/5 rounded-full blur-2xl pointer-events-none"></div>
              
              {/* Slide Meta Top line */}
              <div className="flex justify-between items-center text-zinc-500 text-xs shrink-0">
                <span className="font-semibold uppercase tracking-widest text-[10px]">
                  Investor Pitch Deck
                </span>
                <span className="font-bold text-zinc-400">
                  Slide {slides[activeSlideIndex].slideNumber} of {slides.length}
                </span>
              </div>

              {/* Slide Core Content */}
              <div className="my-8 space-y-6 flex-1 flex flex-col justify-center">
                <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  {slides[activeSlideIndex].title}
                </h3>
                <ul className="space-y-3.5 pl-5">
                  {slides[activeSlideIndex].bullets.map((bullet, idx) => (
                    <li
                      key={idx}
                      className="text-sm md:text-base text-zinc-350 list-disc leading-relaxed transition-all"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Slide Actions */}
              <div className="flex justify-between items-center border-t border-zinc-850 pt-4 shrink-0">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveSlideIndex((prev) => Math.max(0, prev - 1))}
                    disabled={activeSlideIndex === 0}
                    className="p-2 rounded-lg bg-zinc-950 border border-zinc-850 text-zinc-450 hover:text-white disabled:opacity-30 transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
                    disabled={activeSlideIndex === slides.length - 1}
                    className="p-2 rounded-lg bg-zinc-950 border border-zinc-850 text-zinc-450 hover:text-white disabled:opacity-30 transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={handleCopySlideContent}
                  className="flex items-center gap-1.5 px-4 py-2 bg-zinc-950 border border-zinc-850 hover:bg-zinc-900 rounded-lg text-xs font-semibold text-zinc-450 hover:text-white transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copy Slide Text
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Slide Index Progress Dots */}
            <div className="flex justify-center items-center gap-2">
              {slides.map((slide, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    activeSlideIndex === idx ? 'bg-indigo-500 scale-125' : 'bg-zinc-800 hover:bg-zinc-700'
                  }`}
                  title={`Go to slide ${slide.slideNumber}`}
                />
              ))}
            </div>

            {/* Strategy Tip Box */}
            <div className="bg-indigo-950/20 border border-indigo-900/30 rounded-2xl p-4 flex gap-3 text-xs leading-relaxed text-zinc-400">
              <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-zinc-300 block mb-0.5">Presentation Strategy:</strong>
                Keep your presentation brief. The goal of this pitch deck outline is not to compile an exhaustive list of facts, but to present a clear narrative arc that hooks investor interest in under 4 minutes.
              </div>
            </div>
            
            <div className="flex justify-center pt-2">
              <button
                onClick={handleGenerateDeck}
                disabled={loading}
                className="text-xs text-indigo-400 hover:underline"
              >
                Regenerate Pitch Deck Outline
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-3xl flex items-center justify-center">
              <Presentation className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">No pitch deck outline drafted</h3>
              <p className="text-zinc-500 text-xs mt-1.5 leading-relaxed">
                Provide a descriptions of your startup project inside LaunchPilot, and click the button to generate slide content for your pitch presentation.
              </p>
            </div>
            {/* Button duplicate */}
            <button
              onClick={handleGenerateDeck}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-semibold py-3 px-6 rounded-xl text-white shadow-lg cursor-pointer"
            >
              {loading ? 'AI Blueprinting slides...' : 'Draft Pitch Deck'}
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
