/**
 * Serviço de autenticação seguindo as especificações da API Clerus
 * 
 * Implementa os endpoints definidos no README-AUTH.md e README-ENDPOINTS.md:
 * - POST /api/auth/signup
 * - POST /api/auth/identify  
 * - POST /api/auth/login
 * - POST /api/auth/logout
 * 
 * Características:
 * - Multi-tenancy com fluxo identify → tenant selection → login
 * - Refresh token automático via cookies HTTP-only
 * - AccessToken armazenado em localStorage
 * - Tratamento de erros específicos da API
 */

import { httpClient, ApiError } from '../httpClient';

// Tipos baseados nas especificações dos READMEs

export interface SignupRequest {
  tenantName: string;
  locality: number; // enum: BR, US, etc
  userName: string;
  email: string;
  phone: string; // formato: "+5511999999999"
  password: string;
}

export interface SignupResponse {
  accessToken: string;
  expiresIn: number; // tempo em minutos
}

export interface IdentifyRequest {
  email: string;
}

export interface IdentifyResponse {
  mode: 'single' | 'multiple';
  tenants: Array<{
    tenantId: number;
    tenantName: string;
  }>;
}

export interface LoginRequest {
  email: string;
  password: string;
  tenantId: number;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number; // tempo em minutos
}

// Estrutura do JWT decodificado conforme README-AUTH.md
export interface JWTPayload {
  sub: string;        // User ID
  tenant_id: string;  // Tenant ID
  role: string;       // Role do usuário (Admin, User)
  exp: number;        // Timestamp de expiração
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  tenantId: string;
  tenantName: string;
}

/**
 * Serviço de autenticação
 */
class AuthService {
  private readonly AUTH_ENDPOINTS = {
    signup: '/api/auth/signup',
    identify: '/api/auth/identify', 
    login: '/api/auth/login',
    logout: '/api/auth/logout'
  };

  /**
   * Cadastro de novo usuário (cria tenant + usuário admin)
   * Conforme especificado no README-AUTH.md
   */
  async signup(data: SignupRequest): Promise<SignupResponse> {
    try {
      console.log('🚀 Iniciando cadastro...');
      
      const response = await httpClient.authRequest<SignupResponse>(
        this.AUTH_ENDPOINTS.signup,
        {
          method: 'POST',
          body: JSON.stringify(data)
        }
      );

      // Armazena o access token conforme especificação
      if (response.accessToken) {
        this.setAccessToken(response.accessToken);
        console.log('✅ Cadastro realizado com sucesso');
      }

      return response;
    } catch (error) {
      console.error('❌ Erro no cadastro:', error);
      
      if (error instanceof ApiError) {
        // Personaliza mensagens de erro baseadas no status
        switch (error.status) {
          case 400:
            throw new Error('Dados inválidos. Verifique os campos obrigatórios ou se o email já está cadastrado.');
          case 500:
            throw new Error('Erro interno do servidor. Tente novamente mais tarde.');
          default:
            throw new Error(error.message);
        }
      }
      
      throw new Error('Erro ao criar conta. Tente novamente.');
    }
  }

  /**
   * Identificação de usuário - retorna tenants associados
   * Conforme especificado no README-AUTH.md
   */
  async identify(email: string): Promise<IdentifyResponse> {
    try {
      console.log('🔍 Identificando usuário:', email);
      
      const response = await httpClient.authRequest(
        this.AUTH_ENDPOINTS.identify,
        {
          method: 'POST',
          body: JSON.stringify({ email }) 
        }
      );

      console.log(response)

      console.log('✅ Usuário identificado:', response.mode);
      return response;
    } catch (error) {
      console.error('❌ Erro na identificação:', error);
      
      if (error instanceof ApiError) {
        switch (error.status) {
          case 401:
            throw new Error('Email não encontrado no sistema.');
          case 400:
            throw new Error('Email inválido.');
          default:
            throw new Error(error.message);
        }
      }
      
      throw new Error('Erro ao identificar usuário. Tente novamente.');
    }
  }

