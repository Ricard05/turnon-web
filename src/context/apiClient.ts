import { loadAuth } from './storage';

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    const envBase = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
    this.baseUrl = baseUrl || envBase || 'http://localhost:8080';
  }

  private buildHeaders(extra?: HeadersInit): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...extra,
    };
    const { token } = loadAuth();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async post<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: this.buildHeaders(init?.headers),
      body: JSON.stringify(body),
      ...init,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(text || `HTTP ${res.status}`);
    }
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return (await res.json()) as T;
    }
    // @ts-expect-error: caller should know expected type
    return (await res.text()) as T;
  }
}

export const apiClient = new ApiClient();


