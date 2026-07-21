'use client';

import React, { useState } from 'react';
import { useAuth } from '../app/providers';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { apiRequest } from '../utils/api';
import {
  LayoutDashboard,
  CheckSquare,
  MessageSquareCode,
  TrendingUp,
  Globe,
  Presentation,
  LogOut,
  Plus,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  FileText,
} from 'lucide-react';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
}

const navigation: SidebarItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Launch Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'AI Copilot', href: '/copilot', icon: MessageSquareCode },
  { name: 'AI Content', href: '/ai/content', icon: FileText },
  { name: 'AI Recommendations', href: '/ai/recommendations', icon: Sparkles },
  { name: 'Competitors', href: '/competitor', icon: TrendingUp },
  { name: 'Landing Page', href: '/landing-page', icon: Globe },
  { name: 'Pitch Deck', href: '/pitch-deck', icon: Presentation },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, projects, currentProject, setCurrentProject, fetchProjects } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Project creation modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projName, setProjName] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projIndustry, setProjIndustry] = useState('');
  const [projAudience, setProjAudience] = useState('');
  const [projDate, setProjDate] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    setModalLoading(true);
    try {
      const newProj = await apiRequest('/projects', {
        method: 'POST',
        body: JSON.stringify({
          name: projName,
          description: projDesc,
          industry: projIndustry,
          targetAudience: projAudience,
          launchDate: projDate || undefined,
        }),
      });
      await fetchProjects();
      setCurrentProject(newProj);
      setIsModalOpen(false);
      // Reset form
      setProjName('');
      setProjDesc('');
      setProjIndustry('');
      setProjAudience('');
      setProjDate('');
    } catch (err: any) {
      setModalError(err.message || 'Error creating project.');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-50 overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:w-64 md:flex-col bg-zinc-900 border-r border-zinc-800">
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center h-16 px-4 bg-zinc-950 border-b border-zinc-800/80">
            <span className="text-xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
              LaunchPilot
            </span>
          </div>

          {/* Project Switcher */}
          <div className="px-4 py-4 border-b border-zinc-800/60">
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Active Project
            </label>
            <div className="relative">
              {projects.length > 0 ? (
                <div className="relative">
                  <select
                    value={currentProject?._id || ''}
                    onChange={(e) => {
                      const found = projects.find((p) => p._id === e.target.value);
                      if (found) setCurrentProject(found);
                    }}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 appearance-none cursor-pointer pr-10"
                  >
                    {projects.map((proj) => (
                      <option key={proj._id} value={proj._id}>
                        {proj.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-zinc-400 pointer-events-none" />
                </div>
              ) : (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600/10 text-blue-400 border border-blue-600/20 rounded-lg py-2 text-xs font-semibold hover:bg-blue-600/20 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Create First Project
                </button>
              )}
            </div>
            {projects.length > 0 && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-2 w-full flex items-center justify-center gap-1.5 border border-dashed border-zinc-800 rounded-lg py-1.5 text-xs text-zinc-400 hover:border-zinc-700 hover:text-zinc-300 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> New Startup Idea
              </button>
            )}
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-zinc-800 text-white shadow-sm font-semibold border-l-2 border-blue-500 pl-2.5'
                      : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                      isActive ? 'text-blue-400' : 'text-zinc-400 group-hover:text-zinc-300'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex-shrink-0 flex border-t border-zinc-800 p-4 bg-zinc-950/40">
            <div className="flex items-center w-full justify-between">
              <div className="flex items-center min-w-0">
                <div className="h-9 w-9 rounded-full bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center font-bold text-indigo-400 text-sm">
                  {user?.name[0]?.toUpperCase() || 'F'}
                </div>
                <div className="ml-3 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate">{user?.name}</p>
                  <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Top Navigation & Drawer */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="md:hidden flex items-center justify-between h-16 px-4 bg-zinc-900 border-b border-zinc-800">
          <span className="text-lg font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            LaunchPilot
          </span>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-800 focus:outline-none"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden bg-zinc-950/80 backdrop-blur-sm">
            <div className="relative flex flex-col flex-1 w-full max-w-xs bg-zinc-900 border-r border-zinc-800">
              <div className="absolute top-0 right-0 p-1">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center w-10 h-10 rounded-full focus:outline-none hover:bg-zinc-800"
                >
                  <X className="w-6 h-6 text-zinc-400" />
                </button>
              </div>

              <div className="flex items-center h-16 px-4 bg-zinc-950 border-b border-zinc-800">
                <span className="text-xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  LaunchPilot
                </span>
              </div>

              {/* Project Swither Mobile */}
              <div className="px-4 py-4 border-b border-zinc-800/60">
                {projects.length > 0 ? (
                  <select
                    value={currentProject?._id || ''}
                    onChange={(e) => {
                      const found = projects.find((p) => p._id === e.target.value);
                      if (found) setCurrentProject(found);
                    }}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200"
                  >
                    {projects.map((proj) => (
                      <option key={proj._id} value={proj._id}>
                        {proj.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsModalOpen(true);
                    }}
                    className="w-full bg-blue-600 text-white rounded-lg py-2 text-xs font-semibold"
                  >
                    Create Project
                  </button>
                )}
              </div>

              <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`group flex items-center px-3 py-2.5 text-base font-medium rounded-lg ${
                        isActive ? 'bg-zinc-800 text-white border-l-2 border-blue-500 pl-2.5' : 'text-zinc-400 hover:bg-zinc-800/40'
                      }`}
                    >
                      <item.icon className="mr-4 h-6 w-6 text-zinc-400" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-zinc-800 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-indigo-600/20 flex items-center justify-center font-bold text-indigo-400">
                    {user?.name[0]?.toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-zinc-200">{user?.name}</p>
                  </div>
                </div>
                <button onClick={logout} className="text-zinc-400 hover:text-zinc-200">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto relative bg-zinc-950 p-4 md:p-8">
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center space-y-6">
              <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20 text-blue-400 animate-pulse">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold">Create your first Startup Project</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Welcome to LaunchPilot! Describe your startup idea, and our AI Copilot will automatically analyze your concept, lay out a customized 10-step launch roadmap, and configure your strategist chat space.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl py-3 font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all cursor-pointer shadow-lg"
              >
                <Plus className="w-5 h-5" /> Create Project
              </button>
            </div>
          ) : (
            children
          )}
        </main>
      </div>

      {/* Modal - Create Project */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" /> Let&apos;s build a new Startup
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-6 space-y-4">
              {modalError && (
                <div className="bg-red-950/30 border border-red-800/50 text-red-200 px-4 py-2.5 rounded-lg text-xs">
                  {modalError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Startup Name *
                </label>
                <input
                  type="text"
                  required
                  value={projName}
                  onChange={(e) => setProjName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  placeholder="e.g. Acme SaaS"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Product Description * (AI uses this to generate checklists & copy)
                </label>
                <textarea
                  required
                  rows={3}
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-none"
                  placeholder="What does your product do? What problem does it solve?"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={projIndustry}
                    onChange={(e) => setProjIndustry(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    placeholder="e.g. EdTech, FinTech"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={projAudience}
                    onChange={(e) => setProjAudience(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    placeholder="e.g. Indie Hackers, Designers"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Target Launch Date
                </label>
                <input
                  type="date"
                  value={projDate}
                  onChange={(e) => setProjDate(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg px-5 py-2.5 text-sm font-semibold hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 cursor-pointer"
                >
                  {modalLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Generating Launch Plan...
                    </>
                  ) : (
                    'Initiate Launch'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
