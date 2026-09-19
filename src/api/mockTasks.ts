import type { 
  Task, 
  CreateTaskPayload, 
  UpdateTaskPayload, 
  TaskFilters, 
  SummaryStats, 
  TaskStatus,
  Employee,
  Store
} from '../types';
import { INITIAL_TASKS, EMPLOYEES, STORES } from './seedData';

const TASKS_STORAGE_KEY = 'taskflow_tasks_data';
const SIMULATE_ERROR_KEY = 'taskflow_simulate_api_error';

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

export const isErrorSimulationActive = (): boolean => {
  return localStorage.getItem(SIMULATE_ERROR_KEY) === 'true';
};

export const setErrorSimulation = (active: boolean) => {
  localStorage.setItem(SIMULATE_ERROR_KEY, active ? 'true' : 'false');
};

const getStoredTasks = (): Task[] => {
  const data = localStorage.getItem(TASKS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(INITIAL_TASKS));
    return INITIAL_TASKS;
  }
  try {
    return JSON.parse(data) as Task[];
  } catch {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(INITIAL_TASKS));
    return INITIAL_TASKS;
  }
};

const saveTasks = (tasks: Task[]) => {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
};

export const isTaskOverdue = (task: Task): boolean => {
  if (task.status === 'Completed') return false;
  if (task.status === 'Overdue') return true;
  
  const todayStr = new Date().toISOString().split('T')[0];
  return task.dueDate < todayStr;
};

export const getEffectiveStatus = (task: Task): TaskStatus => {
  if (task.status === 'Completed') return 'Completed';
  if (isTaskOverdue(task)) return 'Overdue';
  return task.status;
};

