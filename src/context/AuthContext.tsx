import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { clearAuth, loadAuth, saveAuth } from './storage';
import * as AuthService from './authService';
import type { AuthResponse, AuthState } from './types';

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [{ isAuthenticated, token, user, loading, error }, setState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    user: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    const { token, user } = loadAuth();
    if (token && user) {
      setState((prev) => ({ ...prev, isAuthenticated: true, token, user }));
    }
  }, []);

  const applyAuth = (data: AuthResponse) => {
    const user = { email: data.email, name: data.name, role: data.role };
    saveAuth(data.token, user);
    setState({ isAuthenticated: true, token: data.token, user, loading: false, error: null });
  };

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const res = await AuthService.login({ email, password });
      applyAuth(res);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Login failed';
      setState((prev) => ({ ...prev, loading: false, error: message }));
      throw e;
    }
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setState({ isAuthenticated: false, token: null, user: null, loading: false, error: null });
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    isAuthenticated,
    token,
    user,
    loading,
    error,
    login,
    logout,
  }), [isAuthenticated, token, user, loading, error, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


