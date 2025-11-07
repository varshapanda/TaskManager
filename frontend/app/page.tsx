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

  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen bg-white text-black py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="border-b border-black pb-8 mb-12">
          <h1 className="text-5xl font-light text-black mb-3 tracking-tight">TASK MANAGER</h1>
          <p className="text-sm text-gray-700 font-light">Professional task management system</p>
        </div>

        {/* Stats Dashboard */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="border border-black p-6">
              <p className="text-xs font-semibold text-gray-700 tracking-wider mb-2">TOTAL TASKS</p>
              <p className="text-4xl font-light text-black">{stats.total}</p>
            </div>
            <div className="border border-black p-6">
              <p className="text-xs font-semibold text-gray-700 tracking-wider mb-2">COMPLETED</p>
              <p className="text-4xl font-light text-black">{stats.completed}</p>
            </div>
            <div className="border border-black p-6">
              <p className="text-xs font-semibold text-gray-700 tracking-wider mb-2">PENDING</p>
              <p className="text-4xl font-light text-black">{stats.pending}</p>
            </div>
            <div className="border border-black p-6">
              <p className="text-xs font-semibold text-gray-700 tracking-wider mb-2">HIGH PRIORITY</p>
              <p className="text-4xl font-light text-black">{stats.high_priority}</p>
            </div>
          </div>
        )}

        {/* Task Form */}
        <div className="mb-12">
          <TaskForm onSubmit={handleCreateTask} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="border border-black bg-black text-white px-6 py-4 mb-8">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent"></div>
            <p className="mt-4 text-sm text-gray-600">Loading tasks...</p>
          </div>
        ) : (
          /* Task List */
          <div>
            <h2 className="text-2xl font-light text-black mb-8 tracking-tight border-b border-gray-300 pb-4">
              TASKS ({tasks.length})
            </h2>
            {tasks.length === 0 ? (
              <div className="border border-gray-300 p-12 text-center">
                <p className="text-sm text-gray-600">No tasks yet. Create your first task above.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
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