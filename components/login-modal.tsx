'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

import { identify, login, IdentifyResponse } from '@/lib/services/auth.service';

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

export function LoginModal({
  isOpen,
  onClose,
  onSwitchToSignup,
}: LoginModalProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [state, setState] = useState<LoginState>({
    step: 'identify',
    email: '',
    password: '',
    tenants: [],
    selectedTenantId: null,
  });

  if (!isOpen) return null;

  /* =========================
     IDENTIFY
  ========================= */
  const handleIdentify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!state.email.trim()) {
      setError('Digite seu email');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await identify(state.email);

      if (result.mode === 'single') {
        if (result.tenants.length !== 1) {
          throw new Error('Tenant único inválido');
        }

        setState(prev => ({
          ...prev,
          tenants: result.tenants,
          selectedTenantId: result.tenants[0].tenantId,
          step: 'login',
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        tenants: result.tenants,
        step: 'tenant-selection',
      }));
    } catch (err: any) {
      setError(err.message || 'Erro ao identificar usuário');
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================
     TENANT SELECTION
  ========================= */
  const handleTenantSelection = (tenantId: number) => {
    if (isLoading) return;

    setState(prev => ({
      ...prev,
      selectedTenantId: tenantId,
      step: 'login',
    }));
  };

  /* =========================
     LOGIN
  ========================= */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!state.password.trim()) {
      setError('Digite sua senha');
      return;
    }

    if (!state.selectedTenantId) {
      setError('Tenant não selecionado');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await login(
        state.email,
        state.password,
        state.selectedTenantId
      );

      onClose();
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setError(null);

    if (state.step === 'tenant-selection') {
      setState(prev => ({
        ...prev,
        step: 'identify',
        tenants: [],
        selectedTenantId: null,
      }));
    }

    if (state.step === 'login') {
      setState(prev => ({
        ...prev,
        step:
          prev.tenants.length > 1
            ? 'tenant-selection'
            : 'identify',
        password: '',
      }));
    }
  };

  const handleClose = () => {
    setState({
      step: 'identify',
      email: '',
      password: '',
      tenants: [],
      selectedTenantId: null,
    });
    setError(null);
    onClose();
  };

  const selectedTenant = state.tenants.find(
    t => t.tenantId === state.selectedTenantId
  );

  /* =========================
     UI
  ========================= */
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500"
        >
          <X className="h-5 w-5" />
        </button>

        {/* IDENTIFY */}
        {state.step === 'identify' && (
          <form onSubmit={handleIdentify} className="space-y-4">
            <Label>Email</Label>
            <Input
              type="email"
              value={state.email}
              onChange={e =>
                setState(prev => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              autoFocus
              disabled={isLoading}
            />

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <Button className="w-full" disabled={isLoading}>
              {isLoading ? 'Verificando...' : 'Continuar'}
            </Button>
          </form>
        )}

        {/* TENANT SELECTION */}
        {state.step === 'tenant-selection' && (
          <div className="space-y-3">
            {state.tenants.map(t => (
              <Button
                key={t.tenantId}
                variant="outline"
                onClick={() => handleTenantSelection(t.tenantId)}
              >
                {t.tenantName}
              </Button>
            ))}

            <Button variant="ghost" onClick={handleBack}>
              Voltar
            </Button>
          </div>
        )}

        {/* LOGIN */}
        {state.step === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-sm text-gray-600 text-center">
              {state.email}
              {selectedTenant && ` • ${selectedTenant.tenantName}`}
            </div>

            <Label>Senha</Label>
            <Input
              type="password"
              value={state.password}
              onChange={e =>
                setState(prev => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              autoFocus
              disabled={isLoading}
            />

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleBack}>
                Voltar
              </Button>
              <Button className="flex-1" disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
