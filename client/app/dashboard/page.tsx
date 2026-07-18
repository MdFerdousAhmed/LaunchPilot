'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../providers';
import { apiRequest } from '../../utils/api';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Globe,
  Plus
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  totalCompetitors: number;
  totalLandingPages: number;
}

export default function DashboardPage() {
  const { currentProject } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0,
    completedTasks: 0,
    totalCompetitors: 0,
    totalLandingPages: 0
  });
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    if (!currentProject) return;
    setLoading(true);
    try {
      // Parallel fetches for dashboard stats
      const [tasks, competitors, landingPages] = await Promise.all([
        apiRequest(`/tasks?projectId=${currentProject._id}`),
        apiRequest(`/competitors?projectId=${currentProject._id}`),
        apiRequest(`/landing-pages?projectId=${currentProject._id}`)
      ]);

      const completed = tasks.filter((t: any) => t.status === 'Done').length;
      setStats({
        totalTasks: tasks.length,
        completedTasks: completed,
        totalCompetitors: competitors.length,
        totalLandingPages: landingPages.length
      });

      const pending = tasks.filter((t: any) => t.status !== 'Done').slice(0, 3);
      setUpcomingTasks(pending);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [currentProject]);

  const score = currentProject ? currentProject.launchReadinessScore : 0;
  
  // Donut chart data for Launch Readiness
  const chartData = [
    { name: 'Completed', value: score },
    { name: 'Remaining', value: Math.max(0, 100 - score) }
  ];
  
  const COLORS = ['#3b82f6', '#1e293b']; // Blue vs Dark Gray

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-zinc-900 via-zinc-900 to-indigo-950/20 p-6 rounded-2xl border border-zinc-800/80">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
              🚀 Launch Control: {currentProject?.name}
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-xl">
              {currentProject?.description}
            </p>
          </div>
          {currentProject?.launchDate && (
            <div className="flex items-center gap-2 bg-zinc-950 px-4 py-2.5 rounded-xl border border-zinc-800/80 shrink-0">
              <Calendar className="w-4 h-4 text-blue-400" />
              <div className="text-left">
                <span className="block text-[10px] text-zinc-500 uppercase font-semibold">Target Launch</span>
                <span className="text-xs font-bold text-zinc-200">
                  {new Date(currentProject.launchDate).toLocaleDateString(undefined, {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Circular Progress Gauge */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-6">
              Launch Readiness
            </h3>
            
            <div className="w-44 h-44 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={80}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                  >
                    <Cell fill={COLORS[0]} />
                    <Cell fill={COLORS[1]} />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white">{score}%</span>
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Ready</span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs text-zinc-400 bg-zinc-950 px-3.5 py-1.5 rounded-full border border-zinc-850">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              <span>{stats.completedTasks} of {stats.totalTasks} milestones completed</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between hover:border-zinc-700/60 transition-all">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-emerald-600/10 text-emerald-400 rounded-xl border border-emerald-500/10">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <Link href="/tasks" className="text-zinc-500 hover:text-zinc-300 text-xs flex items-center gap-1 font-medium transition-colors">
                  View Tasks <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="mt-4">
                <span className="block text-2xl font-black text-white">
                  {stats.totalTasks - stats.completedTasks}
                </span>
                <span className="text-sm font-medium text-zinc-400">Tasks Left to Launch</span>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between hover:border-zinc-700/60 transition-all">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-blue-600/10 text-blue-400 rounded-xl border border-blue-500/10">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <Link href="/competitor" className="text-zinc-500 hover:text-zinc-300 text-xs flex items-center gap-1 font-medium transition-colors">
                  Analyze <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="mt-4">
                <span className="block text-2xl font-black text-white">
                  {stats.totalCompetitors}
                </span>
                <span className="text-sm font-medium text-zinc-400">Competitors Tracked</span>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between hover:border-zinc-700/60 transition-all">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-purple-600/10 text-purple-400 rounded-xl border border-purple-500/10">
                  <Globe className="w-6 h-6" />
                </div>
                <Link href="/landing-page" className="text-zinc-500 hover:text-zinc-300 text-xs flex items-center gap-1 font-medium transition-colors">
                  Builder <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="mt-4">
                <span className="block text-2xl font-black text-white">
                  {stats.totalLandingPages}
                </span>
                <span className="text-sm font-medium text-zinc-400">Landing Pages Created</span>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between hover:border-zinc-700/60 transition-all">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-amber-600/10 text-amber-400 rounded-xl border border-amber-500/10">
                  <Sparkles className="w-6 h-6" />
                </div>
                <Link href="/copilot" className="text-zinc-500 hover:text-zinc-300 text-xs flex items-center gap-1 font-medium transition-colors">
                  Chat Now <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="mt-4">
                <span className="block text-2xl font-black text-white">Gemini</span>
                <span className="text-sm font-medium text-zinc-400">AI Strategist Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Actions */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-400" /> Key Next Steps
              </h3>
              <Link href="/tasks" className="text-xs text-blue-400 hover:underline">
                View all tasks
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                <div className="h-12 bg-zinc-950 animate-pulse rounded-lg"></div>
                <div className="h-12 bg-zinc-950 animate-pulse rounded-lg"></div>
              </div>
            ) : upcomingTasks.length > 0 ? (
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div
                    key={task._id}
                    className="flex items-center justify-between p-3.5 bg-zinc-950 rounded-xl border border-zinc-850 hover:border-zinc-800 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                      <div>
                        <span className="block text-sm font-semibold text-zinc-200">{task.title}</span>
                        <span className="text-xs text-zinc-500 line-clamp-1">{task.description}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-1 bg-zinc-900 text-zinc-400 rounded-md border border-zinc-800">
                      {task.category}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center bg-zinc-950 rounded-xl border border-dashed border-zinc-800">
                <CheckCircle2 className="w-8 h-8 text-zinc-600 mb-2" />
                <span className="text-sm font-semibold text-zinc-400">All tasks completed!</span>
                <span className="text-xs text-zinc-500 mt-1">Ready for public launch.</span>
              </div>
            )}
          </div>

          {/* AI Strategy Advisor Brief */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" /> LaunchPilot Advice
            </h3>
            
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-850/80 text-sm text-zinc-300 leading-relaxed space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-2xl pointer-events-none"></div>
              <p>
                Based on your product focus in the <strong>{currentProject?.industry || 'tech'}</strong> sector, your highest priority is validating early consumer interest.
              </p>
              <ul className="list-disc pl-4 space-y-1.5 text-zinc-400 text-xs">
                <li>Generate an AI Landing Page to collect emails.</li>
                <li>Audit competitor prices to establish your pricing model.</li>
                <li>Draft a Pitch Deck using our outliner to refine your solution slide.</li>
              </ul>
            </div>
            
            <div className="flex gap-3">
              <Link
                href="/copilot"
                className="flex-1 text-center bg-zinc-950 border border-zinc-800 hover:bg-zinc-900 text-xs font-semibold py-2.5 rounded-xl transition-all"
              >
                Discuss Strategy
              </Link>
              <Link
                href="/landing-page"
                className="flex-1 text-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-semibold py-2.5 rounded-xl transition-all"
              >
                Generate Landing Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
