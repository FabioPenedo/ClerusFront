import { tokenStore } from './info.store';
import { ApiError } from './api-error';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const API_BASE_URL = 'https://localhost:7166/api';

export class HttpClient {
  /**
   * Método principal de requisição
   */
  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retry = true
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = this.getHeaders(options.headers);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });

      // 1. Intercepta renovação de token (Silent Refresh via Header)
      this.handleTokenRefresh(response);

      // 2. Lida com Unauthorized (401)
      if (response.status === 401 && retry) {
        return this.handleUnauthorized<T>(endpoint, options);
      }

      // 3. Verifica sucesso da requisição HTTP
      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      // 4. Retorno vazio (204 No Content)
      if (response.status === 204) return null as T;

      // 5. Parse do Body e validação do padrão ApiResponse
      const result: ApiResponse<T> = await response.json();
      
      if (!result.success) {
        throw new ApiError(result.message || 'Erro da API', response.status);
      }

      return result.data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Falha na comunicação com o servidor', 500);
    }
  }

  // --- Métodos Auxiliares Privados ---

  private getHeaders(customHeaders?: HeadersInit): Headers {
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...customHeaders,
    });

    const token = tokenStore.get();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  private handleTokenRefresh(response: Response) {
    const newAccessToken = response.headers.get('X-New-Access-Token');
    if (newAccessToken) tokenStore.set(newAccessToken);
  }

  private async handleUnauthorized<T>(endpoint: string, options: RequestInit): Promise<T> {
    const refreshedToken = tokenStore.get();
    
    // Se temos um novo token (atualizado no passo anterior), tenta de novo
    if (refreshedToken) {
      return this.request<T>(endpoint, options, false);
    }

    this.redirectToLogin();
    throw new ApiError('Sessão expirada', 401);
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    let errorMessage = 'Erro inesperado';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = await response.text();
    }
    throw new ApiError(errorMessage, response.status);
  }

  private redirectToLogin() {
    tokenStore.clear();
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }

  // --- Métodos de Conveniência ---

  get<T>(url: string, options?: RequestInit) {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  post<T>(url: string, body?: any, options?: RequestInit) {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(url: string, body?: any, options?: RequestInit) {
    return this.request<T>(url, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  patch<T>(url: string, body?: any, options?: RequestInit) {
    return this.request<T>(url, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(url: string, options?: RequestInit) {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }
}

export const httpClient = new HttpClient();