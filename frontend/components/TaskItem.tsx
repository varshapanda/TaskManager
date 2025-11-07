'use client';

import { Task } from '@/lib/api';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const priorityColors = {
    low: 'text-gray-500 bg-gray-100',
    medium: 'text-gray-700 bg-gray-200',
    high: 'text-black bg-gray-300',
  };

  const priorityLabels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  };

  return (
    <div className="group bg-white border border-gray-200 hover:border-gray-400 transition-all hover:shadow-sm">
      <div className="flex items-start gap-4 p-6">
        <button
          onClick={() => onToggle(task.id)}
          className="mt-1 flex-shrink-0"
        >
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
            task.completed 
              ? 'bg-black border-black' 
              : 'border-gray-300 hover:border-gray-500'
          }`}>
            {task.completed && (
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </button>
        
        <div className="flex-1 min-w-0">
          <h3 className={`text-base font-normal mb-1 transition-all ${
            task.completed 
              ? 'line-through text-gray-400' 
              : 'text-black'
          }`}>
            {task.title}
          </h3>
          
          {task.description && (
            <p className={`text-sm leading-relaxed mb-3 ${
              task.completed 
                ? 'text-gray-400' 
                : 'text-gray-600'
            }`}>
              {task.description}
            </p>
          )}
          
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`px-2 py-0.5 text-xs font-medium rounded ${priorityColors[task.priority]}`}>
              {priorityLabels[task.priority]}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(task.created_at).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>

        <button
          onClick={() => onDelete(task.id)}
          className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all flex-shrink-0 rounded"
          aria-label="Delete task"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}