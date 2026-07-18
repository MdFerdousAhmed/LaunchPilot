'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from './providers';
import { LISTING_CARDS } from './data/listings';
import {
  Sparkles,
  ArrowRight,
  CheckSquare,
  MessageSquareCode,
  TrendingUp,
  Globe,
  Presentation,
  LayoutDashboard,
  Zap,
  ChevronDown,
  Menu,
  X,
  Rocket,
  Target,
  Shield,
  BarChart3,
  Users,
  Mail,
  CheckCircle2,
  Star,
  HelpCircle,
} from 'lucide-react';

// Social icon SVGs (not available in this lucide-react version)
const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.262 5.633 5.902-5.633Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

// ─── Data ────────────────────────────────────────────────────────────────────

const NAV_LOGGED_OUT = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Testimonials', href: '#testimonials' },
];

const NAV_LOGGED_IN = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Tasks', href: '/tasks' },
  { label: 'Copilot', href: '/copilot' },
  { label: 'Competitors', href: '/competitor' },
  { label: 'Pitch Deck', href: '/pitch-deck' },
];

const FEATURES = [
  {
    icon: CheckSquare,
    color: 'blue',
    title: 'AI Launch Checklist',
    desc: 'Enter your startup idea and receive 10 custom milestones split across Product, Development, Marketing, Legal, and Launch. Progress tracked live.',
  },
  {
    icon: MessageSquareCode,
    color: 'indigo',
    title: 'Strategy Copilot',
    desc: 'Chat with Gemini AI to refine monetization models, draft social hooks, plan developer architecture, and answer hard founder questions.',
  },
  {
    icon: Globe,
    color: 'purple',
    title: 'Landing Page Generator',
    desc: 'Describe your design vision in plain text. Our AI generates fully styled, responsive HTML & CSS instantly. Preview live in a split-screen editor.',
  },
  {
    icon: TrendingUp,
    color: 'blue',
    title: 'Competitor Intelligence',
    desc: 'Scan any competitor. LaunchPilot maps strengths, weaknesses, pricing, features, and threat scores using Gemini AI — displayed on a radar chart.',
  },
  {
    icon: Presentation,
    color: 'indigo',
    title: 'Pitch Deck Outliner',
    desc: 'Generate a professional 10-slide investor pitch outline tailored to your startup — including problem, solution, TAM/SAM/SOM, traction, and ask.',
  },
  {
    icon: BarChart3,
    color: 'purple',
    title: 'Launch Readiness Score',
    desc: 'A real-time gauge on your dashboard shows exactly how ready you are to launch, calculated from completed milestones across every category.',
  },
];

const STEPS = [
  {
    step: '01',
    title: 'Describe Your Startup',
    desc: 'Enter your startup name, description, industry, and target audience. The more detail you share, the smarter your AI-generated plan will be.',
    color: 'blue',
  },
  {
    step: '02',
    title: 'AI Generates Your Roadmap',
    desc: 'Gemini instantly creates a personalized 10-milestone launch checklist, competitive landscape, and pitch framework — customized for your idea.',
    color: 'indigo',
  },
  {
    step: '03',
    title: 'Execute and Launch',
    desc: 'Check off tasks, chat with your AI Copilot, generate a landing page, and refine your pitch deck until your readiness score hits 100%.',
    color: 'purple',
  },
];

const STATS = [
  { value: '10+', label: 'AI-Generated Milestones', icon: CheckCircle2, color: 'blue' },
  { value: '100%', label: 'Gemini AI Powered', icon: Sparkles, color: 'indigo' },
  { value: '6', label: 'Core Feature Modules', icon: Zap, color: 'purple' },
  { value: '∞', label: 'Ideas You Can Launch', icon: Rocket, color: 'blue' },
];

const TESTIMONIALS = [
  {
    name: 'Sara Chen',
    role: 'Founder, NovaMind AI',
    avatar: 'SC',
    stars: 5,
    text: 'LaunchPilot saved me weeks of planning. The AI checklist covered angles I never even considered — including legal entity setup and beta feedback loops.',
  },
  {
    name: 'Marcus Webb',
    role: 'Solo Developer, FrameFlow',
    avatar: 'MW',
    stars: 5,
    text: 'The Landing Page generator alone is worth it. I had a waitlist page live in under 3 minutes, and the Competitor Radar helped me position against established tools.',
  },
  {
    name: 'Priya Nair',
    role: 'Co-Founder, LearnLoop',
    avatar: 'PN',
    stars: 5,
    text: 'The Pitch Deck outliner gave me exactly the narrative arc my investor deck was missing. Concise, structured, and perfectly tailored to EdTech.',
  },
];

