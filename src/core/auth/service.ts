/**
 * Authentication service - API calls for auth
 */

import { apiClient } from '../api/client';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types';

const AUTH_ROUTES = {
  login: '/api/auth/login',
  register: '/api/auth/register',
} as const;

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>(AUTH_ROUTES.login, payload);
}

export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>(AUTH_ROUTES.register, payload);
}
