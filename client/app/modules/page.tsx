'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LISTING_CARDS, ListingCard, getCombinedModules, fetchCombinedModules } from '../data/listings';
import { useAuth } from '../providers';
import {
  Sparkles,
  ArrowRight,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Star,
  Rocket,
  ShieldAlert,
  X,
} from 'lucide-react';

const PAGE_SIZE = 4;

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');
  const [minRating, setMinRating] = useState('All');
  const [sortBy, setSortBy] = useState('rating-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState<ListingCard[]>([]);
  const { user } = useAuth();

  // Load modules combined with server modules
  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchCombinedModules();
      setModules(data);
      setLoading(false);
    }
    load();
  }, []);

  // Filter triggers
  useEffect(() => {
    // No-op or small delay to show filters update
  }, [search, selectedCategory, selectedPrice, minRating, sortBy]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, selectedPrice, minRating, sortBy]);

  // Extract unique categories for filter dropdown
  const categories = ['All', ...Array.from(new Set(modules.map((c) => c.category)))];

  // Filter & Sort logic
  const filteredCards = modules.filter((card) => {
    const matchesSearch =
      card.title.toLowerCase().includes(search.toLowerCase()) ||
      card.desc.toLowerCase().includes(search.toLowerCase()) ||
      card.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || card.category === selectedCategory;

    const matchesPrice = selectedPrice === 'All' || card.price === selectedPrice;

    const matchesRating =
      minRating === 'All' || card.rating >= parseFloat(minRating);

    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  });

  const sortedCards = [...filteredCards].sort((a, b) => {
    if (sortBy === 'rating-desc') return b.rating - a.rating;
    if (sortBy === 'rating-asc') return a.rating - b.rating;
    if (sortBy === 'reviews-desc') return b.reviews - a.reviews;
    if (sortBy === 'date-desc') return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    if (sortBy === 'name-asc') return a.title.localeCompare(b.title);
    if (sortBy === 'name-desc') return b.title.localeCompare(a.title);
    return 0;
  });

  // Pagination logic
  const totalItems = sortedCards.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedCards = sortedCards.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedPrice('All');
    setMinRating('All');
    setSortBy('rating-desc');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col overflow-x-hidden">
      {/* ── HEADER NAVBAR ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
              LaunchPilot
            </span>
          </Link>
          <Link
            href="/"
            className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </header>

      {/* ── TITLE HERO ────────────────────────────────────────────────── */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center space-y-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-radial from-indigo-600/10 via-purple-600/5 to-transparent blur-[100px]" />
        </div>
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Explore Workspace Modules
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            LaunchPilot Command Center
          </h1>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Search, filter, and sort through our specialized startup modules. Tap any module to see detailed technical specifications, reviews, and launch setups.
          </p>
          {user && (
            <div className="pt-2">
              <Link
                href="/items/add"
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-semibold py-2.5 px-5 rounded-xl text-white shadow-md transition-all hover:scale-[1.02]"
              >
                Add Custom Module
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── SEARCH & FILTERS BAR ───────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative w-full lg:flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search modules by name, desc, or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 w-full lg:w-auto shrink-0">
              <span className="text-xs text-zinc-400 font-semibold shrink-0">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full lg:w-48 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-3 text-xs text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                <option value="rating-desc">Rating: High to Low</option>
                <option value="rating-asc">Rating: Low to High</option>
                <option value="reviews-desc">Reviews Count</option>
                <option value="date-desc">Newest Added</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>

          {/* Filters Row */}
          <div className="pt-4 border-t border-zinc-800/60 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-semibold mr-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" /> Filters:
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-zinc-500 font-medium">Category:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500/40"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-zinc-500 font-medium">Price:</span>
                <select
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500/40"
                >
                  <option value="All">All Prices</option>
                  <option value="Free">Free</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>

              {/* Min Rating Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-zinc-500 font-medium">Min Rating:</span>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500/40"
                >
                  <option value="All">All Ratings</option>
                  <option value="4.8">4.8+ Stars</option>
                  <option value="4.9">4.9 Stars</option>
                </select>
              </div>
            </div>

            {/* Clear Filters Button */}
            {(search || selectedCategory !== 'All' || selectedPrice !== 'All' || minRating !== 'All') && (
              <button
                onClick={clearFilters}
                className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── CARD GRID SECTION ─────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-1">
        {loading ? (
          // ── Skeleton Grid ──
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div
                key={i}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col h-[380px] animate-pulse"
              >
                <div className="h-[140px] bg-zinc-800/80 shrink-0" />
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <div className="flex gap-2">
                    <div className="h-5 w-20 bg-zinc-800 rounded-full" />
                    <div className="h-5 w-16 bg-zinc-800 rounded-full" />
                  </div>
                  <div className="h-5 w-3/4 bg-zinc-800 rounded-lg" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3.5 w-full bg-zinc-800 rounded" />
                    <div className="h-3.5 w-5/6 bg-zinc-800 rounded" />
                    <div className="h-3.5 w-4/6 bg-zinc-800 rounded" />
                  </div>
                  <div className="h-4 w-24 bg-zinc-800 rounded mt-auto" />
                  <div className="h-9 w-full bg-zinc-800 rounded-xl mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : paginatedCards.length === 0 ? (
          // ── Empty State ──
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center max-w-md mx-auto my-12 space-y-4">
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">No modules found</h3>
              <p className="text-xs text-zinc-400">
                No tools match your active filter settings. Try relaxing your filters or search terms.
              </p>
            </div>
            <button
              onClick={clearFilters}
              className="bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold px-4 py-2 rounded-xl text-white transition-all shadow-md"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          // ── Real Card Grid ──
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {paginatedCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col h-[380px] hover:border-zinc-700 hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  {/* Card media panel (gradient + floating icon) */}
                  <div
                    className={`relative h-[140px] bg-gradient-to-br ${card.gradient} shrink-0 flex items-center justify-center overflow-hidden`}
                  >
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/5 rounded-full blur-xl" />
                    <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/5 rounded-full blur-xl" />
                    <div
                      className={`relative z-10 w-14 h-14 rounded-2xl ${card.iconBg} border flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}
                    >
                      <Icon className={`w-7 h-7 ${card.iconColor}`} />
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex flex-col flex-1 min-h-0">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-zinc-950 border border-zinc-800 rounded-full text-zinc-400">
                          {card.category}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-medium">{card.timeEstimate}</span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        card.price === 'Free' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {card.price}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white mb-1.5 line-clamp-1">{card.title}</h3>

                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 flex-1">
                      {card.desc}
                    </p>

                    {/* Ratings */}
                    <div className="flex items-center gap-1.5 mt-3">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, si) => (
                          <Star
                            key={si}
                            className={`w-3 h-3 ${
                              si < Math.floor(card.rating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-zinc-700'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-zinc-300">{card.rating}</span>
                      <span className="text-[10px] text-zinc-600">({card.reviews})</span>
                    </div>

                    {/* CTA Details Button */}
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
        )}

        {/* ── PAGINATION CONTROLS ───────────────────────────────────────── */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-zinc-900 py-6 mb-12">
            <p className="text-xs text-zinc-500">
              Showing <span className="font-semibold text-zinc-300">{startIndex + 1}</span> to{' '}
              <span className="font-semibold text-zinc-300">
                {Math.min(startIndex + PAGE_SIZE, totalItems)}
              </span>{' '}
              of <span className="font-semibold text-zinc-300">{totalItems}</span> modules
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 disabled:opacity-50 disabled:pointer-events-none transition-all"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, pi) => {
                const pageNum = pi + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-9 h-9 rounded-xl font-semibold text-xs border transition-all ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent text-white shadow-md'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 disabled:opacity-50 disabled:pointer-events-none transition-all"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </section>

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
