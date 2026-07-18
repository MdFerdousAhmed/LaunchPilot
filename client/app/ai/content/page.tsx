'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Rocket,
  Sparkles,
  FileText,
  ShoppingBag,
  Share2,
  BookOpen,
  RefreshCw,
  Copy,
  Check,
  ChevronRight,
  Wand2,
  Loader2,
  SlidersHorizontal,
} from 'lucide-react';
import { apiRequest } from '../../../utils/api';

type ContentType = 'blog' | 'product' | 'social' | 'documentation';

interface ContentTypeOption {
  id: ContentType;
  label: string;
  icon: React.ElementType;
  desc: string;
  gradient: string;
  iconColor: string;
}

const CONTENT_TYPES: ContentTypeOption[] = [
  { id: 'blog', label: 'Blog Article', icon: FileText, desc: 'SEO-optimized blog posts and thought leadership', gradient: 'from-blue-500 to-indigo-600', iconColor: 'text-blue-400' },
  { id: 'product', label: 'Product Description', icon: ShoppingBag, desc: 'Compelling product copy that converts', gradient: 'from-indigo-500 to-purple-600', iconColor: 'text-indigo-400' },
  { id: 'social', label: 'Social Media Post', icon: Share2, desc: 'Platform-optimized posts with hashtags', gradient: 'from-purple-500 to-pink-600', iconColor: 'text-purple-400' },
  { id: 'documentation', label: 'Module Documentation', icon: BookOpen, desc: 'Technical docs with code examples', gradient: 'from-teal-500 to-blue-600', iconColor: 'text-teal-400' },
];

const TONES = ['Professional', 'Casual', 'Persuasive', 'Technical', 'Friendly', 'Authoritative'];
const PLATFORMS = ['Twitter', 'LinkedIn', 'Instagram', 'Facebook'];
const LENGTHS: Array<{ value: 'short' | 'medium' | 'long'; label: string; desc: string }> = [
  { value: 'short', label: 'Short', desc: '150\u2013250 words' },
  { value: 'medium', label: 'Medium', desc: '400\u2013600 words' },
  { value: 'long', label: 'Long', desc: '800\u20131200 words' },
];

