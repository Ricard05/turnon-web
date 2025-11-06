import { apiClient } from './apiClient';
import type { AuthResponse, LoginRequest, RegisterRequest } from './types';

export const AuthEndpoints = {
  login: '/api/auth/login',
  register: '/api/auth/register',
} as const;

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  return await apiClient.post<AuthResponse>(AuthEndpoints.login, payload);
}

export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  return await apiClient.post<AuthResponse>(AuthEndpoints.register, payload);
}