  /**
   * Login com tenant específico
   * Conforme especificado no README-AUTH.md
   */
  async login(email: string, password: string, tenantId: number): Promise<LoginResponse> {
    try {
      console.log('🔑 Realizando login para tenant:', tenantId);
      
      const loginData: LoginRequest = {
        email,
        password,
        tenantId
      };

      const response = await httpClient.authRequest<LoginResponse>(
        this.AUTH_ENDPOINTS.login,
        {
          method: 'POST',
          body: JSON.stringify(loginData)
        }
      );

      console.log(response)

      // Armazena o access token
      if (response.accessToken) {
        this.setAccessToken(response.accessToken);
        console.log('✅ Login realizado com sucesso');
      }

      return response;
    } catch (error) {
      console.error('❌ Erro no login:', error);
      
      if (error instanceof ApiError) {
        switch (error.status) {
          case 401:
            throw new Error('Email, senha ou tenant incorretos.');
          case 400:
            throw new Error('Dados inválidos.');
          default:
            throw new Error(error.message);
        }
      }
      
      throw new Error('Erro ao fazer login. Tente novamente.');
    }
  }

  /**
   * Logout - revoga refresh token e limpa token local
   * Conforme especificado no README-AUTH.md
   */
  async logout(): Promise<void> {
    try {
      console.log('👋 Fazendo logout...');
      
      // Chama endpoint de logout que revoga o refresh token
      await httpClient.post(this.AUTH_ENDPOINTS.logout);
      
      // Remove token local
      this.removeAccessToken();
      
      console.log('✅ Logout realizado com sucesso');
    } catch (error) {
      console.error('❌ Erro no logout:', error);
      
      // Mesmo com erro, remove token local para garantir logout
      this.removeAccessToken();
      
      // Não lança erro - logout deve sempre "funcionar" do ponto de vista do usuário
    }
  }

  /**
   * Obtém o token de acesso atual
   */
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  /**
   * Armazena o token de acesso
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
   * Verifica se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    console.log('🔐 Verificando autenticação com token:', token);

    try {
      // Decodifica o JWT para verificar expiração
      const payload = this.decodeToken(token);
      const now = Math.floor(Date.now() / 1000);
      
      return payload.exp > now;
    } catch {
      // Token inválido
      this.removeAccessToken();
      return false;
    }
  }

  /**
   * Decodifica o JWT para obter os dados do usuário
   * IMPORTANTE: Não valida assinatura - apenas para leitura de dados
   */
  decodeToken(token?: string): JWTPayload {
    const accessToken = token || this.getAccessToken();
    if (!accessToken) {
      throw new Error('Token não encontrado');
    }

    try {
      // Decodifica a parte payload do JWT (base64)
      const payload = accessToken.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      throw new Error('Token inválido');
    }
  }

  /**
   * Obtém dados do usuário atual do token JWT
   */
  getCurrentUser(): User | null {
    try {
      const payload = this.decodeToken();
      
      return {
        id: payload.sub,
        email: '', // Não disponível no JWT - seria obtido via API
        name: '', // Não disponível no JWT - seria obtido via API
        role: payload.role,
        tenantId: payload.tenant_id,
        tenantName: '' // Seria obtido via API
      };
    } catch {
      return null;
    }
  }

  /**
   * Verifica se o token está próximo da expiração (5 minutos)
   * Útil para refresh proativo
   */
  isTokenExpiringSoon(): boolean {
    try {
      const payload = this.decodeToken();
      const now = Math.floor(Date.now() / 1000);
      const fiveMinutes = 5 * 60;
      
      return (payload.exp - now) <= fiveMinutes;
    } catch {
      return true; // Token inválido = considera como expirando
    }
  }
}

// Instância singleton
export const authService = new AuthService();

// Export da classe para casos especiais
export default AuthService;