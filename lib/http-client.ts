import { tokenStore } from './info.store';
import { refreshAccessToken } from './refresh-token';
import { ApiError } from './api-error';

const API_BASE_URL = 'https://localhost:7166/api';

export class HttpClient {
  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retry = true
  ): Promise<T> {
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...options.headers
    });

    const token = tokenStore.get();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include'
    });

    // 🔑 401 → tenta refresh → retry
    if (response.status === 401 && retry) {
      try {
        const newToken = await refreshAccessToken();
        return this.request<T>(
          endpoint,
          {
            ...options,
            headers: {
              ...headers,
              Authorization: `Bearer ${newToken}`
            }
          },
          false
        );
      } catch {
        this.redirectToLogin();
        throw new ApiError('Não autorizado', 401);
      }
    }

    if (!response.ok) {
      const message = await response.text();
      throw new ApiError(message || 'Erro inesperado', response.status);
    }

    if (response.status === 204) {
      return null as T;
    }

    return response.json();
  }

  get<T>(url: string) {
    return this.request<T>(url, { method: 'GET' });
  }

  post<T>(url: string, body?: any) {
    return this.request<T>(url, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined
    });
  }

  put<T>(url: string, body?: any) {
    return this.request<T>(url, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined
    });
  }

  delete<T>(url: string) {
    return this.request<T>(url, { method: 'DELETE' });
  }

  private redirectToLogin() {
    tokenStore.clear();
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }
}

export const httpClient = new HttpClient();
