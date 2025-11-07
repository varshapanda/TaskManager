'use client';

import { Task } from '@/lib/api';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const priorityLabels = {
    low: 'LOW',
    medium: 'MEDIUM',
    high: 'HIGH',
  };

  return (
    <div className="bg-white border border-gray-200 p-6 hover:border-gray-400 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            className="mt-1 w-5 h-5 accent-black cursor-pointer"
          />
          
          <div className="flex-1">
            <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-400' : 'text-black'}`}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className={`mt-2 text-sm leading-relaxed ${task.completed ? 'text-gray-400' : 'text-gray-700'}`}>
                {task.description}
              </p>
            )}
            
            <div className="mt-4 flex items-center gap-4">
              <span className="text-xs font-semibold text-gray-600 tracking-wide">
                {priorityLabels[task.priority]}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(task.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onDelete(task.id)}
          className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 transition-colors flex-shrink-0"
          aria-label="Delete task"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}