export const mockTasksApi = {
  async getTasks(filters?: Partial<TaskFilters>): Promise<Task[]> {
    await delay(300);

    if (isErrorSimulationActive()) {
      throw new Error('Simulated 500 Internal Server Error: Failed to retrieve tasks from server.');
    }

    let tasks = getStoredTasks();

    tasks = tasks.map(t => {
      const effective = getEffectiveStatus(t);
      if (effective === 'Overdue' && t.status !== 'Overdue' && t.status !== 'Completed') {
        return { ...t, status: 'Overdue' as TaskStatus };
      }
      return t;
    });

    if (!filters) return tasks;

    // Search Query
    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase().trim();
      tasks = tasks.filter(t => 
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.assignee.name.toLowerCase().includes(q) ||
        t.store.name.toLowerCase().includes(q) ||
        t.store.code.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    // Assignee Filter
    if (filters.assigneeId && filters.assigneeId !== 'all') {
      tasks = tasks.filter(t => t.assigneeId === filters.assigneeId);
    }

    // Store Filter
    if (filters.storeId && filters.storeId !== 'all') {
      tasks = tasks.filter(t => t.storeId === filters.storeId);
    }

    // Status Filter
    if (filters.status && filters.status !== 'all') {
      tasks = tasks.filter(t => {
        const effective = getEffectiveStatus(t);
        return effective === filters.status || t.status === filters.status;
      });
    }

    // Priority Filter
    if (filters.priority && filters.priority !== 'all') {
      tasks = tasks.filter(t => t.priority === filters.priority);
    }

    // Category Filter
    if (filters.category && filters.category !== 'all') {
      tasks = tasks.filter(t => t.category === filters.category);
    }

    // Date Filter
    if (filters.dateFilter && filters.dateFilter !== 'all') {
      const todayStr = new Date().toISOString().split('T')[0];
      const today = new Date();
      
      if (filters.dateFilter === 'today') {
        tasks = tasks.filter(t => t.dueDate === todayStr);
      } else if (filters.dateFilter === 'overdue') {
        tasks = tasks.filter(t => isTaskOverdue(t));
      } else if (filters.dateFilter === 'this_week') {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(today);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        const startStr = startOfWeek.toISOString().split('T')[0];
        const endStr = endOfWeek.toISOString().split('T')[0];
        tasks = tasks.filter(t => t.dueDate >= startStr && t.dueDate <= endStr);
      } else if (filters.dateFilter === 'custom') {
        if (filters.startDate) {
          tasks = tasks.filter(t => t.dueDate >= filters.startDate!);
        }
        if (filters.endDate) {
          tasks = tasks.filter(t => t.dueDate <= filters.endDate!);
        }
      }
    }

    // Sorting
    const sortBy = filters.sortBy || 'dueDate';
    const sortOrder = filters.sortOrder || 'asc';
    const multiplier = sortOrder === 'desc' ? -1 : 1;

    const priorityWeight = { Urgent: 4, High: 3, Medium: 2, Low: 1 };

    tasks.sort((a, b) => {
      if (sortBy === 'dueDate') {
        return a.dueDate.localeCompare(b.dueDate) * multiplier;
      }
      if (sortBy === 'priority') {
        return (priorityWeight[a.priority] - priorityWeight[b.priority]) * multiplier;
      }
      if (sortBy === 'createdAt') {
        return a.createdAt.localeCompare(b.createdAt) * multiplier;
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title) * multiplier;
      }
      if (sortBy === 'status') {
        return a.status.localeCompare(b.status) * multiplier;
      }
      return 0;
    });

    return tasks;
  },

  async getTaskById(id: string): Promise<Task> {
    await delay(200);

    if (isErrorSimulationActive()) {
      throw new Error('Simulated 404/500 API Error: Unable to fetch task details.');
    }

    const tasks = getStoredTasks();
    const found = tasks.find(t => t.id === id);
    if (!found) {
      throw new Error(`Task with ID "${id}" was not found.`);
    }
    return found;
  },

  async createTask(payload: CreateTaskPayload): Promise<Task> {
    await delay(400);

    if (isErrorSimulationActive()) {
      throw new Error('Simulated 500 API Error: Database write failed during task creation.');
    }

    if (!payload.title || payload.title.trim().length < 3) {
      throw new Error('Task title is required and must be at least 3 characters long.');
    }
    if (!payload.assigneeId) {
      throw new Error('An assigned employee must be selected.');
    }
    if (!payload.storeId) {
      throw new Error('A store location must be selected.');
    }
    if (!payload.dueDate) {
      throw new Error('A valid due date is required.');
    }

    const assignee = EMPLOYEES.find(e => e.id === payload.assigneeId);
    if (!assignee) throw new Error('Selected employee not found in directory.');

    const store = STORES.find(s => s.id === payload.storeId);
    if (!store) throw new Error('Selected store not found in directory.');

    const todayStr = new Date().toISOString().split('T')[0];
    let initialStatus: TaskStatus = payload.status || 'Pending';
    if (payload.dueDate < todayStr && initialStatus !== 'Completed') {
      initialStatus = 'Overdue';
    }

    const newTask: Task = {
      id: `TASK-${Math.floor(100 + Math.random() * 900)}`,
      title: payload.title.trim(),
      description: payload.description?.trim() || '',
      status: initialStatus,
      priority: payload.priority || 'Medium',
      category: payload.category || 'Inventory',
      assigneeId: assignee.id,
      assignee: {
        id: assignee.id,
        name: assignee.name,
        email: assignee.email,
        avatar: assignee.avatar,
        role: assignee.role,
      },
      storeId: store.id,
      store: {
        id: store.id,
        name: store.name,
        code: store.code,
        city: store.city,
      },
      dueDate: payload.dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: payload.tags || [payload.category],
      estimatedHours: payload.estimatedHours || 2,
    };

    const tasks = getStoredTasks();
    const updatedTasks = [newTask, ...tasks];
    saveTasks(updatedTasks);

    return newTask;
  },

  async updateTask(id: string, payload: UpdateTaskPayload): Promise<Task> {
    await delay(350);

    if (isErrorSimulationActive()) {
      throw new Error('Simulated 500 API Error: Server error while updating task.');
    }

    const tasks = getStoredTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error(`Task with ID "${id}" does not exist.`);
    }

    const currentTask = tasks[index];

    let assignee = currentTask.assignee;
    if (payload.assigneeId && payload.assigneeId !== currentTask.assigneeId) {
      const emp = EMPLOYEES.find(e => e.id === payload.assigneeId);
      if (emp) {
        assignee = {
          id: emp.id,
          name: emp.name,
          email: emp.email,
          avatar: emp.avatar,
          role: emp.role,
        };
      }
    }

    let store = currentTask.store;
    if (payload.storeId && payload.storeId !== currentTask.storeId) {
      const st = STORES.find(s => s.id === payload.storeId);
      if (st) {
        store = {
          id: st.id,
          name: st.name,
          code: st.code,
          city: st.city,
        };
      }
    }

    const updatedTask: Task = {
      ...currentTask,
      ...payload,
      assigneeId: payload.assigneeId || currentTask.assigneeId,
      assignee,
      storeId: payload.storeId || currentTask.storeId,
      store,
      tags: payload.tags || currentTask.tags,
      updatedAt: new Date().toISOString(),
    };

    const todayStr = new Date().toISOString().split('T')[0];
    if (updatedTask.status !== 'Completed' && updatedTask.dueDate < todayStr) {
      updatedTask.status = 'Overdue';
    } else if (updatedTask.status === 'Overdue' && updatedTask.dueDate >= todayStr) {
      updatedTask.status = 'Pending';
    }

    tasks[index] = updatedTask;
    saveTasks(tasks);

    return updatedTask;
  },

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    await delay(250);

    if (isErrorSimulationActive()) {
      throw new Error('Simulated Network Error: Failed to update status.');
    }

    const tasks = getStoredTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');

    const updatedTask: Task = {
      ...tasks[index],
      status,
      updatedAt: new Date().toISOString(),
    };

    tasks[index] = updatedTask;
    saveTasks(tasks);
    return updatedTask;
  },

  async deleteTask(id: string): Promise<boolean> {
    await delay(300);

    if (isErrorSimulationActive()) {
      throw new Error('Simulated 500 API Error: Could not delete task.');
    }

    const tasks = getStoredTasks();
    const filtered = tasks.filter(t => t.id !== id);
    saveTasks(filtered);
    return true;
  },

  async bulkDeleteTasks(ids: string[]): Promise<boolean> {
    await delay(350);
    const tasks = getStoredTasks();
    const idSet = new Set(ids);
    const filtered = tasks.filter(t => !idSet.has(t.id));
    saveTasks(filtered);
    return true;
  },

  async bulkUpdateStatus(ids: string[], status: TaskStatus): Promise<boolean> {
    await delay(350);
    const tasks = getStoredTasks();
    const idSet = new Set(ids);
    const updated = tasks.map(t => {
      if (idSet.has(t.id)) {
        return { ...t, status, updatedAt: new Date().toISOString() };
      }
      return t;
    });
    saveTasks(updated);
    return true;
  },

  async getSummaryStats(): Promise<SummaryStats> {
    await delay(200);

    if (isErrorSimulationActive()) {
      throw new Error('Failed to compute dashboard metrics due to API error.');
    }

    const tasks = getStoredTasks();
    const total = tasks.length;
    
    let pending = 0;
    let completed = 0;
    let overdue = 0;
    let inProgress = 0;
    let urgentPending = 0;

    tasks.forEach(t => {
      const effective = getEffectiveStatus(t);
      if (effective === 'Completed') {
        completed++;
      } else if (effective === 'Overdue') {
        overdue++;
        if (t.priority === 'Urgent' || t.priority === 'High') urgentPending++;
      } else if (effective === 'In Progress') {
        inProgress++;
        pending++;
        if (t.priority === 'Urgent' || t.priority === 'High') urgentPending++;
      } else {
        pending++;
        if (t.priority === 'Urgent' || t.priority === 'High') urgentPending++;
      }
    });

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      pending,
      completed,
      overdue,
      inProgress,
      completionRate,
      urgentPending,
    };
  },

  async getEmployees(): Promise<Employee[]> {
    await delay(150);
    return EMPLOYEES;
  },

  async getStores(): Promise<Store[]> {
    await delay(150);
    return STORES;
  },

  resetData(): void {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(INITIAL_TASKS));
  }
};
