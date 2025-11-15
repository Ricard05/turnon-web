/**
 * Local storage utilities for authentication
 */

import type { AuthUser } from '../types';

const TOKEN_KEY = 'turnon.auth.token';
const USER_KEY = 'turnon.auth.user';

export function persistAuth(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function restoreAuth(): { token: string | null; user: AuthUser | null } {
  const token = localStorage.getItem(TOKEN_KEY);
  const userRaw = localStorage.getItem(USER_KEY);
  if (!userRaw) {
    return { token, user: null };
  }
  try {
    const user = JSON.parse(userRaw) as AuthUser;
    return { token, user };
  } catch {
    localStorage.removeItem(USER_KEY);
    return { token, user: null };
  }
}

export function clearAuthStorage() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