export default function ContentGeneratorPage() {
  const [selectedType, setSelectedType] = useState<ContentType>('blog');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [fields, setFields] = useState<Record<string, string>>({});
  const [output, setOutput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  const updateField = (key: string, val: string) => {
    setFields((prev) => ({ ...prev, [key]: val }));
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setOutput('');
    try {
      const res = await apiRequest<{ content: string }>('/ai/generate-content', {
        method: 'POST',
        body: JSON.stringify({ contentType: selectedType, fields, length }),
      });
      setOutput(res.content);
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
    } catch (err) {
      setOutput('An error occurred while generating content. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputBase =
    'w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all';

  const renderFields = () => {
    switch (selectedType) {
      case 'blog':
        return (
          <>
            <Field label="Topic *" placeholder="e.g., How AI is transforming startup launches" field="topic" />
            <Field label="Target Audience" placeholder="e.g., Tech founders, SaaS developers" field="audience" />
            <SelectField label="Tone" field="tone" options={TONES} />
          </>
        );
      case 'product':
        return (
          <>
            <Field label="Product Name *" placeholder="e.g., LaunchPilot Pro" field="productName" />
            <Field label="Category" placeholder="e.g., SaaS, E-commerce, DevTools" field="category" />
            <Field label="Key Features" placeholder="e.g., AI-powered, real-time analytics, team collaboration" field="features" />
            <SelectField label="Tone" field="tone" options={TONES} />
          </>
        );
      case 'social':
        return (
          <>
            <SelectField label="Platform *" field="platform" options={PLATFORMS} />
            <Field label="Topic *" placeholder="e.g., Product launch announcement" field="topic" />
            <Field label="Goal" placeholder="e.g., Drive signups, Build awareness, Engage community" field="goal" />
          </>
        );
      case 'documentation':
        return (
          <>
            <Field label="Module Name *" placeholder="e.g., Authentication API" field="moduleName" />
            <Field label="Description" placeholder="e.g., JWT-based auth with role-based access control" field="description" />
            <Field label="Tech Stack" placeholder="e.g., Node.js, Express, MongoDB" field="techStack" />
          </>
        );
    }
  };

  function Field({ label, placeholder, field }: { label: string; placeholder: string; field: string }) {
    return (
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-400">{label}</label>
        <input
          type="text"
          placeholder={placeholder}
          value={fields[field] || ''}
          onChange={(e) => updateField(field, e.target.value)}
          className={inputBase}
        />
      </div>
    );
  }

  function SelectField({ label, field, options }: { label: string; field: string; options: string[] }) {
    return (
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-400">{label}</label>
        <select
          value={fields[field] || options[0]}
          onChange={(e) => updateField(field, e.target.value)}
          className={`${inputBase} appearance-none cursor-pointer bg-zinc-800/60`}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    );
  }

  // Simple markdown renderer
  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold text-white mt-4 mb-2">{line.replace('## ', '')}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} className="text-base font-bold text-white mt-3 mb-1.5">{line.replace('### ', '')}</h3>;
      if (line.startsWith('# ')) return <h1 key={i} className="text-xl font-extrabold text-white mt-4 mb-2">{line.replace('# ', '')}</h1>;
      if (line.startsWith('> ')) return <blockquote key={i} className="border-l-2 border-indigo-500 pl-4 text-zinc-400 italic my-2">{line.replace('> ', '')}</blockquote>;
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const content = line.replace(/^[-*] /, '');
        return <li key={i} className="ml-4 list-disc text-zinc-300 py-0.5">{renderBold(content)}</li>;
      }
      if (line.match(/^\d+[/.] /)) {
        const content = line.replace(/^\d+[/.] /, '');
        return <li key={i} className="ml-4 list-decimal text-zinc-300 py-0.5">{renderBold(content)}</li>;
      }
      if (line.startsWith('```')) return null;
      if (line.startsWith('|')) return <p key={i} className="text-zinc-300 text-xs font-mono bg-zinc-800/50 px-2 py-0.5 rounded">{line}</p>;
      if (line.trim() === '') return <div key={i} className="h-2" />;
      return <p key={i} className="text-zinc-300 leading-relaxed">{renderBold(line)}</p>;
    });
  };

  const renderBold = (text: string) => {
    if (!text.includes('**')) return text;
    const parts = text.split('**');
    return parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-white font-bold">{part}</strong> : part);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 overflow-x-hidden">
      {/* ── NAVBAR ───────────────────────────────────────────── */}
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
            <Link href="/ai/recommendations" className="hover:text-white transition-colors">AI Picks</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/login" className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white text-xs font-semibold transition-all">
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative pt-16 pb-10 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[280px] bg-indigo-600/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> AI-Powered Content
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Generate{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              stunning content
            </span>{' '}
            in seconds
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-lg mx-auto">
            Create blog articles, product descriptions, social media posts, and technical documentation
            powered by Gemini AI with custom prompt templates.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-8">
        {/* ── CONTENT TYPE SELECTOR ─────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {CONTENT_TYPES.map((ct) => {
            const Icon = ct.icon;
            const isActive = selectedType === ct.id;
            return (
              <button
                key={ct.id}
                onClick={() => { setSelectedType(ct.id); setFields({}); setOutput(''); }}
                className={`relative bg-zinc-900 border rounded-2xl p-4 text-left transition-all hover:scale-[1.01] ${
                  isActive ? 'border-indigo-500/50 ring-2 ring-indigo-500/20' : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {isActive && <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${ct.gradient} rounded-t-2xl`} />}
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${ct.gradient} flex items-center justify-center mb-3`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm font-bold text-white">{ct.label}</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">{ct.desc}</div>
              </button>
            );
          })}
        </div>

        {/* ── MAIN CONTENT AREA ─────────────────────────────── */}
        <div className="grid lg:grid-cols-5 gap-6 items-start">
          {/* Left: Form */}
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-400" /> Configure Content
              </h2>
              <p className="text-[10px] text-zinc-500">Fill in the details and choose your preferred length.</p>
            </div>

            {renderFields()}

            {/* Length Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400">Output Length</label>
              <div className="grid grid-cols-3 gap-2">
                {LENGTHS.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setLength(l.value)}
                    className={`p-2.5 rounded-xl text-center transition-all border ${
                      length === l.value
                        ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300'
                        : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                    }`}
                  >
                    <div className="text-xs font-bold">{l.label}</div>
                    <div className="text-[9px] text-zinc-500 mt-0.5">{l.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold py-3.5 rounded-xl shadow-lg transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
              ) : (
                <><Wand2 className="w-4 h-4" /> Generate Content</>
              )}
            </button>
          </div>

          {/* Right: Output */}
          <div ref={outputRef} className="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 min-h-[400px]">
            {generating ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[350px] space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-white">Generating content...</p>
                  <p className="text-[10px] text-zinc-500 mt-1">AI is crafting your {CONTENT_TYPES.find(c => c.id === selectedType)?.label.toLowerCase()}</p>
                </div>
                <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse w-2/3" />
                </div>
              </div>
            ) : output ? (
              <div className="space-y-4">
                {/* Output toolbar */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-bold text-white">Generated Output</span>
                    <span className="text-[9px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full font-bold">
                      {output.split(/\s+/).length} words
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRegenerate}
                      className="flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300 text-[10px] font-semibold transition-all"
                    >
                      <RefreshCw className="w-3 h-3" /> Regenerate
                    </button>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white text-[10px] font-semibold transition-all"
                    >
                      {copied ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
                    </button>
                  </div>
                </div>

                {/* Rendered content */}
                <div className="prose prose-invert max-w-none text-sm leading-relaxed space-y-1">
                  {renderMarkdown(output)}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[350px] space-y-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                  <Wand2 className="w-8 h-8 text-zinc-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Your content will appear here</p>
                  <p className="text-[10px] text-zinc-500 mt-1">Select a content type, fill in the form, and hit Generate.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── CTA ──────────────────────────────────────────── */}
        <div className="relative bg-gradient-to-br from-blue-600/15 via-indigo-600/10 to-purple-600/15 border border-indigo-500/20 rounded-2xl p-8 text-center overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[150px] bg-indigo-600/10 rounded-full blur-[80px]" />
          </div>
          <div className="relative space-y-3">
            <h2 className="text-xl font-extrabold text-white">Need personalized module picks?</h2>
            <p className="text-zinc-400 text-xs max-w-md mx-auto">
              Our AI Recommendation Engine analyzes your startup and suggests the best LaunchPilot modules.
            </p>
            <Link
              href="/ai/recommendations"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all hover:scale-[1.02]"
            >
              Get AI Recommendations <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── FOOTER ──────────────────────────────────────────── */}
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
