'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { LISTING_CARDS, ListingCard, Review, getCombinedModules, fetchCombinedModules } from '../../data/listings';
import {
  Sparkles,
  ArrowRight,
  ChevronLeft,
  Star,
  Rocket,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  Layers,
  Send,
  MessageSquarePlus,
} from 'lucide-react';

export default function ModuleDetailsPage() {
  const { id } = useParams();
  const [module, setModule] = useState<ListingCard | null>(null);
  const [loading, setLoading] = useState(true);

  // Media panel index
  const [activeMedia, setActiveMedia] = useState(0);

  // Review states
  const [localReviews, setLocalReviews] = useState<Review[]>([]);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerComment, setReviewerComment] = useState('');
  const [submittedReview, setSubmittedReview] = useState(false);

  // Load module data
  useEffect(() => {
    if (!id) return;
    async function load() {
      setLoading(true);
      const combined = await fetchCombinedModules();
      const foundModule = combined.find((m) => m.id === id);
      if (foundModule) {
        setModule(foundModule);
        setLocalReviews(foundModule.reviewsList);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-t-indigo-500 border-zinc-800 rounded-full animate-spin" />
          <p className="text-sm text-zinc-400">Loading module specifications...</p>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-rose-500">
          <Rocket className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-white">Module Not Found</h1>
          <p className="text-sm text-zinc-400 max-w-sm">
            We couldn't find a platform module with ID "{id}". It may have been relocated or deprecated.
          </p>
        </div>
        <Link
          href="/modules"
          className="bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold px-5 py-3 rounded-xl text-white transition-all shadow-lg"
        >
          Return to Explore
        </Link>
      </div>
    );
  }

  // Handle Review Submission
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewerComment.trim()) return;

    const newReview: Review = {
      name: reviewerName,
      avatar: reviewerName.slice(0, 2).toUpperCase(),
      stars: reviewerRating,
      text: reviewerComment,
      date: new Date().toISOString().split('T')[0],
    };

    setLocalReviews((prev) => [newReview, ...prev]);
    setReviewerName('');
    setReviewerRating(5);
    setReviewerComment('');
    setSubmittedReview(true);
    setTimeout(() => setSubmittedReview(false), 3000);
  };

  // Compute live average rating and reviews count
  const totalRatingScore = localReviews.reduce((acc, r) => acc + r.stars, 0);
  const liveAverageRating = localReviews.length > 0 ? (totalRatingScore / localReviews.length).toFixed(1) : '0.0';
  const liveReviewsCount = localReviews.length;

  // Filter sibling related modules (max 4)
  const relatedModules = LISTING_CARDS.filter((m) => m.id !== module.id).slice(0, 4);

  // Lucide icon helper
  const Icon = module.icon;

  // Media panels content (illustrations matching module ID)
  const mediaPanels = [
    {
      title: 'Interactive Command Panel',
      badge: 'Integrated Workspace',
      desc: 'Access workspace functions through a self-contained premium dashboard with real-time controls.',
      gradient: module.images[0] || 'from-blue-600/40 via-indigo-600/20 to-blue-950/50',
    },
    {
      title: 'Gemini AI Integration',
      badge: 'Intelligent Automations',
      desc: 'Powered directly by Gemini AI pipelines, generating instant recommendations tailored to your startup concept.',
      gradient: module.images[1] || 'from-indigo-600/40 via-purple-600/20 to-indigo-950/50',
    },
    {
      title: 'MongoDB Secure Store',
      badge: 'Data Synchronization',
      desc: 'All project updates, reviews, and tasks persist immediately to your secure MongoDB database infrastructure.',
      gradient: module.images[2] || 'from-purple-600/40 via-blue-600/20 to-purple-950/50',
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col overflow-x-hidden">
      {/* ── HEADER NAVBAR ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          <Link href="/modules" className="flex items-center gap-2 shrink-0 group">
            <ChevronLeft className="w-4 h-4 text-zinc-400 group-hover:text-zinc-100 transition-colors" />
            <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-100 transition-colors">
              Explore Modules
            </span>
          </Link>
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
              LaunchPilot
            </span>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 space-y-12">
        {/* ── MULTIPLE IMAGES / MEDIA PANEL (CAROUSEL) ────────────────── */}
        <section className="relative w-full bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden h-[340px] flex flex-col justify-end p-8">
          {/* Animated Background Gradient Slide */}
          <div className={`absolute inset-0 bg-gradient-to-br ${mediaPanels[activeMedia].gradient} transition-all duration-700`} />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

          {/* Floating Icon */}
          <div className="absolute top-8 left-8 w-16 h-16 rounded-2xl bg-zinc-900/80 backdrop-blur-md border border-zinc-800 flex items-center justify-center shadow-2xl">
            <Icon className={`w-8 h-8 ${module.iconColor}`} />
          </div>

          {/* Slide Indicator Badges */}
          <div className="absolute top-8 right-8 flex gap-1 bg-zinc-950/60 backdrop-blur-md border border-zinc-800 px-3 py-1.5 rounded-full text-[10px] font-bold text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 mr-1 animate-pulse" />
            Active Display: {activeMedia + 1} / {mediaPanels.length}
          </div>

          {/* Content details */}
          <div className="relative z-10 space-y-2 max-w-2xl">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-indigo-600/20 border border-indigo-500/30 rounded-full text-indigo-300">
              {mediaPanels[activeMedia].badge}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {mediaPanels[activeMedia].title}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {mediaPanels[activeMedia].desc}
            </p>
          </div>

          {/* Selector Dots */}
          <div className="absolute bottom-8 right-8 flex gap-2">
            {mediaPanels.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveMedia(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === activeMedia ? 'bg-indigo-400 scale-125' : 'bg-zinc-700 hover:bg-zinc-600'
                }`}
                aria-label={`Show Media Panel ${i + 1}`}
              />
            ))}
          </div>
        </section>

        {/* ── TWO-COLUMN DETAILED DATA GRID ────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* DESCRIPTION / OVERVIEW (Left Column) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400" /> Module Description
                </h2>
                <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-line">
                  {module.detailedDesc}
                </p>
              </div>

              {/* Core capabilities list */}
              <div className="pt-4 border-t border-zinc-800/80 space-y-3">
                <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-widest">
                  Included Integrations
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-400">
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    Security standard TLS encryption
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    Gemini AI context parsing logic
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    Automatic MongoDB persistent sync
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    Fully responsive layout templates
                  </li>
                </ul>
              </div>

              {/* CTA launch button */}
              <div className="pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div>
                  <h4 className="text-xs text-zinc-500 font-medium">Ready to deploy?</h4>
                  <p className="text-xs text-zinc-400 font-semibold">Deploy and test directly inside the platform</p>
                </div>
                <Link
                  href={module.href}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-sm font-bold py-3 px-6 rounded-xl text-white shadow-md transition-all hover:scale-[1.02]"
                >
                  Launch Workspace Module
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* KEY INFORMATION / SPECIFICATIONS (Right Column) */}
          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
              <h2 className="text-sm font-bold text-white tracking-widest uppercase pb-3 border-b border-zinc-800">
                Key Information
              </h2>

              <div className="space-y-4 text-xs">
                {/* Category */}
                <div className="flex justify-between items-center py-2 border-b border-zinc-800/40">
                  <span className="text-zinc-500 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> Category
                  </span>
                  <span className="font-bold text-zinc-200">{module.category}</span>
                </div>

                {/* Price */}
                <div className="flex justify-between items-center py-2 border-b border-zinc-800/40">
                  <span className="text-zinc-500 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" /> Price Category
                  </span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                    module.price === 'Free' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {module.price}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex justify-between items-center py-2 border-b border-zinc-800/40">
                  <span className="text-zinc-500 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5" /> Rating Score
                  </span>
                  <span className="font-bold text-zinc-200 flex items-center gap-1">
                    {liveAverageRating} <span className="text-zinc-600">({liveReviewsCount})</span>
                  </span>
                </div>

                {/* Location */}
                <div className="flex justify-between items-center py-2 border-b border-zinc-800/40">
                  <span className="text-zinc-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Deployment
                  </span>
                  <span className="font-semibold text-zinc-300">{module.location}</span>
                </div>

                {/* Date added */}
                <div className="flex justify-between items-center py-2 border-b border-zinc-800/40">
                  <span className="text-zinc-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Added On
                  </span>
                  <span className="font-semibold text-zinc-300">{module.dateAdded}</span>
                </div>

                {/* Setup speed */}
                <div className="flex justify-between items-center py-2">
                  <span className="text-zinc-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Est. Action Time
                  </span>
                  <span className="font-semibold text-zinc-300">{module.timeEstimate}</span>
                </div>
              </div>

              {/* Technical Specifications Sub-card */}
              <div className="bg-zinc-950 border border-zinc-800/60 rounded-xl p-4 space-y-3">
                <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  Technical Specifications
                </h3>
                <div className="space-y-2 text-[11px]">
                  {module.keySpecs.map((spec, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-zinc-600">{spec.label}</span>
                      <span className="text-zinc-300 font-medium text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── REVIEWS / RATINGS SECTION ────────────────────────────────── */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-800">
            <div>
              <h2 className="text-lg font-bold text-white">Reviews & Community Ratings</h2>
              <p className="text-xs text-zinc-500 mt-1">
                Read user testimonials or add your custom feedback on this workspace module.
              </p>
            </div>

            {/* Average rating summary */}
            <div className="flex items-center gap-4 bg-zinc-950 border border-zinc-800 px-5 py-3 rounded-2xl">
              <div className="text-center">
                <div className="text-3xl font-black text-white">{liveAverageRating}</div>
                <div className="text-[9px] text-zinc-500 uppercase font-bold mt-0.5">Average Score</div>
              </div>
              <div className="h-8 w-px bg-zinc-800" />
              <div>
                <div className="flex text-amber-400 gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.round(parseFloat(liveAverageRating)) ? 'fill-amber-400' : 'text-zinc-700'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-[10px] text-zinc-400 font-semibold mt-1">Based on {liveReviewsCount} Reviews</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Reviews Form (Left/Right Grid Split) */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <MessageSquarePlus className="w-4 h-4 text-indigo-400" /> Write a Review
              </h3>

              {submittedReview ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center space-y-1 animate-in fade-in">
                  <p className="text-xs font-bold text-emerald-400">Review added successfully!</p>
                  <p className="text-[10px] text-zinc-500">Your feedback has been appended to the dashboard stream.</p>
                </div>
              ) : (
                <form onSubmit={handleAddReview} className="space-y-3.5 bg-zinc-950 border border-zinc-800/80 rounded-xl p-4">
                  {/* Reviewer Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/40"
                    />
                  </div>

                  {/* Rating Selector */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Rating Score</label>
                    <div className="flex gap-1.5 items-center pt-1">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const starVal = i + 1;
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setReviewerRating(starVal)}
                            className="p-0.5 rounded focus:outline-none"
                            aria-label={`Rate ${starVal} Star`}
                          >
                            <Star
                              className={`w-5 h-5 ${
                                starVal <= reviewerRating ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">Comment Feedback</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="What is your experience with this module?"
                      value={reviewerComment}
                      onChange={(e) => setReviewerComment(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 resize-none"
                    />
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold py-2.5 rounded-lg text-white shadow-md transition-all"
                  >
                    Submit Review <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>

            {/* Reviews Feed List */}
            <div className="lg:col-span-2 space-y-4 h-[340px] overflow-y-auto pr-2 custom-scrollbar">
              {localReviews.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 text-xs">
                  No reviews submitted yet. Be the first to share your experience!
                </div>
              ) : (
                localReviews.map((rev, index) => (
                  <div key={index} className="bg-zinc-950 border border-zinc-800/60 rounded-xl p-4 space-y-2.5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/30 to-purple-600/30 border border-indigo-500/20 flex items-center justify-center text-[10px] font-extrabold text-indigo-300">
                          {rev.avatar}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{rev.name}</div>
                          <div className="flex text-amber-400 gap-0.5 mt-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-2.5 h-2.5 ${i < rev.stars ? 'fill-amber-400' : 'text-zinc-800'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-zinc-600">{rev.date}</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                      {rev.text}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ── RELATED ITEMS SECTION ────────────────────────────────────── */}
        <section className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-white">Related Platform Modules</h2>
            <Link href="/modules" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              View All Modules &rarr;
            </Link>
          </div>

          {/* Related Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedModules.map((card) => {
              const RelatedIcon = card.icon;
              return (
                <div
                  key={card.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col h-[380px] hover:border-zinc-700 hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  {/* media panel */}
                  <div
                    className={`relative h-[140px] bg-gradient-to-br ${card.gradient} shrink-0 flex items-center justify-center overflow-hidden`}
                  >
                    <div
                      className={`relative z-10 w-14 h-14 rounded-2xl ${card.iconBg} border flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}
                    >
                      <RelatedIcon className={`w-7 h-7 ${card.iconColor}`} />
                    </div>
                  </div>

                  {/* body */}
                  <div className="p-5 flex flex-col flex-1 min-h-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-zinc-950 border border-zinc-800 rounded-full text-zinc-400">
                        {card.category}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white mb-1.5 line-clamp-1">{card.title}</h3>

                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 flex-1">
                      {card.desc}
                    </p>

                    <div className="flex items-center gap-1.5 mt-3">
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, si) => (
                          <Star
                            key={si}
                            className={`w-3 h-3 ${si < Math.floor(card.rating) ? 'fill-amber-400' : 'text-zinc-700'}`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-zinc-300">{card.rating}</span>
                    </div>

                    <Link
                      href={`/modules/${card.id}`}
                      className="mt-3 w-full flex items-center justify-center gap-1.5 bg-zinc-950 border border-zinc-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:border-transparent text-xs font-semibold py-2.5 rounded-xl text-zinc-300 hover:text-white transition-all duration-200 group/btn"
                    >
                      View Details
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            &copy; 2026 LaunchPilot. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-zinc-600">
            <Link href="/" className="hover:text-zinc-400 transition-colors">
              Home
            </Link>
            <span className="hover:text-zinc-400 cursor-pointer transition-colors">
              Privacy Policy
            </span>
            <span className="hover:text-zinc-400 cursor-pointer transition-colors">
              Terms of Service
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
