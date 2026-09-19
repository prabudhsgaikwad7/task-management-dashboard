import React from 'react';
import type { TaskPriority, TaskStatus } from '../../types';

interface StatusBadgeProps {
  status: TaskStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  const configs: Record<TaskStatus, { bg: string; text: string; dot: string }> = {
    'Pending': {
      bg: 'bg-amber-50 border border-amber-200/80',
      text: 'text-amber-800 font-medium',
      dot: 'bg-amber-500',
    },
    'In Progress': {
      bg: 'bg-blue-50 border border-blue-200/80',
      text: 'text-blue-800 font-medium',
      dot: 'bg-blue-500 animate-pulse',
    },
    'Completed': {
      bg: 'bg-emerald-50 border border-emerald-200/80',
      text: 'text-emerald-800 font-medium',
      dot: 'bg-emerald-500',
    },
    'Overdue': {
      bg: 'bg-rose-50 border border-rose-200/80',
      text: 'text-rose-800 font-semibold',
      dot: 'bg-rose-500',
    },
  };

  const config = configs[status] || configs['Pending'];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ${sizeClasses} ${config.bg} ${config.text} transition-colors select-none`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
};

interface PriorityBadgeProps {
  priority: TaskPriority;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  const configs: Record<TaskPriority, { bg: string; text: string; iconSymbol: string }> = {
    'Low': {
      bg: 'bg-slate-100 text-slate-700 border border-slate-200',
      text: 'text-slate-600',
      iconSymbol: '↓',
    },
    'Medium': {
      bg: 'bg-sky-50 text-sky-700 border border-sky-200',
      text: 'text-sky-700',
      iconSymbol: '→',
    },
    'High': {
      bg: 'bg-orange-50 text-orange-700 border border-orange-200 font-medium',
      text: 'text-orange-700',
      iconSymbol: '↑',
    },
    'Urgent': {
      bg: 'bg-red-100 text-red-800 border border-red-300 font-semibold',
      text: 'text-red-800',
      iconSymbol: '▲',
    },
  };

  const config = configs[priority] || configs['Medium'];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md ${sizeClasses} ${config.bg} ${config.text} select-none`}
    >
      <span className="text-[11px] leading-none font-bold">{config.iconSymbol}</span>
      {priority}
    </span>
  );
};
