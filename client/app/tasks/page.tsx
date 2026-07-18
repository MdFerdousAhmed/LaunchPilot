'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../providers';
import { apiRequest } from '../../utils/api';
import {
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  Filter,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface TaskItem {
  _id: string;
  title: string;
  description: string;
  category: 'Development' | 'Marketing' | 'Legal' | 'Product' | 'Launch' | 'Other';
  status: 'Todo' | 'InProgress' | 'Done';
  dueDate?: string;
}

const CATEGORIES = ['All', 'Product', 'Development', 'Marketing', 'Legal', 'Launch'];

export default function TasksPage() {
  const { currentProject, fetchProjects } = useAuth();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('All');
  
  // Custom task form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<'Development' | 'Marketing' | 'Legal' | 'Product' | 'Launch' | 'Other'>('Product');
  const [newDueDate, setNewDueDate] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const fetchTasks = async () => {
    if (!currentProject) return;
    setLoading(true);
    try {
      const data = await apiRequest<TaskItem[]>(`/tasks?projectId=${currentProject._id}`);
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [currentProject]);

  const handleToggleStatus = async (taskId: string, currentStatus: string) => {
    let nextStatus: 'Todo' | 'InProgress' | 'Done' = 'Todo';
    if (currentStatus === 'Todo') nextStatus = 'InProgress';
    else if (currentStatus === 'InProgress') nextStatus = 'Done';
    
    try {
      const updated = await apiRequest(`/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: nextStatus })
      });
      
      // Update local state
      setTasks((prev) => prev.map((t) => (t._id === taskId ? updated : t)));
      
      // Refresh project to update launch readiness score
      await fetchProjects();
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await apiRequest(`/tasks/${taskId}`, {
        method: 'DELETE'
      });
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      await fetchProjects();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !currentProject) return;
    setActionLoading(true);
    
    try {
      const created = await apiRequest('/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
          category: newCategory,
          dueDate: newDueDate || undefined,
          projectId: currentProject._id
        })
      });
      
      setTasks((prev) => [...prev, created]);
      setShowAddForm(false);
      
      // Reset form
      setNewTitle('');
      setNewDesc('');
      setNewCategory('Product');
      setNewDueDate('');
      
      await fetchProjects();
    } catch (err) {
      console.error('Error creating task:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRegenerateTasks = async () => {
    if (!currentProject) return;
    const confirmRegen = confirm('Warning: This will clear all existing tasks and replace them with a brand new AI-generated checklist based on your startup idea. Proceed?');
    if (!confirmRegen) return;
    
    setRegenerating(true);
    try {
      const newTasks = await apiRequest<TaskItem[]>('/tasks/regenerate', {
        method: 'POST',
        body: JSON.stringify({ projectId: currentProject._id })
      });
      setTasks(newTasks);
      await fetchProjects();
    } catch (err) {
      console.error('Error regenerating tasks:', err);
    } finally {
      setRegenerating(false);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filterCategory === 'All') return true;
    return task.category.toLowerCase() === filterCategory.toLowerCase();
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Milestones & Launch Tasks
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Complete key milestones to improve your Launch Readiness.
            </p>
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={handleRegenerateTasks}
              disabled={regenerating}
              className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold py-2.5 px-4 rounded-xl transition-all disabled:opacity-50 text-indigo-400 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              {regenerating ? 'Regenerating checklist...' : 'AI Regenerate Blueprint'}
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-semibold py-2.5 px-4 rounded-xl transition-all cursor-pointer text-white shadow-lg"
            >
              <Plus className="w-4 h-4" /> Add Task
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 border-b border-zinc-900 pb-4">
          <Filter className="w-4 h-4 text-zinc-500 mr-2" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                filterCategory === cat
                  ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tasks List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-16 bg-zinc-900/60 border border-zinc-800 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : filteredTasks.length > 0 ? (
          <div className="space-y-3">
            {filteredTasks.map((task) => {
              const isTodo = task.status === 'Todo';
              const isProgress = task.status === 'InProgress';
              const isDone = task.status === 'Done';
              
              return (
                <div
                  key={task._id}
                  className={`group flex items-start gap-4 p-4 rounded-2xl border transition-all ${
                    isDone 
                      ? 'bg-zinc-900/20 border-zinc-900/60 opacity-60' 
                      : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700/60'
                  }`}
                >
                  {/* Status Toggle Circle */}
                  <button
                    onClick={() => handleToggleStatus(task._id, task.status)}
                    className="mt-0.5 shrink-0 text-zinc-400 hover:text-blue-400 transition-colors cursor-pointer"
                    title="Change status"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-500/10" />
                    ) : isProgress ? (
                      <Clock className="w-6 h-6 text-amber-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-zinc-600 hover:border-zinc-500" />
                    )}
                  </button>

                  {/* Task Metadata */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`text-sm font-semibold text-white ${isDone ? 'line-through text-zinc-500' : ''}`}>
                        {task.title}
                      </h3>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-zinc-950 text-zinc-400 rounded-md border border-zinc-850">
                        {task.category}
                      </span>
                      {isProgress && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded-md border border-amber-500/20">
                          In Progress
                        </span>
                      )}
                    </div>
                    {task.description && (
                      <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">{task.description}</p>
                    )}
                    {task.dueDate && (
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 pt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Trash action */}
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="p-1 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-zinc-950 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-zinc-900/20 rounded-2xl border border-dashed border-zinc-800">
            <AlertCircle className="w-10 h-10 text-zinc-650 mb-3 animate-bounce" />
            <h3 className="text-base font-bold text-zinc-400">No tasks found</h3>
            <p className="text-zinc-500 text-xs mt-1 max-w-sm">
              Use the filter tabs or trigger the AI blueprint generator above to kick off your launch checklist.
            </p>
          </div>
        )}

        {/* Modal - Add custom task */}
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
                <h3 className="text-lg font-bold text-white">Add Launch Task</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    placeholder="e.g. Set up custom subdomain"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-none"
                    placeholder="Provide details about this milestone..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-200"
                    >
                      <option value="Product">Product</option>
                      <option value="Development">Development</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Legal">Legal</option>
                      <option value="Launch">Launch</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-5 py-2 text-sm font-semibold cursor-pointer"
                  >
                    {actionLoading ? 'Saving...' : 'Add Task'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
