import { restoreAuth } from './storage';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    const envBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
    this.baseUrl = baseUrl || envBaseUrl || 'http://localhost:8080';
  }

  private buildHeaders(initial?: HeadersInit): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const { token } = restoreAuth();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    if (initial) {
      return { ...headers, ...initial };
    }
    return headers;
  }

  private async request<T>(path: string, method: HttpMethod, body?: unknown, init?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: this.buildHeaders(init?.headers),
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...init,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(errorText || `HTTP ${response.status}`);
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      return (await response.json()) as T;
    }

    // @ts-expect-error: callers should know returned type
    return (await response.text()) as T;
  }

  post<T>(path: string, body: unknown, init?: RequestInit) {
    return this.request<T>(path, 'POST', body, init);
  }

  get<T>(path: string, init?: RequestInit) {
    return this.request<T>(path, 'GET', undefined, init);
  }
}

export const apiClient = new ApiClient();


