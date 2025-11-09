const TOKEN_KEY = 'turnon.auth.token';
const USER_KEY = 'turnon.auth.user';

export function saveAuth(token: string, user: { email: string; name: string; role: string }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function loadAuth(): { token: string | null; user: { email: string; name: string; role: string } | null } {
  const token = localStorage.getItem(TOKEN_KEY);
  const raw = localStorage.getItem(USER_KEY);
  try {
    const user = raw ? (JSON.parse(raw) as { email: string; name: string; role: string }) : null;
    return { token, user };
  } catch {
    return { token, user: null };
  }
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}


