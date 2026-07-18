'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Rocket,
  Sparkles,
  Clock,
  ChevronRight,
  Tag,
  BookOpen,
  TrendingUp,
  Users,
  Zap,
  ShieldCheck,
  Lightbulb,
  Search,
  X,
} from 'lucide-react';

type Post = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  featured?: boolean;
  gradient: string;
  icon: React.ElementType;
  iconColor: string;
  author: { name: string; avatar: string; role: string };
  tags: string[];
};

const POSTS: Post[] = [
  {
    id: 'from-idea-to-launch',
    title: 'From Idea to Launch: How Founders Are Using LaunchPilot to Ship in 72 Hours',
    excerpt:
      'We interviewed 12 founders who went from zero to live product in under 72 hours. Here\'s exactly what they did differently \u2014 and how you can replicate their process.',
    category: 'Case Study',
    readTime: '8 min read',
    date: 'Jul 15, 2026',
    featured: true,
    gradient: 'from-blue-500 to-indigo-600',
    icon: Rocket,
    iconColor: 'text-white',
    author: { name: 'Aria Chen', avatar: 'AC', role: 'CEO & Co-Founder' },
    tags: ['Launch', 'Founder Stories', 'Product'],
  },
  {
    id: 'module-composition-patterns',
    title: 'Module Composition Patterns That Scale',
    excerpt:
      'As your product grows, the way modules interact becomes critical. We break down the 5 composition patterns that keep platforms maintainable at scale.',
    category: 'Engineering',
    readTime: '6 min read',
    date: 'Jul 12, 2026',
    gradient: 'from-indigo-500 to-purple-600',
    icon: Zap,
    iconColor: 'text-white',
    author: { name: 'Marcus Webb', avatar: 'MW', role: 'CTO' },
    tags: ['Architecture', 'Modules', 'Engineering'],
  },
  {
    id: 'growth-loops-2026',
    title: '7 Growth Loops That Are Actually Working in 2026',
    excerpt:
      'Paid acquisition is expensive. The top-growing products on our platform all share one thing: a compounding growth loop that doesn\'t require a marketing budget to sustain.',
    category: 'Growth',
    readTime: '5 min read',
    date: 'Jul 10, 2026',
    gradient: 'from-teal-500 to-blue-600',
    icon: TrendingUp,
    iconColor: 'text-white',
    author: { name: 'Leo Figueroa', avatar: 'LF', role: 'Head of Growth' },
    tags: ['Growth', 'Marketing', 'Strategy'],
  },
  {
    id: 'design-system-dark-mode',
    title: 'Building a Design System That Works in Dark Mode by Default',
    excerpt:
      'Most design systems treat dark mode as an afterthought. Designing for dark-first unlocks a completely different — and more focused — set of constraints.',
    category: 'Design',
    readTime: '7 min read',
    date: 'Jul 7, 2026',
    gradient: 'from-purple-500 to-pink-600',
    icon: Lightbulb,
    iconColor: 'text-white',
    author: { name: 'Noa Patel', avatar: 'NP', role: 'Head of Design' },
    tags: ['Design', 'UI', 'Dark Mode'],
  },
  {
    id: 'enterprise-security-checklist',
    title: 'The Enterprise Security Checklist Every SaaS Founder Should Know',
    excerpt:
      'SOC 2, GDPR, RBAC, SSO — enterprise security has a lot of jargon and even more risk. Here\'s the practical checklist we give every team scaling from SMB to enterprise.',
    category: 'Security',
    readTime: '10 min read',
    date: 'Jul 4, 2026',
    gradient: 'from-emerald-500 to-teal-600',
    icon: ShieldCheck,
    iconColor: 'text-white',
    author: { name: 'Marcus Webb', avatar: 'MW', role: 'CTO' },
    tags: ['Security', 'Enterprise', 'Compliance'],
  },
  {
    id: 'community-driven-product',
    title: 'What We Learned Building a Community-Driven Product Roadmap',
    excerpt:
      'We gave our users direct influence over our product roadmap 18 months ago. Here\'s what happened, what surprised us, and what we\'d do differently.',
    category: 'Product',
    readTime: '6 min read',
    date: 'Jun 30, 2026',
    gradient: 'from-rose-500 to-orange-600',
    icon: Users,
    iconColor: 'text-white',
    author: { name: 'Aria Chen', avatar: 'AC', role: 'CEO & Co-Founder' },
    tags: ['Product', 'Community', 'Roadmap'],
  },
  {
    id: 'api-design-principles',
    title: 'API Design Principles We Wish We Knew Earlier',
    excerpt:
      'Every breaking change we\'ve ever shipped taught us something painful. This is the full list of principles that now govern every public API decision we make.',
    category: 'Engineering',
    readTime: '9 min read',
    date: 'Jun 25, 2026',
    gradient: 'from-amber-500 to-orange-600',
    icon: BookOpen,
    iconColor: 'text-white',
    author: { name: 'Marcus Webb', avatar: 'MW', role: 'CTO' },
    tags: ['API', 'Engineering', 'Developer Experience'],
  },
  {
    id: 'onboarding-ux-patterns',
    title: 'Onboarding UX Patterns That Retain Users Beyond Day 1',
    excerpt:
      'The average SaaS product loses 60% of trial users within the first 3 days. We\'ve tested every onboarding pattern in the book \u2014 here are the 4 that actually move retention.',
    category: 'Design',
    readTime: '5 min read',
    date: 'Jun 20, 2026',
    gradient: 'from-pink-500 to-purple-600',
    icon: Lightbulb,
    iconColor: 'text-white',
    author: { name: 'Noa Patel', avatar: 'NP', role: 'Head of Design' },
    tags: ['UX', 'Onboarding', 'Retention'],
  },
];

