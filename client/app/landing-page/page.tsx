'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../providers';
import { apiRequest } from '../../utils/api';
import { Sparkles, Play, Code, Eye, Trash2, Plus, Download, Copy, Check } from 'lucide-react';

interface LandingPageItem {
  _id: string;
  title: string;
  prompt: string;
  htmlCode: string;
  cssCode: string;
  createdAt: string;
}

export default function LandingPagePage() {
  const { currentProject } = useAuth();
  const [pages, setPages] = useState<LandingPageItem[]>([]);
  const [activePage, setActivePage] = useState<LandingPageItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Tab states: Code vs Preview
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');

  const fetchPages = async () => {
    if (!currentProject) return;
    setLoading(true);
    try {
      const data = await apiRequest<LandingPageItem[]>(`/landing-pages?projectId=${currentProject._id}`);
      setPages(data);
      if (data.length > 0) {
        setActivePage(data[0]);
      } else {
        setActivePage(null);
      }
    } catch (err) {
      console.error('Error fetching landing pages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, [currentProject]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !currentProject || generating) return;

    setGenerating(true);
    try {
      const newPage = await apiRequest<LandingPageItem>('/landing-pages/generate', {
        method: 'POST',
        body: JSON.stringify({
          projectId: currentProject._id,
          prompt,
          title: `Waitlist Page - ${new Date().toLocaleDateString()}`
        })
      });
      setPages((prev) => [newPage, ...prev]);
      setActivePage(newPage);
      setPrompt('');
    } catch (err) {
      console.error('Error generating page:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this landing page template?')) return;
    try {
      await apiRequest(`/landing-pages/${id}`, { method: 'DELETE' });
      setPages((prev) => prev.filter((p) => p._id !== id));
      if (activePage?._id === id) {
        setActivePage(pages.find((p) => p._id !== id) || null);
      }
    } catch (err) {
      console.error('Error deleting landing page:', err);
    }
  };

  const handleCopyCode = () => {
    if (!activePage) return;
    const combinedCode = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${activePage.title}</title>
  <style>
    ${activePage.cssCode}
  </style>
</head>
<body>
  ${activePage.htmlCode}
</body>
</html>
    `.trim();

    navigator.clipboard.writeText(combinedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Compile full iframe source
  const getIframeSrc = () => {
    if (!activePage) return '';
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            html, body { margin: 0; padding: 0; width: 100%; min-height: 100%; background: #0b0f19; color: #f3f4f6; font-family: sans-serif; }
            ${activePage.cssCode}
          </style>
        </head>
        <body>
          ${activePage.htmlCode}
        </body>
      </html>
    `;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 h-[calc(100vh-8rem)] min-h-[500px] flex flex-col">
        {/* Header bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-900 pb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-400" /> AI Landing Page Builder
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Describe your launch theme and get a fully functional, styled responsive landing page with waiting list.
            </p>
          </div>
        </div>

        {/* Builder Content Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden min-h-0">
          {/* Left panel: Prompt & Templates list */}
          <div className="flex flex-col gap-4 overflow-y-auto lg:border-r lg:border-zinc-900 lg:pr-6 min-h-0">
            {/* Generation input form */}
            <form onSubmit={handleGenerate} className="space-y-3">
              <div>
                <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Generate New Page
                </label>
                <textarea
                  rows={3}
                  required
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your design (e.g. 'A sleek Waitlist page for Acme SaaS with glowing neon CTA button')"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={generating || !prompt.trim()}
                className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-lg py-2 text-xs font-semibold hover:opacity-95 disabled:opacity-50 cursor-pointer shadow-md"
              >
                {generating ? (
                  <>
                    <div className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Coding Page...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Build Landing Page
                  </>
                )}
              </button>
            </form>

            {/* Historical list */}
            <div className="space-y-2 mt-4 flex-1">
              <span className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                Saved Templates ({pages.length})
              </span>
              
              {loading ? (
                <div className="space-y-2">
                  <div className="h-10 bg-zinc-900 animate-pulse rounded-lg"></div>
                  <div className="h-10 bg-zinc-900 animate-pulse rounded-lg"></div>
                </div>
              ) : pages.length > 0 ? (
                <div className="space-y-1.5">
                  {pages.map((p) => {
                    const isActive = activePage?._id === p._id;
                    return (
                      <div
                        key={p._id}
                        onClick={() => setActivePage(p)}
                        className={`group flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          isActive
                            ? 'bg-zinc-800 border-zinc-700 text-white font-semibold'
                            : 'bg-zinc-900/40 border-zinc-850 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                        }`}
                      >
                        <div className="min-w-0">
                          <span className="block text-xs truncate">{p.title}</span>
                          <span className="block text-[9px] text-zinc-500 truncate mt-0.5">{p.prompt}</span>
                        </div>
                        <button
                          onClick={(e) => handleDelete(p._id, e)}
                          className="p-1 rounded text-zinc-600 hover:text-red-400 hover:bg-zinc-950 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-zinc-650 text-xs border border-dashed border-zinc-850 rounded-xl">
                  No landing pages coded yet.
                </div>
              )}
            </div>
          </div>

          {/* Right panel: Active preview / code editor */}
          <div className="lg:col-span-3 flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden min-h-0">
            {activePage ? (
              <div className="flex flex-col h-full min-h-0">
                {/* Editor Top Bar */}
                <div className="px-4 py-3 bg-zinc-950 border-b border-zinc-850 flex items-center justify-between shrink-0">
                  <span className="text-xs font-bold text-zinc-300">{activePage.title}</span>
                  
                  <div className="flex items-center gap-3">
                    {/* Toggle Preview / Code */}
                    <div className="bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg flex">
                      <button
                        onClick={() => setViewMode('preview')}
                        className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                          viewMode === 'preview'
                            ? 'bg-zinc-800 text-white'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" /> Preview
                      </button>
                      <button
                        onClick={() => setViewMode('code')}
                        className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                          viewMode === 'code'
                            ? 'bg-zinc-800 text-white'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <Code className="w-3.5 h-3.5" /> HTML Code
                      </button>
                    </div>

                    {/* Copy and download buttons */}
                    <button
                      onClick={handleCopyCode}
                      className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1 text-[10px] font-bold uppercase cursor-pointer"
                      title="Copy combined HTML/CSS"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy Code
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Main Workspace Frame */}
                <div className="flex-1 bg-zinc-950 overflow-hidden min-h-0">
                  {viewMode === 'preview' ? (
                    <iframe
                      srcDoc={getIframeSrc()}
                      title="Live Code Preview"
                      sandbox="allow-scripts"
                      className="w-full h-full border-none bg-zinc-950"
                    />
                  ) : (
                    <div className="w-full h-full p-4 overflow-y-auto font-mono text-[11px] text-emerald-400 leading-relaxed bg-zinc-950 scrollbar-thin select-text">
                      <pre className="whitespace-pre-wrap select-text">
                        {`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${activePage.title}</title>
  <style>
${activePage.cssCode}
  </style>
</head>
<body>
${activePage.htmlCode}
</body>
</html>`}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-zinc-500 gap-3">
                <Eye className="w-14 h-14 text-zinc-700 animate-pulse" />
                <h4 className="text-zinc-400 font-semibold text-sm">No page selected</h4>
                <p className="text-zinc-500 text-xs max-w-xs leading-relaxed">
                  Enter your waitlist design instructions on the left to generate fully editable code.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
