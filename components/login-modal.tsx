'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { IdentifyResponse } from '@/lib/services/auth.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

type LoginStep = 'identify' | 'tenant-selection' | 'login';

interface LoginState {
  step: LoginStep;
  email: string;
  password: string;
  tenants: IdentifyResponse['tenants'];
  selectedTenantId: number | null;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
}

export function LoginModal({ isOpen, onClose, onSwitchToSignup }: LoginModalProps) {
  const router = useRouter();
  const { identify, login, error, isLoading, clearError } = useAuth();
  
  const [state, setState] = useState<LoginState>({
    step: 'identify',
    email: '',
    password: '',
    tenants: [],
    selectedTenantId: null
  });

  const [localError, setLocalError] = useState<string | null>(null);
  const currentError = error || localError;

  if (!isOpen) return null;

  const handleIdentify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.email.trim()) {
      setLocalError('Digite seu email');
      return;
    }

    setLocalError(null);
    clearError();

    try {
      const result = await identify(state.email);
      
      setState(prev => ({
        ...prev,
        tenants: result.tenants,
        step: result.mode === 'single' ? 'login' : 'tenant-selection',
        selectedTenantId: result.mode === 'single' ? result.tenants[0].tenantId : null
      }));
    } catch (err) {
      console.error('Erro na identificação:', err);
    }
  };

  const handleTenantSelection = (tenantId: number) => {
    setState(prev => ({
      ...prev,
      selectedTenantId: tenantId,
      step: 'login'
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.password.trim()) {
      setLocalError('Digite sua senha');
      return;
    }

    if (!state.selectedTenantId) {
      setLocalError('Erro interno: tenant não selecionado');
      return;
    }

    setLocalError(null);
    clearError();

    try {
      await login(state.email, state.password, state.selectedTenantId);
      onClose();
      router.push('/dashboard');
    } catch (err) {
      console.error('Erro no login:', err);
    }
  };

  const handleBackStep = () => {
    if (state.step === 'tenant-selection') {
      setState(prev => ({ ...prev, step: 'identify' }));
    } else if (state.step === 'login') {
      setState(prev => ({
        ...prev,
        step: state.tenants.length > 1 ? 'tenant-selection' : 'identify',
        password: ''
      }));
    }
    
    setLocalError(null);
    clearError();
  };

  const handleCloseModal = () => {
    setState({
      step: 'identify',
      email: '',
      password: '',
      tenants: [],
      selectedTenantId: null
    });
    setLocalError(null);
    clearError();
    onClose();
  };

  const selectedTenant = state.tenants.find(t => t.tenantId === state.selectedTenantId);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6 relative">
        <button
          onClick={handleCloseModal}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6 pr-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Faça login na sua conta
          </h2>
        </div>

        {/* Etapa 1: Identificação por email */}
        {state.step === 'identify' && (
          <form onSubmit={handleIdentify} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={state.email}
                onChange={(e) => setState(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Digite seu email"
                className="mt-1"
                autoFocus
                disabled={isLoading}
              />
            </div>

            {currentError && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md">
                {currentError}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Verificando...' : 'Continuar'}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Não tem uma conta?{' '}
              <button
                type="button"
                onClick={() => {
                  handleCloseModal();
                  onSwitchToSignup();
                }}
                className="text-blue-600 hover:underline font-medium"
              >
                Cadastre-se
              </button>
            </p>
          </form>
        )}

        {/* Etapa 2: Seleção de tenant */}
        {state.step === 'tenant-selection' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Selecione sua organização
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Seu email está vinculado a múltiplas organizações:
              </p>
              
              <div className="space-y-2">
                {state.tenants.map((tenant) => (
                  <button
                    key={tenant.tenantId}
                    onClick={() => handleTenantSelection(tenant.tenantId)}
                    className="w-full text-left p-3 border border-gray-200 rounded-md hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    disabled={isLoading}
                  >
                    <div className="font-medium text-gray-900">
                      {tenant.tenantName}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleBackStep}
              disabled={isLoading}
              className="w-full"
            >
              Voltar
            </Button>
          </div>
        )}

        {/* Etapa 3: Login com senha */}
        {state.step === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-center pb-4 border-b border-gray-200">
              <div className="text-sm text-gray-600">Entrando como:</div>
              <div className="font-medium text-gray-900 text-sm">{state.email}</div>
              {selectedTenant && (
                <div className="text-xs text-gray-600">
                  {selectedTenant.tenantName}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={state.password}
                onChange={(e) => setState(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Digite sua senha"
                className="mt-1"
                autoFocus
                disabled={isLoading}
              />
            </div>

            {currentError && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md">
                {currentError}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleBackStep}
                disabled={isLoading}
                className="flex-1"
              >
                Voltar
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