const CATEGORIES = ['All', 'Case Study', 'Engineering', 'Growth', 'Design', 'Security', 'Product'];

const CATEGORY_COLORS: Record<string, string> = {
  'Case Study': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Engineering: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  Growth: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  Design: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Security: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Product: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const featured = POSTS[0];
  const rest = POSTS.slice(1);

  const filtered = rest.filter((p) => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 overflow-x-hidden">
      {/* ── NAVBAR ───────────────────────────────────────────────────── */}
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
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/login" className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white text-xs font-semibold transition-all">
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[280px] bg-indigo-600/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> The LaunchPilot Blog
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Insights for{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              builders
            </span>
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed">
            Deep dives, founder stories, and engineering notes from the team building the fastest
            product launch platform on the internet.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-12">
        {/* ── FEATURED POST ────────────────────────────────────────── */}
        <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          {/* Gradient bar */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${featured.gradient}`} />
          <div className="p-6 sm:p-10 grid md:grid-cols-5 gap-8 items-center">
            <div className="md:col-span-3 space-y-4">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 border rounded-full text-[10px] font-bold uppercase tracking-wider ${CATEGORY_COLORS[featured.category]}`}>
                  {featured.category}
                </span>
                <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                  Featured
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
                {featured.title}
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">{featured.excerpt}</p>
              <div className="flex items-center gap-3 pt-1">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${featured.gradient} flex items-center justify-center text-white text-xs font-black`}>
                  {featured.author.avatar}
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">{featured.author.name}</div>
                  <div className="text-[10px] text-zinc-500">{featured.author.role}</div>
                </div>
                <div className="ml-auto flex items-center gap-1 text-[10px] text-zinc-500">
                  <Clock className="w-3 h-3" /> {featured.readTime}
                </div>
                <span className="text-[10px] text-zinc-600">{featured.date}</span>
              </div>
              <Link
                href={`/blog/${featured.id}`}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all hover:scale-[1.02]"
              >
                Read Article <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="md:col-span-2 flex items-center justify-center">
              <div className={`w-40 h-40 sm:w-52 sm:h-52 rounded-2xl bg-gradient-to-br ${featured.gradient} flex items-center justify-center shadow-2xl`}>
                <featured.icon className="w-20 h-20 sm:w-28 sm:h-28 text-white/30" />
              </div>
            </div>
          </div>
        </div>

        {/* ── FILTERS ──────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search articles…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* ── POSTS GRID ───────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center space-y-3">
            <BookOpen className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-sm font-bold text-white">No articles found</p>
            <p className="text-xs text-zinc-400">Try a different category or search term.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((post) => {
              const Icon = post.icon;
              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 hover:shadow-xl hover:shadow-zinc-950/50 transition-all hover:-translate-y-0.5"
                >
                  {/* Thumbnail */}
                  <div className={`h-36 bg-gradient-to-br ${post.gradient} flex items-center justify-center relative overflow-hidden`}>
                    <Icon className="w-20 h-20 text-white/20" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/40 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-0.5 border rounded-full text-[9px] font-bold uppercase tracking-wider bg-zinc-950/70 border-zinc-800 text-zinc-300`}>
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-sm font-bold text-white leading-snug group-hover:text-indigo-300 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">{post.excerpt}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-1 px-2 py-0.5 bg-zinc-800 border border-zinc-700 rounded-full text-[9px] font-medium text-zinc-400"
                        >
                          <Tag className="w-2.5 h-2.5" /> {tag}
                        </span>
                      ))}
                    </div>

                    {/* Meta */}
                    <div className="flex items-center justify-between pt-1 border-t border-zinc-800">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${post.gradient} flex items-center justify-center text-white text-[9px] font-black`}>
                          {post.author.avatar}
                        </div>
                        <span className="text-[10px] font-semibold text-zinc-400">{post.author.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-600">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                        <span>·</span>
                        {post.date}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* ── NEWSLETTER CTA ───────────────────────────────────────── */}
        <div className="relative bg-gradient-to-br from-blue-600/15 via-indigo-600/10 to-purple-600/15 border border-indigo-500/20 rounded-2xl p-10 text-center space-y-5 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[150px] bg-indigo-600/10 rounded-full blur-[80px]" />
          </div>
          <div className="relative space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Weekly Newsletter
            </div>
            <h2 className="text-2xl font-extrabold text-white">Stay in the loop</h2>
            <p className="text-zinc-400 text-sm max-w-md mx-auto">
              Get our best articles, product updates, and founder interviews delivered every Tuesday.
              No spam, unsubscribe anytime.
            </p>
          </div>
          <div className="relative flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
            />
            <button className="shrink-0 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl text-xs font-bold text-white transition-all hover:scale-[1.02]">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
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
