/**
 * Authentication context - Auth state management
 */

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as AuthService from './service';
import { clearAuthStorage, persistAuth, restoreAuth } from '../storage/localStorage';
import type { AuthResponse, AuthState } from '../types';

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (payload: Parameters<typeof AuthService.register>[0]) => Promise<AuthResponse>;
  logout: () => void;
  resetError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  error: null,
  token: null,
  user: null,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  const shouldAutoRestore =
    ((import.meta as any).env?.VITE_AUTH_AUTO_LOGIN ?? 'false') === 'true';

  useEffect(() => {
    if (!shouldAutoRestore) {
      return;
    }
    const { token, user } = restoreAuth();
    if (token && user) {
      setState({
        isAuthenticated: true,
        loading: false,
        error: null,
        token,
        user,
      });
    }
  }, [shouldAutoRestore]);

  const handleSuccess = (response: AuthResponse) => {
    const user = { email: response.email, name: response.name, role: response.role };
    persistAuth(response.token, user);
    setState({
      isAuthenticated: true,
      loading: false,
      error: null,
      token: response.token,
      user,
    });
  };

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const result = await AuthService.login({ email, password });
      handleSuccess(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo iniciar sesión';
      setState((prev) => ({ ...prev, loading: false, error: message }));
      throw error;
    }
  }, []);

  const register = useCallback<AuthContextValue['register']>(async (payload) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const result = await AuthService.register(payload);
      handleSuccess(result);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo registrar';
      setState((prev) => ({ ...prev, loading: false, error: message }));
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    clearAuthStorage();
    setState(initialState);
  }, []);

  const resetError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const value = useMemo<AuthContextValue>(() => ({ ...state, login, register, logout, resetError }), [state, login, register, logout, resetError]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
export type { AuthContextValue };
