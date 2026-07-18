'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../providers';
import { addCustomModule } from '../../data/listings';
import {
  Rocket,
  ArrowRight,
  ChevronLeft,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export default function AddItemPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [category, setCategory] = useState('Product');
  const [price, setPrice] = useState('Free');
  const [dateAdded, setDateAdded] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('Global Cloud');
  const [imageUrl, setImageUrl] = useState('');
  const [gradientPreset, setGradientPreset] = useState('from-blue-600/30 via-indigo-600/20 to-blue-900/40');

  // Validation state
  const [errors, setErrors] = useState<{
    title?: string;
    shortDesc?: string;
    fullDesc?: string;
    location?: string;
  }>({});

  const [submitting, setSubmitting] = useState(false);

  // Auth Guard protection
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-t-indigo-500 border-zinc-800 rounded-full animate-spin" />
        <p className="text-xs text-zinc-500 mt-3">Verifying authorization session...</p>
      </div>
    );
  }

  // Validate form fields
  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!title.trim() || title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!shortDesc.trim() || shortDesc.length < 10) {
      newErrors.shortDesc = 'Short description must be at least 10 characters';
    }

    if (!fullDesc.trim() || fullDesc.length < 20) {
      newErrors.fullDesc = 'Full description must be at least 20 characters';
    }

    if (!location.trim()) {
      newErrors.location = 'Location field is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);

    const priceValue = price === 'Free' ? 0 : 19;
    const randomId = 'lc-custom-' + Math.floor(1000 + Math.random() * 9000);

    // Map categories to appropriate presets
    const customModuleData = {
      id: randomId,
      gradient: gradientPreset,
      iconName: category === 'AI' ? 'MessageSquareCode' : 'CheckSquare',
      iconColor: category === 'AI' ? 'text-indigo-400' : 'text-blue-400',
      iconBg: category === 'AI' ? 'bg-indigo-600/10 border-indigo-500/20' : 'bg-blue-600/10 border-blue-500/20',
      title: title.trim(),
      desc: shortDesc.trim(),
      detailedDesc: fullDesc.trim(),
      category,
      price,
      priceValue,
      dateAdded,
      location: location.trim(),
      timeEstimate: 'Instant Load',
      rating: 5.0, // default rating for new custom modules
      reviews: 0,
      href: '/dashboard', // fallback link
      keySpecs: [
        { label: 'Deployment Location', value: location.trim() },
        { label: 'Category', value: category },
        { label: 'Price Type', value: price },
        { label: 'Added By', value: user.name },
      ],
      reviewsList: [],
      images: [
        gradientPreset,
        'from-purple-600/40 via-blue-600/20 to-purple-950/50',
        'from-blue-600/40 via-indigo-600/20 to-blue-950/50',
      ],
    };

    // Simulate short network request
    setTimeout(() => {
      addCustomModule(customModuleData);
      setSubmitting(false);
      router.push('/modules');
    }, 800);
  };

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

      {/* ── CONTENT FORM ─────────────────────────────────────────────── */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Workspace Add-ons
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">Create Custom Module</h1>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Add a new tool, service, or roadmap component to your Explore board. It will instantly merge into your dashboard listings.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Module Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Market Survey Engine"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
                }}
                className={`w-full bg-zinc-950 border ${
                  errors.title ? 'border-rose-500' : 'border-zinc-800'
                } rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 ${
                  errors.title ? 'focus:ring-rose-500' : 'focus:ring-indigo-500'
                } transition-all`}
              />
              {errors.title && (
                <p className="text-[10px] text-rose-400 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.title}
                </p>
              )}
            </div>

            {/* Grid for Category, Price, Date */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Category */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Product">Product</option>
                  <option value="AI">AI</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Research">Research</option>
                  <option value="Investment">Investment</option>
                  <option value="Analytics">Analytics</option>
                  <option value="Productivity">Productivity</option>
                  <option value="Workspace">Workspace</option>
                </select>
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Price Model
                </label>
                <select
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Free">Free</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Release Date
                </label>
                <input
                  type="date"
                  required
                  value={dateAdded}
                  onChange={(e) => setDateAdded(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Location & Preset */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Location */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Deploy Location
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. US-East Server"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    if (errors.location) setErrors((prev) => ({ ...prev, location: undefined }));
                  }}
                  className={`w-full bg-zinc-950 border ${
                    errors.location ? 'border-rose-500' : 'border-zinc-800'
                  } rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 ${
                    errors.location ? 'focus:ring-rose-500' : 'focus:ring-indigo-500'
                  } transition-all`}
                />
                {errors.location && (
                  <p className="text-[10px] text-rose-400 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.location}
                  </p>
                )}
              </div>

              {/* Gradient Theme Preset */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Gradient Backdrop
                </label>
                <select
                  value={gradientPreset}
                  onChange={(e) => setGradientPreset(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="from-blue-600/30 via-indigo-600/20 to-blue-900/40">Blue / Navy</option>
                  <option value="from-indigo-600/30 via-purple-600/20 to-indigo-900/40">Indigo / Purple</option>
                  <option value="from-purple-600/30 via-blue-600/20 to-purple-900/40">Purple / Blue</option>
                </select>
              </div>
            </div>

            {/* Short Description */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Short Description
              </label>
              <input
                type="text"
                required
                placeholder="A concise, one-sentence highlight of this module..."
                value={shortDesc}
                onChange={(e) => {
                  setShortDesc(e.target.value);
                  if (errors.shortDesc) setErrors((prev) => ({ ...prev, shortDesc: undefined }));
                }}
                className={`w-full bg-zinc-950 border ${
                  errors.shortDesc ? 'border-rose-500' : 'border-zinc-800'
                } rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 ${
                  errors.shortDesc ? 'focus:ring-rose-500' : 'focus:ring-indigo-500'
                } transition-all`}
              />
              {errors.shortDesc && (
                <p className="text-[10px] text-rose-400 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.shortDesc}
                </p>
              )}
            </div>

            {/* Full Description */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Full Overview & Specifications
              </label>
              <textarea
                required
                rows={4}
                placeholder="A comprehensive breakdown of how this module operates, its core use cases, integrations, and setup requirements..."
                value={fullDesc}
                onChange={(e) => {
                  setFullDesc(e.target.value);
                  if (errors.fullDesc) setErrors((prev) => ({ ...prev, fullDesc: undefined }));
                }}
                className={`w-full bg-zinc-950 border ${
                  errors.fullDesc ? 'border-rose-500' : 'border-zinc-800'
                } rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 ${
                  errors.fullDesc ? 'focus:ring-rose-500' : 'focus:ring-indigo-500'
                } transition-all resize-none`}
              />
              {errors.fullDesc && (
                <p className="text-[10px] text-rose-400 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.fullDesc}
                </p>
              )}
            </div>

            {/* Optional Image URL */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Optional Image URL
                </label>
                <span className="text-[9px] text-zinc-500 font-semibold uppercase">Optional</span>
              </div>
              <input
                type="text"
                placeholder="https://images.unsplash.com/photo-..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold py-3 rounded-xl text-white shadow-lg transition-all hover:scale-[1.01] disabled:opacity-50"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Create & Deploy Add-on <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
              <Link
                href="/modules"
                className="flex-1 flex items-center justify-center bg-zinc-950 border border-zinc-850 hover:bg-zinc-900 text-xs font-semibold py-3 rounded-xl text-zinc-400 hover:text-zinc-200 transition-all"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
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
