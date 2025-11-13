import { restoreAuth } from './storage';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    if (baseUrl) {
      this.baseUrl = baseUrl;
      return;
    }

    const envBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
    if (typeof envBaseUrl === 'string' && envBaseUrl.trim().length > 0) {
      this.baseUrl = envBaseUrl.trim();
      return;
    }

    throw new Error(
      '[ApiClient] Falta configurar la variable de entorno VITE_API_BASE_URL. Revisa tu archivo .env y las variables suministradas al build/despliegue.',
    );
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

    const text = await response.text();
    return text as unknown as T;
  }

  post<T>(path: string, body: unknown, init?: RequestInit) {
    return this.request<T>(path, 'POST', body, init);
  }

  put<T>(path: string, body: unknown, init?: RequestInit) {
    return this.request<T>(path, 'PUT', body, init);
  }

  patch<T>(path: string, body: unknown, init?: RequestInit) {
    return this.request<T>(path, 'PATCH', body, init);
  }

  get<T>(path: string, init?: RequestInit) {
    return this.request<T>(path, 'GET', undefined, init);
  }
}

export const apiClient = new ApiClient();


