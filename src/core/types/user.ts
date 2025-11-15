/**
 * User types - User account management
 */

export type UserStatus = 'ACTIVE' | 'INACTIVE' | string;

export interface UserAccount {
  id: string;
  name: string;
  lastName?: string;
  age?: number;
  email: string;
  phone?: string;
  companyId?: number;
  companyName?: string;
  role: string;
  status: UserStatus;
  lastAccessAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FetchUsersOptions {
  signal?: AbortSignal;
}

export interface CreateUserPayload {
  name: string;
  lastName?: string;
  age?: number;
  email: string;
  password: string;
  phone?: string;
  companyId: number;
  role: string;
  status?: UserStatus;
}

export interface UpdateUserPayload {
  name: string;
  lastName?: string;
  age?: number;
  email: string;
  password?: string;
  phone?: string;
  companyId: number;
  role: string;
  status: UserStatus;
}

/**
 * Raw user data from API (untyped)
 */
export type RawUser = Record<string, unknown>;

/**
 * Dashboard user representation for UI
 */
export interface DashboardUser {
  id: string;
  firstName: string;
  lastName?: string;
  age?: number;
  role: string;
  email: string;
  phone: string;
  status: 'Activo' | 'Inactivo';
  lastAccess: string;
  companyId?: number;
  password?: string;
}
