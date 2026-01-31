/**
 * Context de Autenticação
 * 
 * Gerencia o estado global de autenticação da aplicação:
 * - Estado do usuário logado
 * - Métodos de login, signup, logout
 * - Persistência e sincronização do estado
 * - Auto-refresh de dados do usuário
 * 
 * Segue o fluxo especificado no README-AUTH.md
 */

'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, SignupRequest, IdentifyResponse, User } from '@/lib/services/auth.service';

// Tipos do contexto
export interface AuthContextType {
  // Estado
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Métodos de autenticação
  signup: (data: SignupRequest) => Promise<void>;
  identify: (email: string) => Promise<IdentifyResponse>;
  login: (email: string, password: string, tenantId: number) => Promise<void>;
  logout: () => Promise<void>;

  // Utilitários
  clearError: () => void;
  refreshUser: () => void;
}

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider de Autenticação
 * 
 * Gerencia todo o estado de autenticação da aplicação
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado derivado
  const isAuthenticated = !!user && authService.isAuthenticated();

  /**
   * Carrega dados do usuário do token JWT
   */
  const loadUserFromToken = () => {
    try {
      if (authService.isAuthenticated()) {
        const userData = authService.getCurrentUser();
        if (userData) {
          setUser(userData);
          console.log('✅ Usuário carregado do token:', userData);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar usuário:', error);
      setUser(null);
    }
  };

  /**
   * Cadastro de novo usuário
   */
  const signup = async (data: SignupRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🚀 Iniciando cadastro via context...');
      
      const result = await authService.signup(data);
      
      // Após signup bem-sucedido, carrega dados do usuário
      loadUserFromToken();
      
      console.log('✅ Cadastro concluído com sucesso');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar conta';
      setError(errorMessage);
      console.error('❌ Erro no cadastro:', errorMessage);
      throw err; // Re-throw para componente tratar se necessário
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Identificação de usuário por email
   */
  const identify = async (email: string): Promise<IdentifyResponse> => {
    setError(null);

    try {
      console.log('🔍 Identificando usuário via context...');
      
      const result = await authService.identify(email);
      
      console.log('✅ Identificação concluída:', result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao identificar usuário';
      setError(errorMessage);
      console.error('❌ Erro na identificação:', errorMessage);
      throw err;
    }
  };

  /**
   * Login com tenant específico
   */
  const login = async (email: string, password: string, tenantId: number): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔑 Iniciando login via context...');
      
      const result = await authService.login(email, password, tenantId);
      
      // Após login bem-sucedido, carrega dados do usuário
      loadUserFromToken();
      
      console.log('✅ Login concluído com sucesso');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login';
      setError(errorMessage);
      console.error('❌ Erro no login:', errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout
   */
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('👋 Iniciando logout via context...');
      
      await authService.logout();
      
      // Limpa estado do usuário
      setUser(null);
      
      console.log('✅ Logout concluído com sucesso');
    } catch (err) {
      // Logout sempre deve "funcionar" - apenas log do erro
      console.error('❌ Erro no logout (não crítico):', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Limpa erro atual
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * Força refresh dos dados do usuário
   */
  const refreshUser = () => {
    loadUserFromToken();
  };

  /**
   * Efeito de inicialização
   * Verifica se há usuário logado ao carregar a aplicação
   */
  useEffect(() => {
    const initializeAuth = () => {
      try {
        console.log('🔄 Inicializando contexto de autenticação...');
        
        loadUserFromToken();
        
        console.log('✅ Contexto de autenticação inicializado');
      } catch (error) {
        console.error('❌ Erro ao inicializar auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Efeito para monitorar expiração do token
   * Verifica a cada minuto se o token está próximo da expiração
   */
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkTokenExpiration = () => {
      if (authService.isTokenExpiringSoon()) {
        console.log('⏰ Token próximo da expiração - será renovado na próxima requisição');
      }
      
      if (!authService.isAuthenticated()) {
        console.log('🔒 Token expirado - realizando logout');
        setUser(null);
      }
    };

    // Verifica imediatamente
    checkTokenExpiration();

    // Verifica a cada minuto
    const interval = setInterval(checkTokenExpiration, 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  /**
   * Efeito para debug em desenvolvimento
   */
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Auth Context State:', {
        isAuthenticated,
        hasUser: !!user,
        isLoading,
        error,
        user: user ? { id: user.id, role: user.role, tenantId: user.tenantId } : null
      });
    }
  }, [isAuthenticated, user, isLoading, error]);

  // Valor do contexto
  const contextValue: AuthContextType = {
    // Estado
    user,
    isAuthenticated,
    isLoading,
    error,

    // Métodos
    signup,
    identify,
    login,
    logout,

    // Utilitários
    clearError,
    refreshUser
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook para usar o contexto de autenticação
 * 
 * @throws {Error} Se usado fora do AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}

/**
 * HOC para componentes que requerem autenticação
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      // Em produção, isso seria um redirect via Next.js
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Acesso não autorizado</h2>
            <p className="text-gray-600 mb-4">Você precisa fazer login para acessar esta página.</p>
            <button 
              onClick={() => window.location.href = '/login'}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Fazer Login
            </button>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

// Exports
export default AuthProvider;