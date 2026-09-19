import React, { useState } from 'react';
import type { Task, TaskStatus } from '../../types';
import { StatusBadge, PriorityBadge } from '../ui/Badge';
import { getDueDateBadgeStyle } from '../../utils/dateUtils';
import { 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle, 
  Clock, 
  Building2,
  Calendar,
  Layers,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { TableRowSkeleton } from '../ui/Skeleton';

interface TaskTableProps {
  tasks: Task[];
  isLoading: boolean;
  onEditTask: (task: Task) => void;
  onViewTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onUpdateStatus: (taskId: string, status: TaskStatus) => void;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onBulkStatusChange: (status: TaskStatus) => void;
  onBulkDelete: () => void;
  onResetFilters: () => void;
}

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  isLoading,
  onEditTask,
  onViewTask,
  onDeleteTask,
  onUpdateStatus,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onBulkStatusChange,
  onBulkDelete,
  onResetFilters,
}) => {
  const [openStatusDropdown, setOpenStatusDropdown] = useState<string | null>(null);

  const isAllSelected = tasks.length > 0 && selectedIds.length === tasks.length;
  const isPartiallySelected = selectedIds.length > 0 && selectedIds.length < tasks.length;

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    onUpdateStatus(taskId, newStatus);
    setOpenStatusDropdown(null);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-500">Task Details</th>
              <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-500">Assignee</th>
              <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-500">Store</th>
              <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-500">Status</th>
              <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-500">Priority</th>
              <th className="py-3.5 px-4 text-left text-xs font-semibold text-slate-500">Due Date</th>
              <th className="py-3.5 px-4 text-right text-xs font-semibold text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
          </tbody>
        </table>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <Layers className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-slate-800">No tasks found</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-5">
          We couldn't find any tasks matching your selected filters or search terms.
        </p>
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          Reset All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Floating Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="sticky top-20 z-20 mb-4 bg-slate-900 text-white rounded-2xl p-3.5 px-5 shadow-xl flex flex-wrap items-center justify-between gap-3 border border-slate-800 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold bg-brand-500 px-2 py-0.5 rounded-full text-white">
              {selectedIds.length}
            </span>
            <span className="text-xs font-medium text-slate-200">
              {selectedIds.length === 1 ? 'task selected' : 'tasks selected'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onBulkStatusChange('Completed')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Mark Completed
            </button>
            <button
              onClick={() => onBulkStatusChange('In Progress')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
            >
              <Clock className="w-3.5 h-3.5" />
              Set In Progress
            </button>
            <button
              onClick={onBulkDelete}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600/90 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Selected
            </button>
            <button
              onClick={onToggleSelectAll}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 transition-colors"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-visible">
        <div className="overflow-x-auto overflow-y-visible">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isPartiallySelected;
                    }}
                    onChange={onToggleSelectAll}
                    className="w-4 h-4 rounded text-brand-600 border-slate-300 focus:ring-brand-500 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Task Title & Details
                </th>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Employee
                </th>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Store
                </th>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Priority
                </th>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="py-3.5 px-4 text-right text-xs font-bold text-slate-600 uppercase tracking-wider w-24">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {tasks.map((task) => {
                const isSelected = selectedIds.includes(task.id);
                const dateBadge = getDueDateBadgeStyle(task.dueDate, task.status);

                return (
                  <tr
                    key={task.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isSelected ? 'bg-brand-50/30' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-4 px-4 align-top">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(task.id)}
                        className="w-4 h-4 rounded text-brand-600 border-slate-300 focus:ring-brand-500 cursor-pointer mt-1"
                      />
                    </td>

                    {/* Task Title & Description */}
                    <td className="py-4 px-4 align-top max-w-sm">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-slate-400 font-medium">
                            {task.id}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                            {task.category}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onViewTask(task)}
                          className="text-left font-semibold text-slate-900 hover:text-brand-600 transition-colors text-sm leading-snug"
                        >
                          {task.title}
                        </button>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-1">
                          {task.description}
                        </p>
                      </div>
                    </td>

                    {/* Assignee */}
                    <td className="py-4 px-4 align-top whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={task.assignee.avatar}
                          alt={task.assignee.name}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <div className="text-xs font-semibold text-slate-800 leading-tight">
                            {task.assignee.name}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {task.assignee.role}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Store */}
                    <td className="py-4 px-4 align-top whitespace-nowrap">
                      <div className="flex items-start gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-xs font-medium text-slate-800 leading-tight">
                            {task.store.name}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {task.store.code} · {task.store.city}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status Changer Dropdown */}
                    <td className="py-4 px-4 align-top whitespace-nowrap relative">
                      <div className="relative inline-block text-left">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenStatusDropdown(
                              openStatusDropdown === task.id ? null : task.id
                            )
                          }
                          className="inline-flex items-center gap-1 group focus:outline-none"
                        >
                          <StatusBadge status={task.status} />
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform" />
                        </button>

                        {/* Status Popup Menu */}
                        {openStatusDropdown === task.id && (
                          <>
                            <div
                              className="fixed inset-0 z-30"
                              onClick={() => setOpenStatusDropdown(null)}
                            />
                            <div className="absolute left-0 mt-1 w-36 rounded-xl bg-white shadow-xl border border-slate-100 py-1.5 z-40 animate-in fade-in duration-100">
                              {(['Pending', 'In Progress', 'Completed', 'Overdue'] as TaskStatus[]).map(
                                (st) => (
                                  <button
                                    key={st}
                                    type="button"
                                    onClick={() => handleStatusChange(task.id, st)}
                                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 flex items-center justify-between ${
                                      task.status === st
                                        ? 'font-bold text-brand-600 bg-brand-50/50'
                                        : 'text-slate-700'
                                    }`}
                                  >
                                    <span>{st}</span>
                                    {task.status === st && (
                                      <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
                                    )}
                                  </button>
                                )
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="py-4 px-4 align-top whitespace-nowrap">
                      <PriorityBadge priority={task.priority} />
                    </td>

                    {/* Due Date */}
                    <td className="py-4 px-4 align-top whitespace-nowrap">
                      <div className="flex flex-col">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs ${dateBadge.colorClass}`}
                        >
                          {dateBadge.text}
                        </span>
                      </div>
                    </td>

                    {/* Actions Menu */}
                    <td className="py-4 px-4 align-top text-right whitespace-nowrap relative">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onViewTask(task)}
                          title="View Details"
                          className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditTask(task)}
                          title="Edit Task"
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteTask(task)}
                          title="Delete Task"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View (< 768px) */}
      <div className="md:hidden space-y-3">
        {tasks.map((task) => {
          const isSelected = selectedIds.includes(task.id);
          const dateBadge = getDueDateBadgeStyle(task.dueDate, task.status);

          return (
            <div
              key={task.id}
              className={`p-4 rounded-2xl bg-white border transition-all ${
                isSelected
                  ? 'border-brand-500 bg-brand-50/20 shadow-xs'
                  : 'border-slate-200/90 shadow-xs'
              }`}
            >
              {/* Top Row */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(task.id)}
                    className="w-4 h-4 rounded text-brand-600 border-slate-300 focus:ring-brand-500"
                  />
                  <span className="text-xs font-mono text-slate-400">{task.id}</span>
                  <PriorityBadge priority={task.priority} size="sm" />
                </div>
                <StatusBadge status={task.status} size="sm" />
              </div>

              {/* Title & Desc */}
              <button
                type="button"
                onClick={() => onViewTask(task)}
                className="text-left font-bold text-slate-900 text-sm mb-1 hover:text-brand-600 line-clamp-2"
              >
                {task.title}
              </button>
              <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                {task.description}
              </p>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs py-2 border-t border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <img
                    src={task.assignee.avatar}
                    alt={task.assignee.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="text-slate-700 font-medium truncate">
                    {task.assignee.name}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-600">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{task.store.code}</span>
                </div>

                <div className="col-span-2 flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className={`px-2 py-0.5 rounded-md ${dateBadge.colorClass}`}>
                      {dateBadge.text}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile Quick Status & Action Buttons */}
              <div className="flex items-center justify-between gap-2">
                <select
                  value={task.status}
                  onChange={(e) =>
                    onUpdateStatus(task.id, e.target.value as TaskStatus)
                  }
                  className="text-xs font-medium bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Overdue">Overdue</option>
                </select>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onViewTask(task)}
                    className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-lg"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEditTask(task)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteTask(task)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
