import React from 'react';
import type { Task, TaskStatus } from '../../types';
import { Modal } from '../ui/Modal';
import { StatusBadge, PriorityBadge } from '../ui/Badge';
import { getDueDateBadgeStyle, formatDateDisplay, formatRelativeTime } from '../../utils/dateUtils';
import { 
  Building2, 
  Calendar, 
  Clock, 
  Tag, 
  Edit3, 
  Trash2 
} from 'lucide-react';
import { Button } from '../ui/Button';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onUpdateStatus: (taskId: string, status: TaskStatus) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  onClose,
  task,
  onEdit,
  onDelete,
  onUpdateStatus,
}) => {
  if (!task) return null;

  const dateBadge = getDueDateBadgeStyle(task.dueDate, task.status);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task.title}
      subtitle={`Task ID: ${task.id} · Created ${formatRelativeTime(task.createdAt)}`}
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Status, Priority & Quick Status Picker Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
          <div className="flex items-center gap-2">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            <span className="text-xs px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-medium">
              {task.category}
            </span>
          </div>

          {/* Quick status selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Status:</span>
            <select
              value={task.status}
              onChange={(e) => onUpdateStatus(task.id, e.target.value as TaskStatus)}
              className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none shadow-2xs"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>

        {/* Task Description */}
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Description & Instructions
          </h4>
          <p className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-slate-200/80 whitespace-pre-wrap">
            {task.description || 'No detailed instructions provided.'}
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Assignee Card */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center gap-3">
            <img
              src={task.assignee.avatar}
              alt={task.assignee.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
            />
            <div>
              <div className="text-xs text-slate-400 font-medium">Assigned To</div>
              <div className="text-sm font-bold text-slate-900">{task.assignee.name}</div>
              <div className="text-xs text-slate-500">{task.assignee.role}</div>
            </div>
          </div>

          {/* Store Card */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Store Location</div>
              <div className="text-sm font-bold text-slate-900">{task.store.name}</div>
              <div className="text-xs text-slate-500">
                {task.store.code} · {task.store.city}
              </div>
            </div>
          </div>

          {/* Due Date Card */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Due Date</div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>{formatDateDisplay(task.dueDate)}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${dateBadge.colorClass}`}>
                  {dateBadge.text}
                </span>
              </div>
            </div>
          </div>

          {/* Estimated Work Duration */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Estimated Time</div>
              <div className="text-sm font-bold text-slate-900">
                {task.estimatedHours || 2} hours
              </div>
              <div className="text-xs text-slate-500">Scheduled effort</div>
            </div>
          </div>
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Tags
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Modal Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              onClose();
              onDelete(task);
            }}
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Delete Task
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onEdit(task);
              }}
              leftIcon={<Edit3 className="w-4 h-4" />}
            >
              Edit Details
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onClose}
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
