/**
 * Cliente HTTP centralizado com interceptadores de autenticação
 * 
 * Funcionalidades:
 * - Adiciona token de autorização automaticamente
 * - Gerencia refresh automático de tokens via cookie
 * - Detecta header X-New-Access-Token para renovação automática
 * - Redirect automático para login em caso de 401
 * - Suporte a multi-tenancy seguindo especificações da API Clerus
 * 
 * Baseado no README-AUTH.md e README-ENDPOINTS.md
 */

// Base URL da API conforme especificado no README-AUTH.md
const API_BASE_URL = 'https://localhost:7166';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiError {
  message: string;
  status: number;
  response?: Response;
}

class HttpClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Obtém o token de acesso armazenado localmente
   */
  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  /**
   * Armazena o novo token de acesso
   */
  private setAccessToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('accessToken', token);
  }

  /**
   * Remove o token de acesso
   */
  private removeAccessToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('accessToken');
  }

  /**
   * Redireciona para a página de login
   */
  private redirectToLogin(): void {
    if (typeof window === 'undefined') return;
    
    // Remove token inválido
    this.removeAccessToken();
    
    // Redireciona para login se não estiver já lá
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  }

  /**
   * Executa uma requisição HTTP com interceptadores de autenticação
   */
  async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Prepara headers padrão
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(typeof options.headers === 'object' && options.headers !== null && !Array.isArray(options.headers) ? options.headers as Record<string, string> : {}),
    };

    // Adiciona token de autorização se disponível
    const token = this.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Configurações da requisição
    const requestConfig: RequestInit = {
      ...options,
      headers,
      credentials: 'include', // IMPORTANTE: Envia cookies (refresh token)
    };

    try {
      const response = await fetch(url, requestConfig);

      // Verifica se houve renovação automática de token (middleware do backend)
      const newAccessToken = response.headers.get('X-New-Access-Token');
      if (newAccessToken) {
        this.setAccessToken(newAccessToken);
        console.log('🔄 Token renovado automaticamente');
      }

      // Trata erro 401 - Token inválido ou expirado
      if (response.status === 401) {
        console.log('🔑 Token inválido - redirecionando para login');
        this.redirectToLogin();
        throw new ApiError('Não autorizado', 401, response);
      }

      // Trata outros erros HTTP
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
        throw new ApiError(
          errorData.message || `Erro HTTP ${response.status}`,
          response.status,
          response
        );
      }

      // Para logout (204 No Content), retorna resposta vazia
      if (response.status === 204) {
        return {
          success: true,
          message: 'Operação realizada com sucesso',
          data: null as any
        };
      }

      // Parse da resposta JSON
      const data = await response.json();
      return data;

    } catch (error) {
      // Re-throw ApiError
      if (error instanceof ApiError) {
        throw error;
      }

      // Trata erros de rede
      console.error('❌ Erro de requisição:', error);
      throw new ApiError(
        'Erro de conexão. Verifique sua internet.',
        0
      );
    }
  }

  /**
   * Métodos HTTP de conveniência
   */
  async get<T = any>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T = any>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = any>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = any>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * Requisições para endpoints de autenticação (sem token)
   * Usado para signup, identify e login
   */
  async authRequest<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const requestConfig: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Para receber refresh token via cookie
    };

    try {
      const response = await fetch(url, requestConfig);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
        throw new ApiError(
          errorData.message || `Erro HTTP ${response.status}`,
          response.status,
          response
        );
      }

      const data = await response.json();
      return data;

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      console.error('❌ Erro de requisição de auth:', error);
      throw new ApiError(
        'Erro de conexão. Verifique sua internet.',
        0
      );
    }
  }
}

// Classe personalizada para erros da API
export class ApiError extends Error {
  status: number;
  response?: Response;

  constructor(message: string, status: number, response?: Response) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
  }
}

// Instância singleton do cliente HTTP
export const httpClient = new HttpClient();

// Export da classe para casos especiais
export default HttpClient;