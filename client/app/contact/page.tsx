'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Rocket,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Phone,
} from 'lucide-react';

const CONTACT_CARDS = [
  {
    icon: Mail,
    label: 'Email Us',
    value: 'hello@launchpilot.io',
    sub: 'We respond within 24 hours',
    gradient: 'from-blue-500/10 to-transparent',
    border: 'border-blue-500/20',
    iconColor: 'text-blue-400',
  },
  {
    icon: MessageSquare,
    label: 'Live Chat',
    value: 'Available in the app',
    sub: 'Mon–Fri, 9 AM – 6 PM UTC',
    gradient: 'from-indigo-500/10 to-transparent',
    border: 'border-indigo-500/20',
    iconColor: 'text-indigo-400',
  },
  {
    icon: MapPin,
    label: 'Headquarters',
    value: 'San Francisco, CA',
    sub: 'Pacific Time (PT)',
    gradient: 'from-purple-500/10 to-transparent',
    border: 'border-purple-500/20',
    iconColor: 'text-purple-400',
  },
  {
    icon: Clock,
    label: 'Support Hours',
    value: '24 / 7',
    sub: 'For critical incidents',
    gradient: 'from-emerald-500/10 to-transparent',
    border: 'border-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
];

const TOPICS = [
  'General Inquiry',
  'Sales & Pricing',
  'Technical Support',
  'Partnership / Integration',
  'Bug Report',
  'Feature Request',
  'Press & Media',
  'Other',
];

const FAQS = [
  {
    q: 'Is there a free tier available?',
    a: 'Yes — LaunchPilot offers a permanently free tier that includes access to all base modules, up to 3 custom modules, and community support.',
  },
  {
    q: 'How quickly can I get set up?',
    a: 'Most teams are up and running within an afternoon. The platform is designed to be self-serve, but our onboarding team is happy to jump on a call if you need a guided walkthrough.',
  },
  {
    q: 'Do you support enterprise SSO and access controls?',
    a: 'Absolutely. Our Enterprise plan includes SAML SSO, RBAC, audit logs, and a dedicated success manager.',
  },
  {
    q: 'Can I migrate existing modules into LaunchPilot?',
    a: 'Yes. We support importing from JSON schemas and have a CLI tool that can scan existing projects and scaffold compatible module definitions automatically.',
  },
  {
    q: 'What is your SLA for uptime?',
    a: "We maintain a 99.95% uptime SLA on our infrastructure tier. You can monitor live status at status.launchpilot.io.",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address.';
    if (!form.topic) errs.topic = 'Please select a topic.';
    if (form.message.trim().length < 20) errs.message = 'Message must be at least 20 characters.';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  const inputBase =
    'w-full bg-zinc-800/60 border rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all';
  const inputNormal = `${inputBase} border-zinc-700 focus:ring-indigo-500/40 focus:border-indigo-500/50`;
  const inputError = `${inputBase} border-rose-500/50 focus:ring-rose-500/30`;

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
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/login" className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white text-xs font-semibold transition-all">
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Get in Touch
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            We'd love to{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              hear from you
            </span>
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed">
            Whether you have a question, a feature request, or just want to say hi — our team is happy to connect.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-16">
        {/* ── CONTACT CARDS ────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {CONTACT_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className={`bg-gradient-to-br ${card.gradient} bg-zinc-900 border ${card.border} rounded-2xl p-5 space-y-3`}
              >
                <Icon className={`w-5 h-5 ${card.iconColor}`} />
                <div>
                  <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">{card.label}</div>
                  <div className="text-sm font-bold text-white mt-0.5">{card.value}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">{card.sub}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── FORM + SIDEBAR ───────────────────────────────────────── */}
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Message Sent!</h3>
                  <p className="text-zinc-400 text-sm max-w-xs leading-relaxed">
                    Thanks for reaching out. We'll get back to you within 24 hours at{' '}
                    <span className="text-indigo-400 font-medium">{form.email}</span>.
                  </p>
                  <button
                    onClick={() => { setForm({ name: '', email: '', topic: '', message: '' }); setSubmitted(false); }}
                    className="mt-2 px-5 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-semibold text-zinc-300 transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-white">Send a Message</h2>
                    <p className="text-xs text-zinc-500">Fill in your details and we'll be in touch.</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-400">Full Name *</label>
                      <input
                        id="contact-name"
                        type="text"
                        placeholder="Jane Doe"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        className={errors.name ? inputError : inputNormal}
                      />
                      {errors.name && <p className="text-[10px] text-rose-400">{errors.name}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-400">Email Address *</label>
                      <input
                        id="contact-email"
                        type="email"
                        placeholder="jane@startup.com"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        className={errors.email ? inputError : inputNormal}
                      />
                      {errors.email && <p className="text-[10px] text-rose-400">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-400">Topic *</label>
                    <div className="relative">
                      <select
                        id="contact-topic"
                        value={form.topic}
                        onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
                        className={`appearance-none ${errors.topic ? inputError : inputNormal} pr-10 cursor-pointer bg-zinc-800/60`}
                      >
                        <option value="" disabled>Select a topic…</option>
                        {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                    </div>
                    {errors.topic && <p className="text-[10px] text-rose-400">{errors.topic}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-400">Message *</label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      placeholder="Tell us what's on your mind…"
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      className={`resize-none ${errors.message ? inputError : inputNormal}`}
                    />
                    <div className="flex justify-between items-center">
                      {errors.message
                        ? <p className="text-[10px] text-rose-400">{errors.message}</p>
                        : <span />}
                      <span className="text-[10px] text-zinc-600 tabular-nums ml-auto">
                        {form.message.length} chars
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold py-3 rounded-xl shadow-lg transition-all hover:scale-[1.01]"
                  >
                    <Send className="w-4 h-4" /> Send Message
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white">Other ways to reach us</h3>
              {[
                { icon: Mail, label: 'Enterprise Sales', val: 'sales@launchpilot.io', color: 'text-blue-400' },
                { icon: Phone, label: 'Partner Line', val: '+1 (415) 900-7823', color: 'text-indigo-400' },
                { icon: ExternalLink, label: 'Status Page', val: 'status.launchpilot.io', color: 'text-purple-400' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0`}>
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">{item.label}</div>
                      <div className="text-xs font-medium text-zinc-300 mt-0.5">{item.val}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-gradient-to-br from-indigo-500/10 to-transparent bg-zinc-900 border border-indigo-500/20 rounded-2xl p-6 space-y-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Book a demo</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                See LaunchPilot in action with a 20-minute personalized walkthrough from our team.
              </p>
              <button className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white transition-all">
                Schedule a Call <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* ── FAQ ──────────────────────────────────────────────────── */}
        <div className="max-w-3xl mx-auto space-y-5">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold text-white">Frequently Asked Questions</h2>
            <p className="text-zinc-400 text-sm">Quick answers to the most common questions.</p>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left gap-4 hover:bg-zinc-800/40 transition-colors"
                >
                  <span className="text-sm font-semibold text-white">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-zinc-400 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
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
