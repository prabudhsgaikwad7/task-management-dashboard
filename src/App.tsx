import React, { useState, useEffect, useCallback } from 'react';
import type { 
  Task, 
  TaskFilters as FilterType, 
  SummaryStats, 
  Employee, 
  Store, 
  CreateTaskPayload, 
  UpdateTaskPayload, 
  TaskStatus 
} from './types';
import { mockTasksApi } from './api/mockTasks';
import { ToastProvider, useToast } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { Header } from './components/dashboard/Header';
import { SummaryCards } from './components/dashboard/SummaryCards';
import { TaskFilters } from './components/dashboard/TaskFilters';
import { TaskTable } from './components/dashboard/TaskTable';
import { TaskModal } from './components/dashboard/TaskModal';
import { TaskDetailModal } from './components/dashboard/TaskDetailModal';
import { DeleteConfirmModal } from './components/dashboard/DeleteConfirmModal';
import { AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from './components/ui/Button';

const initialFilters: FilterType = {
  search: '',
  assigneeId: 'all',
  storeId: 'all',
  status: 'all',
  priority: 'all',
  category: 'all',
  dateFilter: 'all',
  sortBy: 'dueDate',
  sortOrder: 'asc',
};

const DashboardContent: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { success, error: toastError, info } = useToast();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<SummaryStats | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [filters, setFilters] = useState<FilterType>(initialFilters);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [viewingTask, setViewingTask] = useState<Task | null>(null);

  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Selection states for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Load static reference data (employees, stores)
  useEffect(() => {
    if (isAuthenticated) {
      Promise.all([mockTasksApi.getEmployees(), mockTasksApi.getStores()])
        .then(([emps, sts]) => {
          setEmployees(emps);
          setStores(sts);
        })
        .catch((err) => console.error('Failed to load metadata', err));
    }
  }, [isAuthenticated]);

  // Load tasks and summary stats
  const loadData = useCallback(async (currentFilters: FilterType) => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setFetchError(null);

    try {
      const [fetchedTasks, fetchedStats] = await Promise.all([
        mockTasksApi.getTasks(currentFilters),
        mockTasksApi.getSummaryStats(),
      ]);

      setTasks(fetchedTasks);
      setStats(fetchedStats);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred while fetching tasks.';
      setFetchError(msg);
      toastError('Data Fetch Error', msg);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, toastError]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData(filters);
    }
  }, [filters, isAuthenticated, loadData]);

  // Handle Filter Change
  const handleFilterChange = (newFilters: Partial<FilterType>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  // Quick filter status from summary cards
  const handleSummaryCardStatusSelect = (status: string) => {
    handleFilterChange({ status });
  };

  // Task CRUD Handlers
  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskSubmit = async (payload: CreateTaskPayload | UpdateTaskPayload): Promise<boolean> => {
    try {
      if (editingTask) {
        const updated = await mockTasksApi.updateTask(editingTask.id, payload);
        success('Task Updated', `Task "${updated.title}" was successfully updated.`);
        if (viewingTask?.id === updated.id) {
          setViewingTask(updated);
        }
      } else {
        const created = await mockTasksApi.createTask(payload as CreateTaskPayload);
        success('Task Created', `New task "${created.title}" was scheduled.`);
      }

      await loadData(filters);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save task.';
      toastError('Operation Failed', msg);
      throw err;
    }
  };

  // Single Task Status Update
  const handleUpdateStatus = async (taskId: string, newStatus: TaskStatus) => {
    try {
      const updated = await mockTasksApi.updateTaskStatus(taskId, newStatus);
      success('Status Updated', `Task status changed to ${newStatus}`);
      if (viewingTask?.id === taskId) {
        setViewingTask(updated);
      }
      await loadData(filters);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update task status.';
      toastError('Status Change Error', msg);
    }
  };

  // Delete Handlers
  const handleOpenDeleteSingle = (task: Task) => {
    setDeletingTask(task);
    setIsBulkDeleting(false);
    setIsDeleteModalOpen(true);
  };

  const handleOpenDeleteBulk = () => {
    if (selectedIds.length === 0) return;
    setDeletingTask(null);
    setIsBulkDeleting(true);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      if (isBulkDeleting) {
        await mockTasksApi.bulkDeleteTasks(selectedIds);
        success('Tasks Deleted', `Successfully deleted ${selectedIds.length} tasks.`);
        setSelectedIds([]);
      } else if (deletingTask) {
        await mockTasksApi.deleteTask(deletingTask.id);
        success('Task Deleted', `Task "${deletingTask.title}" has been deleted.`);
        if (viewingTask?.id === deletingTask.id) {
          setViewingTask(null);
        }
      }
      setIsDeleteModalOpen(false);
      await loadData(filters);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete task.';
      toastError('Delete Failed', msg);
    } finally {
      setIsDeleting(false);
    }
  };

  // Bulk Status Update
  const handleBulkStatusChange = async (newStatus: TaskStatus) => {
    if (selectedIds.length === 0) return;
    try {
      await mockTasksApi.bulkUpdateStatus(selectedIds, newStatus);
      success('Bulk Update Complete', `Updated ${selectedIds.length} tasks to ${newStatus}.`);
      setSelectedIds([]);
      await loadData(filters);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Bulk update failed.';
      toastError('Bulk Action Error', msg);
    }
  };

  // Selection toggles
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === tasks.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(tasks.map((t) => t.id));
    }
  };

  // Reset Mock Data to Default
  const handleResetData = () => {
    mockTasksApi.resetData();
    info('Data Reset', 'Mock database re-seeded with initial sample records.');
    loadData(filters);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <Header
        onOpenCreateModal={handleOpenCreateModal}
        onRefresh={() => loadData(filters)}
        onResetData={handleResetData}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome and Greeting */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Task Management Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Monitor retail floor operations, compliance timelines, and staff assignments.
            </p>
          </div>

          <div className="text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs self-start sm:self-auto flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Store Feed Live</span>
          </div>
        </div>

        {/* Global Fetch Error Banner */}
        {fetchError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-200 shadow-xs">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-rose-900">API Connection Error</h4>
                <p className="text-xs text-rose-700 mt-0.5">{fetchError}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadData(filters)}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              className="border-rose-300 text-rose-800 bg-white hover:bg-rose-100/50 self-end sm:self-auto"
            >
              Retry Request
            </Button>
          </div>
        )}

        {/* Summary Metric Cards */}
        <SummaryCards
          stats={stats}
          isLoading={isLoading && !tasks.length}
          activeStatusFilter={filters.status}
          onSelectStatus={handleSummaryCardStatusSelect}
        />

        {/* Search & Multi-Filters */}
        <TaskFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
          employees={employees}
          stores={stores}
        />

        {/* Task Table & Mobile Card List */}
        <TaskTable
          tasks={tasks}
          isLoading={isLoading}
          onEditTask={handleOpenEditModal}
          onViewTask={(task) => setViewingTask(task)}
          onDeleteTask={handleOpenDeleteSingle}
          onUpdateStatus={handleUpdateStatus}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onBulkStatusChange={handleBulkStatusChange}
          onBulkDelete={handleOpenDeleteBulk}
          onResetFilters={handleResetFilters}
        />
      </main>

      {/* Task Create / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        taskToEdit={editingTask}
        onSubmit={handleTaskSubmit}
        employees={employees}
        stores={stores}
      />

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={Boolean(viewingTask)}
        onClose={() => setViewingTask(null)}
        task={viewingTask}
        onEdit={(task) => {
          setViewingTask(null);
          handleOpenEditModal(task);
        }}
        onDelete={(task) => {
          setViewingTask(null);
          handleOpenDeleteSingle(task);
        }}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        taskToDelete={deletingTask}
        bulkCount={isBulkDeleting ? selectedIds.length : undefined}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>TaskFlow Dashboard &copy; {new Date().getFullYear()} — Enterprise Retail Operations</span>
          <span>Responsive Dashboard · React + TypeScript + Mock API</span>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <DashboardContent />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
