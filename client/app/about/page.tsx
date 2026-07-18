'use client';

import React from 'react';
import Link from 'next/link';
import {
  Rocket,
  Users,
  Globe,
  Zap,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Star,
  TrendingUp,
  HeartHandshake,
  Lightbulb,
  Target,
} from 'lucide-react';

const STATS = [
  { label: 'Active Users', value: '14,200+', icon: Users, color: 'text-blue-400', bg: 'from-blue-500/20 to-blue-600/5' },
  { label: 'Modules Launched', value: '380+', icon: Rocket, color: 'text-indigo-400', bg: 'from-indigo-500/20 to-indigo-600/5' },
  { label: 'Countries Reached', value: '62', icon: Globe, color: 'text-purple-400', bg: 'from-purple-500/20 to-purple-600/5' },
  { label: 'Avg. User Rating', value: '4.9 ★', icon: Star, color: 'text-amber-400', bg: 'from-amber-500/20 to-amber-600/5' },
];

const TEAM = [
  {
    name: 'Aria Chen',
    role: 'CEO & Co-Founder',
    avatar: 'AC',
    gradient: 'from-blue-500 to-indigo-600',
    bio: 'Former product lead at Stripe. Passionate about democratizing software launch pipelines.',
    links: ['linkedin.com/in/aria', 'twitter.com/aria'],
  },
  {
    name: 'Marcus Webb',
    role: 'CTO & Co-Founder',
    avatar: 'MW',
    gradient: 'from-indigo-500 to-purple-600',
    bio: '10+ years building developer tools. Previously at Vercel and Cloudflare.',
    links: ['linkedin.com/in/marcus', 'github.com/marcuswebb'],
  },
  {
    name: 'Noa Patel',
    role: 'Head of Design',
    avatar: 'NP',
    gradient: 'from-purple-500 to-pink-600',
    bio: 'Systems design thinker. Crafts experiences that feel both powerful and effortless.',
    links: ['linkedin.com/in/noa', 'dribbble.com/noa'],
  },
  {
    name: 'Leo Figueroa',
    role: 'Head of Growth',
    avatar: 'LF',
    gradient: 'from-teal-500 to-blue-600',
    bio: 'Data-driven growth strategist. Grew 3 SaaS products from 0 to Series B.',
    links: ['linkedin.com/in/leo', 'twitter.com/leofig'],
  },
];

const VALUES = [
  {
    icon: Lightbulb,
    title: 'Build in the Open',
    desc: 'We share our roadmap, changelog, and learnings publicly. Transparency is a feature, not an afterthought.',
    gradient: 'from-amber-500/10 to-transparent',
    border: 'border-amber-500/20',
    iconColor: 'text-amber-400',
  },
  {
    icon: HeartHandshake,
    title: 'Community First',
    desc: 'Every product decision starts with a user conversation. We ship what matters to real founders.',
    gradient: 'from-rose-500/10 to-transparent',
    border: 'border-rose-500/20',
    iconColor: 'text-rose-400',
  },
  {
    icon: ShieldCheck,
    title: 'Trust by Design',
    desc: 'Security, privacy, and reliability are baked into every layer — not bolted on at the end.',
    gradient: 'from-emerald-500/10 to-transparent',
    border: 'border-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    icon: Zap,
    title: 'Speed as a Virtue',
    desc: 'Time-to-value matters. We obsess over reducing friction from idea to launched product.',
    gradient: 'from-blue-500/10 to-transparent',
    border: 'border-blue-500/20',
    iconColor: 'text-blue-400',
  },
  {
    icon: TrendingUp,
    title: 'Relentless Improvement',
    desc: "We're never satisfied with good enough. Every sprint ships a measurable improvement.",
    gradient: 'from-indigo-500/10 to-transparent',
    border: 'border-indigo-500/20',
    iconColor: 'text-indigo-400',
  },
  {
    icon: Target,
    title: 'Outcome Oriented',
    desc: 'Features are meaningless without impact. We track outcomes, not output.',
    gradient: 'from-purple-500/10 to-transparent',
    border: 'border-purple-500/20',
    iconColor: 'text-purple-400',
  },
];

export default function AboutPage() {
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
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/login" className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white text-xs font-semibold transition-all">
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-600/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Our Story
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Built for founders who{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              move fast
            </span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            LaunchPilot was born from frustration — watching great ideas die in the gap between
            <em> "we should build this"</em> and <em>"it's live."</em> We built the platform we always
            wished existed.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/modules"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg transition-all hover:scale-[1.02]"
            >
              Explore Platform <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:scale-[1.02]"
            >
              Talk to Us
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`bg-gradient-to-br ${stat.bg} bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-3`}
              >
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <div>
                  <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-zinc-500 font-medium mt-1">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── MISSION ──────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 sm:p-12 grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-semibold">
              <Target className="w-3.5 h-3.5" /> Mission
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
              Shorten the path from vision to value
            </h2>
            <p className="text-zinc-400 leading-relaxed text-sm">
              We believe the time between idea and shipped product should be measured in hours, not
              months. LaunchPilot provides the scaffolding — modular, composable, battle-tested — so
              your team can focus entirely on what makes your product unique.
            </p>
          </div>
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-semibold">
              <Lightbulb className="w-3.5 h-3.5" /> Vision
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
              A world where every great idea gets a fair shot
            </h2>
            <p className="text-zinc-400 leading-relaxed text-sm">
              Infrastructure complexity shouldn't be a barrier to innovation. By the time a team
              reaches us, we want them to be thinking about users, growth, and impact — not
              deployment pipelines and auth systems.
            </p>
          </div>
        </div>
      </section>

      {/* ── TEAM ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-semibold">
            <Users className="w-3.5 h-3.5" /> The Team
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            People behind the platform
          </h2>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto">
            A small, distributed team with a shared obsession: making software launches feel inevitable.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TEAM.map((member) => (
            <div
              key={member.name}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4 hover:border-zinc-700 transition-all group"
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white text-lg font-black shadow-lg`}
              >
                {member.avatar}
              </div>
              <div>
                <div className="font-bold text-white text-sm">{member.name}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{member.role}</div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed flex-1">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── VALUES ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> Values
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">What we stand for</h2>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto">
            Our principles aren't a poster on the wall — they're enforced through every pull request, every
            support reply, every product decision.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {VALUES.map((val) => {
            const Icon = val.icon;
            return (
              <div
                key={val.title}
                className={`bg-gradient-to-br ${val.gradient} bg-zinc-900 border ${val.border} rounded-2xl p-6 space-y-3 hover:scale-[1.01] transition-transform`}
              >
                <Icon className={`w-5 h-5 ${val.iconColor}`} />
                <div className="font-bold text-white text-sm">{val.title}</div>
                <p className="text-xs text-zinc-400 leading-relaxed">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="relative bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-purple-600/20 border border-indigo-500/20 rounded-2xl p-10 text-center space-y-5 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-indigo-600/10 rounded-full blur-[80px]" />
          </div>
          <h2 className="relative text-2xl sm:text-3xl font-extrabold text-white">
            Ready to launch faster?
          </h2>
          <p className="relative text-zinc-400 text-sm max-w-md mx-auto">
            Join 14,200+ founders and teams already building on LaunchPilot.
          </p>
          <div className="relative flex flex-wrap justify-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-lg transition-all hover:scale-[1.02]"
            >
              Get Started Free <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-sm font-semibold px-6 py-2.5 rounded-xl transition-all"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

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
