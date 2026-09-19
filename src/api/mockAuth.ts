import type { User, AuthResponse } from '../types';

export const DEMO_USERS: (User & { passwordHash: string })[] = [
  {
    id: 'user-admin',
    name: 'Sarah Jenkins',
    email: 'admin@taskflow.internal',
    passwordHash: 'admin123',
    role: 'Regional Manager',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    storeName: 'Downtown Flagship',
    storeId: 'store-1',
  },
  {
    id: 'user-manager',
    name: 'Marcus Chen',
    email: 'manager@taskflow.internal',
    passwordHash: 'manager123',
    role: 'Store Manager',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    storeName: 'Downtown Flagship',
    storeId: 'store-1',
  },
  {
    id: 'user-staff',
    name: 'Elena Rodriguez',
    email: 'staff@taskflow.internal',
    passwordHash: 'staff123',
    role: 'Shift Lead',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    storeName: 'Westside Galleria',
    storeId: 'store-2',
  },
];

const AUTH_STORAGE_KEY = 'taskflow_auth_session';

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockAuthApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    await delay(500);

    const normalizedEmail = email.trim().toLowerCase();
    const user = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.passwordHash === password
    );

    if (!user) {
      throw new Error('Invalid email or password. Please check your credentials.');
    }

    const token = `fake-jwt-${user.id}-${Date.now()}`;
    const { passwordHash: _, ...safeUser } = user;

    const authResponse: AuthResponse = {
      user: safeUser,
      token,
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authResponse));
    return authResponse;
  },

  async getCurrentUser(): Promise<AuthResponse | null> {
    await delay(200);
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as AuthResponse;
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
  },

  async logout(): Promise<void> {
    await delay(200);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },
};
