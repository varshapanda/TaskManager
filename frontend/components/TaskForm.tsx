'use client';

import { useState } from 'react';
import { TaskCreate } from '@/lib/api';

interface TaskFormProps {
  onSubmit: (task: TaskCreate) => void;
  onCancel?: () => void;
}

export default function TaskForm({ onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        completed: false,
      });
      setTitle('');
      setDescription('');
      setPriority('medium');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-300 p-8 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-6">
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-0 py-2 border-0 border-b border-gray-200 bg-transparent text-2xl font-light text-black focus:outline-none focus:border-black transition-colors placeholder-gray-400"
          placeholder="Task title"
          required
        />
      </div>

      <div className="mb-6">
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-0 py-2 border-0 bg-transparent text-base text-gray-700 focus:outline-none placeholder-gray-400 resize-none"
          placeholder="Add description..."
          rows={3}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="px-3 py-1.5 text-xs font-medium border border-gray-300 bg-white text-gray-700 focus:outline-none focus:border-black transition-colors rounded"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>

        <div className="flex gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-1.5 text-sm font-medium text-gray-600 hover:text-black transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-1.5 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors rounded"
          >
            Add Task
          </button>
        </div>
      </div>
    </form>
  );
}