const FAQS = [
  {
    q: 'Do I need a Gemini API key to get started?',
    a: 'No — LaunchPilot is fully functional out of the box with intelligent mock responses. However, adding your Gemini API key in the server environment unlocks live AI responses personalized to your startup.',
  },
  {
    q: 'Can I manage multiple startup projects?',
    a: 'Yes. Create unlimited startup projects from the sidebar and switch between them anytime. Each project has its own tasks, competitors, pages, and chat history.',
  },
  {
    q: 'Is my data stored securely?',
    a: 'All data is stored in your own MongoDB Atlas cluster under your credentials. JWT tokens are used for session authentication and all API routes are protected behind authorization middleware.',
  },
  {
    q: 'How does the Launch Readiness Score work?',
    a: 'The score is calculated as the percentage of milestones marked "Done" within your active project. As you complete tasks, the dashboard gauge updates in real time.',
  },
  {
    q: 'Can I export the generated landing page code?',
    a: 'Yes — the Landing Page builder includes a "Copy Code" button that exports the complete, self-contained HTML file. Paste it into any host (Netlify, Vercel, GitHub Pages) and publish instantly.',
  },
];

// LISTING_CARDS imported from data/listings

// ─── Component ───────────────────────────────────────────────────────────────

export default function Home() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHero, setActiveHero] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [cardsLoading, setCardsLoading] = useState(true);
  const heroInterval = useRef<NodeJS.Timeout | null>(null);

  const HERO_SLIDES = [
    {
      badge: 'Powered by Gemini AI',
      headline: 'Validate and launch your product, guided by AI.',
      sub: 'An AI-powered Startup Copilot that generates custom task roadmaps, crawls competitor strategies, creates landing pages, and structures pitch decks.',
    },
    {
      badge: '10 milestones in seconds',
      headline: 'From idea to launch checklist in under 30 seconds.',
      sub: 'Describe your startup once. LaunchPilot builds a full milestone roadmap across Product, Development, Marketing, Legal, and Launch categories — instantly.',
    },
    {
      badge: 'Competitive Intelligence',
      headline: 'Know exactly where you stand against the competition.',
      sub: 'Scan any competitor with our Gemini-powered scanner and get SWOT analysis, pricing models, threat scores, and strategic positioning advice.',
    },
  ];

  useEffect(() => {
    heroInterval.current = setInterval(() => {
      setActiveHero((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => {
      if (heroInterval.current) clearInterval(heroInterval.current);
    };
  }, []);

  // Simulate card data loading
  useEffect(() => {
    const t = setTimeout(() => setCardsLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const colorMap: Record<string, { bg: string; border: string; text: string }> = {
    blue: { bg: 'bg-blue-600/10', border: 'border-blue-500/20', text: 'text-blue-400' },
    indigo: { bg: 'bg-indigo-600/10', border: 'border-indigo-500/20', text: 'text-indigo-400' },
    purple: { bg: 'bg-purple-600/10', border: 'border-purple-500/20', text: 'text-purple-400' },
  };

  const navLinks = user ? NAV_LOGGED_IN : NAV_LOGGED_OUT;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col overflow-x-hidden">

      {/* ── NAVBAR ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
              LaunchPilot
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((n) =>
              n.href.startsWith('#') ? (
                <button
                  key={n.label}
                  onClick={() => scrollTo(n.href.slice(1))}
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-all"
                >
                  {n.label}
                </button>
              ) : (
                <Link
                  key={n.label}
                  href={n.href}
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-all"
                >
                  {n.label}
                </Link>
              )
            )}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {user ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-sm font-semibold py-2 px-4 rounded-xl text-white shadow-md transition-all"
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold text-zinc-400 hover:text-zinc-200 transition-colors">
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-sm font-semibold py-2 px-4 rounded-xl text-white shadow-md transition-all"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden p-2 rounded-lg text-zinc-400 hover:bg-zinc-900 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-zinc-900 bg-zinc-950 px-4 py-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
            {navLinks.map((n) =>
              n.href.startsWith('#') ? (
                <button
                  key={n.label}
                  onClick={() => scrollTo(n.href.slice(1))}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-300 hover:bg-zinc-900 transition-all"
                >
                  {n.label}
                </button>
              ) : (
                <Link
                  key={n.label}
                  href={n.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-300 hover:bg-zinc-900 transition-all"
                >
                  {n.label}
                </Link>
              )
            )}
            <div className="pt-3 pb-1 border-t border-zinc-900 flex flex-col gap-2">
              {user ? (
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-semibold py-2.5 px-4 rounded-xl text-white">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="text-center text-sm font-semibold text-zinc-400 py-2 hover:text-zinc-200">Sign In</Link>
                  <Link href="/signup" onClick={() => setMobileOpen(false)} className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-semibold py-2.5 px-4 rounded-xl text-white">Get Started Free</Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-[65vh] flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        {/* Ambient glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-radial from-indigo-600/15 via-purple-600/8 to-transparent blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-blue-600/8 blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[200px] bg-purple-600/6 blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div
            key={activeHero}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-semibold"
            style={{ animation: 'fadeSlideUp 0.5s ease-out' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{HERO_SLIDES[activeHero].badge}</span>
          </div>

          {/* Headline */}
          <h1
            key={'h-' + activeHero}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white"
            style={{ animation: 'fadeSlideUp 0.55s ease-out' }}
          >
            {HERO_SLIDES[activeHero].headline.split('AI.').length > 1
              ? <>
                  {HERO_SLIDES[activeHero].headline.split('guided by AI.')[0]}
                  <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">guided by AI.</span>
                </>
              : HERO_SLIDES[activeHero].headline
            }
          </h1>

          {/* Sub */}
          <p
            key={'s-' + activeHero}
            className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed"
            style={{ animation: 'fadeSlideUp 0.6s ease-out' }}
          >
            {HERO_SLIDES[activeHero].sub}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Link
              href={user ? '/dashboard' : '/signup'}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-sm font-bold py-3.5 px-8 rounded-xl text-white shadow-xl transition-all hover:scale-[1.02]"
            >
              {user ? 'Enter Dashboard' : 'Start For Free'}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => scrollTo('how-it-works')}
              className="flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-sm font-semibold py-3.5 px-8 rounded-xl text-zinc-300 transition-all"
            >
              See How It Works
            </button>
          </div>

          {/* Slide dots */}
          <div className="flex justify-center gap-2 pt-2">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveHero(i);
                  if (heroInterval.current) clearInterval(heroInterval.current);
                  heroInterval.current = setInterval(() => setActiveHero((p) => (p + 1) % HERO_SLIDES.length), 4500);
                }}
                className={`w-2 h-2 rounded-full transition-all ${i === activeHero ? 'bg-indigo-400 scale-125' : 'bg-zinc-700 hover:bg-zinc-600'}`}
              />
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <button
          onClick={() => scrollTo('features')}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-zinc-600 hover:text-zinc-400 transition-colors animate-bounce"
          aria-label="Scroll to features"
        >
          <span className="text-[10px] uppercase tracking-widest font-semibold">Explore</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </section>

      {/* ── STATS ──────────────────────────────────────────────────────── */}
      <section className="py-14 bg-zinc-900/40 border-y border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((stat) => {
              const c = colorMap[stat.color];
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-3 items-start hover:border-zinc-700 transition-all">
                  <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.border} border flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${c.text}`} />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-white">{stat.value}</div>
                    <div className="text-xs text-zinc-400 font-medium mt-0.5">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" /> Core Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Everything your startup launch needs
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm leading-relaxed">
            From first idea to public launch — LaunchPilot provides every AI-powered tool a founder needs in a single, unified workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => {
            const c = colorMap[f.color];
            const Icon = f.icon;
            return (
              <div key={f.title} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4 hover:border-zinc-700 transition-all group">
                <div className={`w-12 h-12 rounded-xl ${c.bg} ${c.border} border flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${c.text}`} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white">{f.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── PLATFORM MODULES LISTING ────────────────────────────────── */}
      <section id="modules" className="py-24 px-4 sm:px-6 lg:px-8 bg-zinc-900/30 border-y border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-semibold">
              <Rocket className="w-3.5 h-3.5" /> Platform Modules
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Explore every tool in LaunchPilot
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto text-sm leading-relaxed">
              Eight specialized modules, all unified inside one workspace. Tap any card to explore that feature inside the platform.
            </p>
            <div className="pt-2">
              <Link href="/modules" className="inline-flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs font-semibold py-2.5 px-5 rounded-xl text-zinc-300 transition-all hover:scale-[1.02] shadow-md">
                Explore & Filter All Modules
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cardsLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  // ── Skeleton Loader Card ──
                  <div
                    key={i}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col h-[380px] animate-pulse"
                  >
                    {/* Image skeleton */}
                    <div className="h-[140px] bg-zinc-800/80 shrink-0" />
                    {/* Content skeleton */}
                    <div className="p-5 flex flex-col gap-3 flex-1">
                      <div className="flex gap-2">
                        <div className="h-5 w-20 bg-zinc-800 rounded-full" />
                        <div className="h-5 w-16 bg-zinc-800 rounded-full" />
                      </div>
                      <div className="h-5 w-3/4 bg-zinc-800 rounded-lg" />
                      <div className="space-y-1.5">
                        <div className="h-3.5 w-full bg-zinc-800 rounded" />
                        <div className="h-3.5 w-5/6 bg-zinc-800 rounded" />
                        <div className="h-3.5 w-4/6 bg-zinc-800 rounded" />
                      </div>
                      <div className="flex gap-2 mt-auto">
                        <div className="h-4 w-24 bg-zinc-800 rounded" />
                      </div>
                      <div className="h-9 w-full bg-zinc-800 rounded-xl mt-1" />
                    </div>
                  </div>
                ))
              : LISTING_CARDS.map((card) => {
                  const Icon = card.icon;
                  return (
                    // ── Real Card ──
                    <div
                      key={card.id}
                      className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col h-[380px] hover:border-zinc-700 hover:-translate-y-0.5 transition-all duration-200 group"
                    >
                      {/* Card image area — gradient with floating icon */}
                      <div
                        className={`relative h-[140px] bg-gradient-to-br ${card.gradient} shrink-0 flex items-center justify-center overflow-hidden`}
                      >
                        {/* Decorative blur blobs */}
                        <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/5 rounded-full blur-xl" />
                        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/5 rounded-full blur-xl" />
                        {/* Icon */}
                        <div
                          className={`relative z-10 w-14 h-14 rounded-2xl ${card.iconBg} border flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}
                        >
                          <Icon className={`w-7 h-7 ${card.iconColor}`} />
                        </div>
                      </div>

                      {/* Card body */}
                      <div className="p-5 flex flex-col flex-1 min-h-0">
                        {/* Meta row */}
                        <div className="flex items-center gap-2 mb-2.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-zinc-950 border border-zinc-800 rounded-full text-zinc-400">
                            {card.category}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-medium">{card.timeEstimate}</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-sm font-bold text-white mb-1.5 line-clamp-1">{card.title}</h3>

                        {/* Description */}
                        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 flex-1">
                          {card.desc}
                        </p>

                        {/* Rating row */}
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

                        {/* CTA Button */}
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
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-zinc-900/30 border-y border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-semibold">
              <Target className="w-3.5 h-3.5" /> Simple Process
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Launch in three steps
            </h2>
            <p className="text-zinc-400 max-w-lg mx-auto text-sm leading-relaxed">
              Our streamlined workflow takes you from raw idea to launch-ready in the shortest path possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector line (desktop only) */}
            <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-px bg-gradient-to-r from-blue-600/50 via-indigo-500/50 to-purple-600/50 z-0" />
            {STEPS.map((step, i) => {
              const c = colorMap[step.color];
              return (
                <div key={step.step} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4 hover:border-zinc-700 transition-all relative z-10">
                  <div className={`w-12 h-12 rounded-xl ${c.bg} ${c.border} border flex items-center justify-center font-black text-lg ${c.text}`}>
                    {step.step}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-white">{step.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              href={user ? '/dashboard' : '/signup'}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-sm font-bold py-3.5 px-8 rounded-xl text-white shadow-xl transition-all hover:scale-[1.02]"
            >
              Get Started Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────────────── */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-semibold">
            <Users className="w-3.5 h-3.5" /> Founder Stories
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Founders who shipped faster
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4 hover:border-zinc-700 transition-all">
              <div className="flex gap-1">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3 border-t border-zinc-800 pt-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-600/30 border border-indigo-500/20 flex items-center justify-center text-xs font-extrabold text-indigo-300">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{t.name}</div>
                  <div className="text-xs text-zinc-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-zinc-900/30 border-y border-zinc-900">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-semibold">
              <HelpCircle className="w-3.5 h-3.5" /> FAQ
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Common questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left gap-4"
                >
                  <span className="text-sm font-semibold text-white">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm text-zinc-400 leading-relaxed border-t border-zinc-800 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER / CTA ───────────────────────────────────────────── */}
      <section id="newsletter" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 sm:p-12 relative overflow-hidden">
          {/* Background glows inside card */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/8 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-600/6 blur-[80px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-semibold">
                <Mail className="w-3.5 h-3.5" /> Stay Updated
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Get founder insights and new feature drops.
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Join founders who receive weekly tips on startup launches, AI automation, and go-to-market strategy — straight to your inbox.
              </p>
            </div>

            <div className="space-y-4">
              {subscribed ? (
                <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-sm font-semibold text-emerald-300">You&apos;re on the list! We&apos;ll be in touch soon.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-sm font-bold py-3 px-6 rounded-xl text-white shadow-md transition-all shrink-0"
                  >
                    Subscribe
                  </button>
                </form>
              )}
              <p className="text-xs text-zinc-600">No spam. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA BANNER ───────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5" /> Free to Start
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.15]">
          Your startup idea deserves a{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            proper launch plan.
          </span>
        </h2>
        <p className="text-zinc-400 max-w-xl mx-auto text-sm leading-relaxed">
          Stop procrastinating on strategy spreadsheets and competitor tabs. LaunchPilot does the heavy lifting so you can focus on building.
        </p>
        <Link
          href={user ? '/dashboard' : '/signup'}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-sm font-bold py-4 px-10 rounded-xl text-white shadow-2xl transition-all hover:scale-[1.02]"
        >
          {user ? 'Go to Dashboard' : 'Launch My Startup — Free'} <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-900 bg-zinc-950 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

            {/* Brand column */}
            <div className="space-y-4 lg:col-span-1">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Rocket className="w-4 h-4 text-white" />
                </div>
                <span className="text-base font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  LaunchPilot
                </span>
              </Link>
              <p className="text-sm text-zinc-400 leading-relaxed">
                AI-powered Startup Copilot helping founders plan, validate, and launch their ideas faster.
              </p>
              <div className="flex gap-3">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-all">
                  <TwitterIcon className="w-4 h-4" />
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-all">
                  <GithubIcon className="w-4 h-4" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-all">
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Product */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-widest">Product</h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'Features', href: '#features' },
                  { label: 'How It Works', href: '#how-it-works' },
                  { label: 'Dashboard', href: '/dashboard' },
                  { label: 'Launch Tasks', href: '/tasks' },
                  { label: 'AI Copilot', href: '/copilot' },
                ].map((l) => (
                  <li key={l.label}>
                    {l.href.startsWith('#') ? (
                      <button onClick={() => scrollTo(l.href.slice(1))} className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
                        {l.label}
                      </button>
                    ) : (
                      <Link href={l.href} className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tools */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-widest">AI Tools</h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'Competitor Radar', href: '/competitor' },
                  { label: 'Landing Page Builder', href: '/landing-page' },
                  { label: 'Pitch Deck Outliner', href: '/pitch-deck' },
                  { label: 'FAQ', href: '#faq' },
                  { label: 'Newsletter', href: '#newsletter' },
                ].map((l) => (
                  <li key={l.label}>
                    {l.href.startsWith('#') ? (
                      <button onClick={() => scrollTo(l.href.slice(1))} className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
                        {l.label}
                      </button>
                    ) : (
                      <Link href={l.href} className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-widest">Contact</h4>
              <ul className="space-y-3">
                <li>
                  <a href="mailto:hello@launchpilot.app" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
                    <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                    hello@launchpilot.app
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
                    <TwitterIcon className="w-4 h-4 text-blue-400 shrink-0" />
                    @LaunchPilotHQ
                  </a>
                </li>
                <li>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
                    <GithubIcon className="w-4 h-4 text-zinc-300 shrink-0" />
                    github.com/launchpilot
                  </a>
                </li>
              </ul>

              <div className="pt-2">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold py-2.5 px-4 rounded-xl text-white shadow-md transition-all"
                >
                  Get Started Free <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-zinc-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-zinc-600">
              &copy; 2026 LaunchPilot. All rights reserved. Built with Gemini AI.
            </p>
            <div className="flex gap-4 text-xs text-zinc-600">
              <span className="hover:text-zinc-400 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-zinc-400 cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Global keyframe animations ─────────────────────────────────── */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .bg-gradient-radial {
          background: radial-gradient(ellipse at center, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
}
