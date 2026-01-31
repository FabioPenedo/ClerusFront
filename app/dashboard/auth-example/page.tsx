/**
 * Exemplo prático de integração da autenticação
 * 
 * Esta página demonstra:
 * - Uso do AuthService para chamadas autenticadas
 * - Implementação do refresh automático
 * - Controle de acesso baseado em roles
 * - Tratamento de erros de autenticação
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCurrentUser } from '@/hooks/useAuth';
import { AdminOnly, RoleProtection } from '@/components/auth/protection';
import { MembersService } from '@/lib/services/members.service';
import { UsersService } from '@/lib/services/users.service';
import { CategoriesService } from '@/lib/services/categories.service';

export default function AuthExamplePage() {
  const { user, isLoading } = useCurrentUser();
  const [apiData, setApiData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Exemplo de chamada autenticada - Lista de membros
   */
  const fetchMembers = async () => {
    if (!user?.tenantId) return;

    setLoading(true);
    setError(null);
    
    try {
      console.log('🚀 Fazendo chamada autenticada para membros...');
      
      const response = await MembersService.getMembers(parseInt(user.tenantId));
      
      console.log('✅ Dados recebidos:', response);
      setApiData(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('❌ Erro na chamada:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Exemplo de chamada que requer role específica
   */
  const fetchUsers = async () => {
    if (!user?.tenantId) return;

    setLoading(true);
    setError(null);
    
    try {
      console.log('🚀 Fazendo chamada autenticada para usuários (requer Admin)...');
      
      const response = await UsersService.getUsers(parseInt(user.tenantId));
      
      console.log('✅ Usuários recebidos:', response);
      setApiData(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('❌ Erro na chamada:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Exemplo de chamada para testar refresh automático
   */
  const testRefreshToken = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Testando refresh automático...');
      
      // Múltiplas chamadas para forçar refresh
      const promises = [
        CategoriesService.getCategories(parseInt(user?.tenantId || '1')),
        MembersService.getMembers(parseInt(user?.tenantId || '1')),
      ];

      const results = await Promise.all(promises);
      
      console.log('✅ Refresh automático funcionou! Resultados:', results);
      setApiData({
        categories: results[0].data,
        members: results[1].data
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('❌ Erro no teste de refresh:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando dados do usuário...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Exemplo de Autenticação
          </h1>
          <p className="text-muted-foreground">
            Demonstração das funcionalidades de autenticação implementadas
          </p>
        </div>
      </div>

      {/* Informações do Usuário */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Usuário Autenticado</h2>
        {user && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">ID:</span> {user.id}
            </div>
            <div>
              <span className="font-medium">Email:</span> {user.email || 'Não disponível'}
            </div>
            <div>
              <span className="font-medium">Nome:</span> {user.name || 'Não disponível'}
            </div>
            <div>
              <span className="font-medium">Role:</span> 
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                user.role === 'Admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {user.role}
              </span>
            </div>
            <div>
              <span className="font-medium">Tenant ID:</span> {user.tenantId}
            </div>
            <div>
              <span className="font-medium">Tenant:</span> {user.tenantName || 'Não disponível'}
            </div>
          </div>
        )}
      </Card>

      {/* Testes de API Autenticada */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Testes de API Autenticada</h2>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Button 
            onClick={fetchMembers}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Carregando...' : 'Listar Membros'}
          </Button>

          <Button 
            onClick={testRefreshToken}
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            {loading ? 'Testando...' : 'Testar Refresh Token'}
          </Button>

          <AdminOnly fallback={
            <Button disabled className="w-full">
              Listar Usuários (Admin Only)
            </Button>
          }>
            <Button 
              onClick={fetchUsers}
              disabled={loading}
              variant="secondary"
              className="w-full"
            >
              {loading ? 'Carregando...' : 'Listar Usuários'}
            </Button>
          </AdminOnly>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm font-medium">Erro:</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        )}

        {apiData && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800 text-sm font-medium">Dados recebidos:</p>
            <pre className="text-green-700 text-xs mt-2 overflow-auto max-h-40">
              {JSON.stringify(apiData, null, 2)}
            </pre>
          </div>
        )}
      </Card>

      {/* Demonstração de Controle de Acesso */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Controle de Acesso por Role</h2>
        
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-md">
            <h3 className="font-medium mb-2">Conteúdo Público</h3>
            <p className="text-sm text-gray-600">
              Este conteúdo é visível para todos os usuários autenticados.
            </p>
          </div>

          <AdminOnly fallback={
            <div className="p-4 border border-red-200 bg-red-50 rounded-md">
              <h3 className="font-medium text-red-800 mb-2">Conteúdo Restrito</h3>
              <p className="text-sm text-red-600">
                Você não tem permissão para ver este conteúdo. Apenas administradores podem acessar.
              </p>
            </div>
          }>
            <div className="p-4 border border-green-200 bg-green-50 rounded-md">
              <h3 className="font-medium text-green-800 mb-2">Conteúdo Administrativo</h3>
              <p className="text-sm text-green-600">
                Este conteúdo é visível apenas para administradores. Parabéns por ter acesso!
              </p>
            </div>
          </AdminOnly>

          <RoleProtection 
            requiredRole="User"
            allowedRoles={['Admin', 'User']}
            fallback={
              <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-md">
                <p className="text-sm text-yellow-600">
                  Role não reconhecida.
                </p>
              </div>
            }
          >
            <div className="p-4 border border-blue-200 bg-blue-50 rounded-md">
              <h3 className="font-medium text-blue-800 mb-2">Conteúdo Multi-Role</h3>
              <p className="text-sm text-blue-600">
                Este conteúdo é visível para Admins e Users.
              </p>
            </div>
          </RoleProtection>
        </div>
      </Card>

      {/* Instruções */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-xl font-semibold mb-4 text-blue-900">Como Funciona</h2>
        <div className="space-y-2 text-sm text-blue-800">
          <p>✅ <strong>Token Automático:</strong> Todas as chamadas incluem automaticamente o Bearer token</p>
          <p>✅ <strong>Refresh Automático:</strong> Tokens expirados são renovados automaticamente</p>
          <p>✅ <strong>Controle de Role:</strong> Conteúdo é mostrado baseado na role do usuário</p>
          <p>✅ <strong>Tratamento de Erros:</strong> Erros 401 redirecionam para login automaticamente</p>
          <p>✅ <strong>Multi-tenancy:</strong> Dados são filtrados por tenant automaticamente</p>
        </div>
      </Card>
    </div>
  );
}