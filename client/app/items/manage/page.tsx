'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../providers';
import {
  getCombinedModules,
  LISTING_CARDS,
  deleteCustomModule,
  fetchCombinedModules,
  ListingCard,
} from '../../data/listings';
import {
  Rocket,
  ChevronLeft,
  Sparkles,
  Eye,
  Trash2,
  Search,
  Star,
  AlertTriangle,
  X,
  PlusCircle,
} from 'lucide-react';

const BASE_IDS = new Set(LISTING_CARDS.map((c) => c.id));

export default function ManageItemsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [modules, setModules] = useState<ListingCard[]>([]);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<ListingCard | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  // Auth Guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Load modules
  const loadModules = useCallback(async () => {
    const data = await fetchCombinedModules();
    setModules(data);
    setPageLoading(false);
  }, []);

  useEffect(() => {
    loadModules();
  }, [loadModules]);

  const handleDelete = (mod: ListingCard) => {
    setDeleteTarget(mod);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteCustomModule(deleteTarget.id);
    setModules((prev) => prev.filter((m) => m.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-t-indigo-500 border-zinc-800 rounded-full animate-spin" />
        <p className="text-xs text-zinc-500 mt-3">Verifying authorization session…</p>
      </div>
    );
  }

  const filtered = modules.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col overflow-x-hidden">
      {/* ── NAVBAR ──────────────────────────────────────────────────── */}
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

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* ── HEADER ────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Item Management
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Manage Modules
            </h1>
            <p className="text-xs text-zinc-400">
              View and manage all base and custom platform modules. Custom items can be deleted; base modules are read-only.
            </p>
          </div>
          <Link
            href="/items/add"
            className="shrink-0 inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold py-2.5 px-5 rounded-xl text-white shadow-md transition-all hover:scale-[1.02]"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Add New Module
          </Link>
        </div>

        {/* ── SEARCH BAR ────────────────────────────────────────────── */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search modules by name or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
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

        {/* ── STATS SUMMARY ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Modules', value: modules.length, color: 'text-blue-400' },
            { label: 'Base Modules', value: LISTING_CARDS.length, color: 'text-indigo-400' },
            {
              label: 'Custom Modules',
              value: modules.filter((m) => !BASE_IDS.has(m.id)).length,
              color: 'text-purple-400',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-1"
            >
              <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── ITEMS GRID / TABLE ────────────────────────────────────── */}
        {pageLoading ? (
          <div className="grid grid-cols-1 gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 h-20 animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center space-y-3">
            <Search className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-sm font-bold text-white">No modules found</p>
            <p className="text-xs text-zinc-400">Try adjusting your search query.</p>
          </div>
        ) : (
          /* Mobile: card-list view. Desktop: table */
          <>
            {/* Desktop table */}
            <div className="hidden md:block bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400">
                    <th className="text-left px-5 py-3 font-semibold uppercase tracking-wider w-6">#</th>
                    <th className="text-left px-5 py-3 font-semibold uppercase tracking-wider">Module</th>
                    <th className="text-left px-3 py-3 font-semibold uppercase tracking-wider">Category</th>
                    <th className="text-left px-3 py-3 font-semibold uppercase tracking-wider">Price</th>
                    <th className="text-left px-3 py-3 font-semibold uppercase tracking-wider">Rating</th>
                    <th className="text-left px-3 py-3 font-semibold uppercase tracking-wider">Date</th>
                    <th className="text-left px-3 py-3 font-semibold uppercase tracking-wider">Source</th>
                    <th className="text-center px-3 py-3 font-semibold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filtered.map((mod, idx) => {
                    const Icon = mod.icon;
                    const isCustom = !BASE_IDS.has(mod.id);
                    return (
                      <tr
                        key={mod.id}
                        className="hover:bg-zinc-800/30 transition-colors"
                      >
                        <td className="px-5 py-4 text-zinc-500 font-medium">{idx + 1}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg bg-gradient-to-br ${mod.gradient} flex items-center justify-center shrink-0`}
                            >
                              <Icon className={`w-4 h-4 ${mod.iconColor}`} />
                            </div>
                            <div>
                              <div className="font-semibold text-white line-clamp-1">{mod.title}</div>
                              <div className="text-zinc-500 line-clamp-1 text-[10px] mt-0.5">{mod.desc}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-4">
                          <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-800 rounded-full text-zinc-400 font-medium text-[10px] uppercase tracking-wider">
                            {mod.category}
                          </span>
                        </td>
                        <td className="px-3 py-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              mod.price === 'Free'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-amber-500/10 text-amber-400'
                            }`}
                          >
                            {mod.price}
                          </span>
                        </td>
                        <td className="px-3 py-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="font-semibold text-zinc-200">{mod.rating}</span>
                          </div>
                        </td>
                        <td className="px-3 py-4 text-zinc-400 tabular-nums">{mod.dateAdded}</td>
                        <td className="px-3 py-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isCustom
                                ? 'bg-purple-500/10 text-purple-400'
                                : 'bg-blue-500/10 text-blue-400'
                            }`}
                          >
                            {isCustom ? 'Custom' : 'Base'}
                          </span>
                        </td>
                        <td className="px-3 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              href={`/modules/${mod.id}`}
                              className="flex items-center gap-1 px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300 hover:text-white transition-all text-[10px] font-semibold"
                            >
                              <Eye className="w-3 h-3" /> View
                            </Link>
                            {isCustom ? (
                              <button
                                onClick={() => handleDelete(mod)}
                                className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg text-rose-400 hover:text-rose-300 transition-all text-[10px] font-semibold"
                              >
                                <Trash2 className="w-3 h-3" /> Delete
                              </button>
                            ) : (
                              <span className="px-2.5 py-1.5 text-zinc-700 text-[10px] font-semibold select-none">
                                Protected
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="md:hidden grid grid-cols-1 gap-3">
              {filtered.map((mod, idx) => {
                const Icon = mod.icon;
                const isCustom = !BASE_IDS.has(mod.id);
                return (
                  <div
                    key={mod.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-start gap-4"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${mod.gradient} flex items-center justify-center shrink-0`}
                    >
                      <Icon className={`w-5 h-5 ${mod.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-sm font-bold text-white line-clamp-1">{mod.title}</div>
                          <div className="text-[10px] text-zinc-500 line-clamp-1 mt-0.5">{mod.desc}</div>
                        </div>
                        <span
                          className={`shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            isCustom
                              ? 'bg-purple-500/10 text-purple-400'
                              : 'bg-blue-500/10 text-blue-400'
                          }`}
                        >
                          {isCustom ? 'Custom' : 'Base'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[10px]">
                        <span className="px-1.5 py-0.5 bg-zinc-950 border border-zinc-800 rounded-full text-zinc-400 font-medium uppercase tracking-wider">
                          {mod.category}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded font-bold ${
                            mod.price === 'Free'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-amber-500/10 text-amber-400'
                          }`}
                        >
                          {mod.price}
                        </span>
                        <span className="flex items-center gap-0.5 text-zinc-400">
                          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                          {mod.rating}
                        </span>
                        <span className="text-zinc-600">{mod.dateAdded}</span>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <Link
                          href={`/modules/${mod.id}`}
                          className="flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300 text-[10px] font-semibold transition-all"
                        >
                          <Eye className="w-3 h-3" /> View
                        </Link>
                        {isCustom && (
                          <button
                            onClick={() => handleDelete(mod)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg text-rose-400 text-[10px] font-semibold transition-all"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      {/* ── DELETE CONFIRMATION MODAL ──────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full space-y-5 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Delete Module?</h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  You are about to permanently delete{' '}
                  <span className="font-semibold text-white">{deleteTarget.title}</span>. This action
                  cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 rounded-xl text-xs font-bold text-white transition-all"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-semibold text-zinc-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">&copy; 2026 LaunchPilot. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-zinc-600">
            <Link href="/" className="hover:text-zinc-400 transition-colors">Home</Link>
            <span className="hover:text-zinc-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-zinc-400 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
