export type UserRole = 'ADMIN' | 'USER' | string;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  lastName: string;
  age: number;
  email: string;
  password: string;
  phone?: string;
  companyId?: number | null;
  role?: UserRole;
  status?: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  name: string;
  role: UserRole;
  message?: string;
}

export interface AuthUser {
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  token: string | null;
  user: AuthUser | null;
}


