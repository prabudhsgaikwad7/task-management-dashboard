import React, { useState, useEffect } from 'react';
import type { 
  Task, 
  CreateTaskPayload, 
  UpdateTaskPayload, 
  Employee, 
  Store, 
  TaskPriority, 
  TaskCategory,
  TaskStatus 
} from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { 
  AlertCircle, 
  User, 
  Store as StoreIcon, 
  Calendar, 
  FileText, 
  Tag, 
  Clock, 
  Layers 
} from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
  onSubmit: (payload: CreateTaskPayload | UpdateTaskPayload) => Promise<boolean>;
  employees: Employee[];
  stores: Store[];
}

const CATEGORIES: TaskCategory[] = [
  'Inventory',
  'Visual Merchandising',
  'Customer Support',
  'Compliance & Safety',
  'Store Maintenance',
  'Staff & Scheduling',
  'Cash & POS Operations',
];

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  taskToEdit,
  onSubmit,
  employees,
  stores,
}) => {
  const isEditing = Boolean(taskToEdit);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [storeId, setStoreId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [category, setCategory] = useState<TaskCategory>('Inventory');
  const [status, setStatus] = useState<TaskStatus>('Pending');
  const [estimatedHours, setEstimatedHours] = useState<number>(2);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setAssigneeId(taskToEdit.assigneeId);
      setStoreId(taskToEdit.storeId);
      setDueDate(taskToEdit.dueDate);
      setPriority(taskToEdit.priority);
      setCategory(taskToEdit.category);
      setStatus(taskToEdit.status);
      setEstimatedHours(taskToEdit.estimatedHours || 2);
      setTags(taskToEdit.tags || []);
    } else {
      const defaultEmp = employees[0]?.id || '';
      const defaultStore = stores[0]?.id || '';
      const defaultDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];

      setTitle('');
      setDescription('');
      setAssigneeId(defaultEmp);
      setStoreId(defaultStore);
      setDueDate(defaultDate);
      setPriority('Medium');
      setCategory('Inventory');
      setStatus('Pending');
      setEstimatedHours(2);
      setTags(['Inventory']);
    }
    setErrors({});
    setApiError(null);
  }, [taskToEdit, isOpen, employees, stores]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Task title is required.';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters.';
    }

    if (!assigneeId) {
      newErrors.assigneeId = 'Please assign an employee.';
    }

    if (!storeId) {
      newErrors.storeId = 'Please select a store location.';
    }

    if (!dueDate) {
      newErrors.dueDate = 'Due date is required.';
    }

    if (estimatedHours < 0.5 || estimatedHours > 100) {
      newErrors.estimatedHours = 'Estimated hours must be between 0.5 and 100.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(/^#/, '');
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreateTaskPayload | UpdateTaskPayload = {
        title: title.trim(),
        description: description.trim(),
        assigneeId,
        storeId,
        dueDate,
        priority,
        category,
        status,
        tags: tags.length > 0 ? tags : [category],
        estimatedHours,
      };

      const success = await onSubmit(payload);
      if (success) {
        onClose();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred while saving the task.';
      setApiError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Task (${taskToEdit?.id})` : 'Create New Operational Task'}
      subtitle={
        isEditing
          ? 'Update task specifications, assignee, and schedule.'
          : 'Assign a new task to store staff with deadline and priority.'
      }
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* API Error Alert Banner */}
        {apiError && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Validation / API Error:</span> {apiError}
            </div>
          </div>
        )}

        {/* Task Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Task Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors({ ...errors, title: '' });
            }}
            placeholder="e.g. Conduct weekly stock inventory count in Aisle 3"
            className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 ${
              errors.title
                ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/20'
                : 'border-slate-300 focus:ring-brand-500 focus:border-transparent'
            }`}
          />
          {errors.title && (
            <p className="text-xs text-rose-600 mt-1 font-medium">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            Description & Instructions
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide specific guidelines, safety steps, or deliverables..."
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>

        {/* 2-Column Grid: Assignee & Store */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Assign To Employee <span className="text-rose-500">*</span>
            </label>
            <select
              value={assigneeId}
              onChange={(e) => {
                setAssigneeId(e.target.value);
                if (errors.assigneeId) setErrors({ ...errors, assigneeId: '' });
              }}
              className={`w-full px-3 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 ${
                errors.assigneeId
                  ? 'border-rose-400 focus:ring-rose-400'
                  : 'border-slate-300 focus:ring-brand-500'
              }`}
            >
              <option value="">Select Employee...</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} — {emp.role}
                </option>
              ))}
            </select>
            {errors.assigneeId && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.assigneeId}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <StoreIcon className="w-3.5 h-3.5 text-slate-400" />
              Store Location <span className="text-rose-500">*</span>
            </label>
            <select
              value={storeId}
              onChange={(e) => {
                setStoreId(e.target.value);
                if (errors.storeId) setErrors({ ...errors, storeId: '' });
              }}
              className={`w-full px-3 py-2.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 ${
                errors.storeId
                  ? 'border-rose-400 focus:ring-rose-400'
                  : 'border-slate-300 focus:ring-brand-500'
              }`}
            >
              <option value="">Select Store...</option>
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
            {errors.storeId && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.storeId}</p>
            )}
          </div>
        </div>

        {/* 3-Column Grid: Due Date, Priority, Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Due Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Due Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
                if (errors.dueDate) setErrors({ ...errors, dueDate: '' });
              }}
              className={`w-full px-3 py-2 bg-white border rounded-xl text-xs focus:outline-none focus:ring-2 ${
                errors.dueDate
                  ? 'border-rose-400 focus:ring-rose-400'
                  : 'border-slate-300 focus:ring-brand-500'
              }`}
            />
            {errors.dueDate && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.dueDate}</p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>

        {/* 2-Column Grid: Category & Est Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              Department / Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TaskCategory)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Est. Work Duration (Hours)
            </label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              max="100"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(parseFloat(e.target.value) || 1)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            Tags (Press Enter to add)
          </label>
          <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl min-h-[42px]">
            {tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-brand-100 text-brand-800 text-xs font-medium"
              >
                #{t}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(t)}
                  className="hover:text-brand-950 ml-0.5"
                >
                  &times;
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder={tags.length === 0 ? 'Type tag and press Enter...' : 'Add more...'}
              className="flex-1 bg-transparent text-xs outline-none min-w-[120px] px-1"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            className="font-semibold px-6"
          >
            {isEditing ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
