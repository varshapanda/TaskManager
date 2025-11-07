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
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-8 mb-12">
      <h2 className="text-2xl font-light text-black mb-6">New Task</h2>
      
      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-medium text-black mb-3">
          TITLE
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 bg-white text-black focus:outline-none focus:border-black transition-colors placeholder-gray-400"
          placeholder="Enter task title"
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="description" className="block text-sm font-medium text-black mb-3">
          DESCRIPTION
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 bg-white text-black focus:outline-none focus:border-black transition-colors placeholder-gray-400 resize-none"
          placeholder="Enter task description"
          rows={4}
        />
      </div>

      <div className="mb-8">
        <label htmlFor="priority" className="block text-sm font-medium text-black mb-3">
          PRIORITY
        </label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
          className="w-full px-4 py-3 border border-gray-200 bg-white text-black focus:outline-none focus:border-black transition-colors"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
        >
          Add Task
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-white border border-gray-300 text-black font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}