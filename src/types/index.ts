export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Overdue';

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type TaskCategory = 
  | 'Inventory'
  | 'Visual Merchandising'
  | 'Customer Support'
  | 'Compliance & Safety'
  | 'Store Maintenance'
  | 'Staff & Scheduling'
  | 'Cash & POS Operations';

export interface Employee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  storeId: string;
  storeName: string;
}

export interface Store {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  assigneeId: string;
  assignee: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: string;
  };
  storeId: string;
  store: {
    id: string;
    name: string;
    code: string;
    city: string;
  };
  dueDate: string; // YYYY-MM-DD
  createdAt: string;
  updatedAt: string;
  tags: string[];
  estimatedHours?: number;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  status?: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  assigneeId: string;
  storeId: string;
  dueDate: string;
  tags?: string[];
  estimatedHours?: number;
}

export interface UpdateTaskPayload extends Partial<CreateTaskPayload> {
  status?: TaskStatus;
}

export interface TaskFilters {
  search: string;
  assigneeId: string; // 'all' or specific id
  storeId: string; // 'all' or specific id
  status: string; // 'all' | 'Pending' | 'In Progress' | 'Completed' | 'Overdue'
  priority: string; // 'all' | 'Low' | 'Medium' | 'High' | 'Urgent'
  category: string; // 'all' or specific category
  dateFilter: 'all' | 'today' | 'this_week' | 'overdue' | 'custom';
  startDate?: string;
  endDate?: string;
  sortBy: 'dueDate' | 'priority' | 'createdAt' | 'title' | 'status';
  sortOrder: 'asc' | 'desc';
}

export interface SummaryStats {
  total: number;
  pending: number;
  completed: number;
  overdue: number;
  inProgress: number;
  completionRate: number;
  urgentPending: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Regional Manager' | 'Store Manager' | 'Shift Lead' | 'Store Associate' | 'Admin';
  storeId?: string;
  storeName?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
