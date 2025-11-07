'use client';

import { useState, useEffect } from 'react';
import { taskApi, Task, TaskCreate, TaskStats } from '@/lib/api';
import TaskForm from '@/components/TaskForm';
import TaskItem from '@/components/TaskItem';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskApi.getTasks();
      setTasks(data);
    } catch (err) {
      setError('Failed to fetch tasks. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await taskApi.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  useEffect(() => {
    if (mounted) {
      fetchTasks();
      fetchStats();
    }
  }, [mounted]);

  const handleCreateTask = async (task: TaskCreate) => {
    try {
      await taskApi.createTask(task);
      await fetchTasks();
      await fetchStats();
    } catch (err) {
      setError('Failed to create task');
      console.error(err);
    }
  };

  const handleToggleTask = async (id: number) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (task) {
        await taskApi.updateTask(id, { completed: !task.completed });
        await fetchTasks();
        await fetchStats();
      }
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await taskApi.deleteTask(id);
      await fetchTasks();
      await fetchStats();
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-light text-black mb-2 tracking-tight">Tasks</h1>
          <p className="text-gray-500 text-sm">Manage your daily tasks efficiently</p>
        </div>

        {/* Stats Dashboard */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white border border-gray-200 p-5 hover:shadow-sm transition-shadow">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total</p>
              <p className="text-3xl font-light text-black">{stats.total}</p>
            </div>
            <div className="bg-white border border-gray-200 p-5 hover:shadow-sm transition-shadow">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Completed</p>
              <p className="text-3xl font-light text-black">{stats.completed}</p>
            </div>
            <div className="bg-white border border-gray-200 p-5 hover:shadow-sm transition-shadow">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Pending</p>
              <p className="text-3xl font-light text-black">{stats.pending}</p>
            </div>
            <div className="bg-white border border-gray-200 p-5 hover:shadow-sm transition-shadow">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">High Priority</p>
              <p className="text-3xl font-light text-black">{stats.high_priority}</p>
            </div>
          </div>
        )}

        {/* Task Form */}
        <div className="mb-8">
          <TaskForm onSubmit={handleCreateTask} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 mb-6 rounded text-sm">
            {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-gray-200">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              filter === 'active'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              filter === 'completed'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-gray-500">Loading tasks...</p>
          </div>
        ) : (
          /* Task List */
          <div>
            {filteredTasks.length === 0 ? (
              <div className="bg-white border border-gray-200 p-16 text-center">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-gray-500 text-sm">
                  {filter === 'all' ? 'No tasks yet. Create your first task above.' : `No ${filter} tasks.`}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}