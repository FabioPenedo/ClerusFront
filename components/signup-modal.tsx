'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { signup, SignupRequest, type Locality } from '@/lib/services/auth.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

const LOCALITIES: Array<{ value: Locality; label: string }> = [
  { value: 'Central', label: 'Central' },
  { value: 'Regional', label: 'Regional' },
  { value: 'Local', label: 'Local' }
];

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export function SignupModal({ isOpen, onClose, onSwitchToLogin }: SignupModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<SignupRequest>({
    tenantName: '',
    locality: 'Central',
    userName: '',
    email: '',
    phone: '',
    password: ''
  });

  const [formErrors, setFormErrors] = useState<Partial<SignupRequest> & { confirmPassword?: string }>({});
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const errors: Partial<SignupRequest> = {};
    let isValid = true;

    if (!formData.tenantName.trim()) {
      errors.tenantName = 'Nome da organização é obrigatório';
      isValid = false;
    }

    if (!formData.userName.trim()) {
      errors.userName = 'Seu nome é obrigatório';
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = 'Email é obrigatório';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Telefone é obrigatório';
      isValid = false;
    } else if (!formData.phone.startsWith('+')) {
      errors.phone = 'Telefone deve incluir código do país (ex: +5511999999999)';
      isValid = false;
    }

    if (!formData.password) {
      errors.password = 'Senha é obrigatória';
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.password = 'Senha deve ter pelo menos 8 caracteres';
      isValid = false;
    }

    if (formData.password !== confirmPassword) {
      setFormErrors(prev => ({ ...prev, confirmPassword: 'Senhas não conferem' }));
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleInputChange = (field: keyof SignupRequest | 'confirmPassword', value: string | Locality) => {
    if (field === 'confirmPassword') {
      setConfirmPassword(value as string);
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    if (formErrors[field as keyof SignupRequest]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }

    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await signup(formData);
      onClose();
      router.push('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar conta. Tente novamente.';
      setError(errorMessage);
      console.error('Erro no cadastro:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setFormData({
      tenantName: '',
      locality: 'Central',
      userName: '',
      email: '',
      phone: '',
      password: ''
    });
    setConfirmPassword('');
    setFormErrors({});
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-md p-6 relative my-8">
        <button
          onClick={handleCloseModal}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6 pr-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Criar nova conta
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Nome da Organização */}
          <div>
            <Label htmlFor="tenantName" className="text-sm">
              Nome da Organização/Igreja *
            </Label>
            <Input
              id="tenantName"
              type="text"
              value={formData.tenantName}
              onChange={(e) => handleInputChange('tenantName', e.target.value)}
              placeholder="Ex: Igreja Batista Central"
              className="mt-1 text-sm"
              disabled={isLoading}
            />
            {formErrors.tenantName && (
              <p className="mt-1 text-xs text-red-600">{formErrors.tenantName}</p>
            )}
          </div>

          {/* Localidade */}
          <div>
            <Label htmlFor="locality" className="text-sm">
              Localidade *
            </Label>
            <select
              id="locality"
              value={formData.locality}
              onChange={(e) => handleInputChange('locality', e.target.value as Locality)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              disabled={isLoading}
            >
              {LOCALITIES.map(loc => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </select>
          </div>

          {/* Nome do Usuário */}
          <div>
            <Label htmlFor="userName" className="text-sm">
              Seu Nome Completo *
            </Label>
            <Input
              id="userName"
              type="text"
              value={formData.userName}
              onChange={(e) => handleInputChange('userName', e.target.value)}
              placeholder="Ex: João Silva"
              className="mt-1 text-sm"
              disabled={isLoading}
            />
            {formErrors.userName && (
              <p className="mt-1 text-xs text-red-600">{formErrors.userName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-sm">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="joao@exemplo.com"
              className="mt-1 text-sm"
              disabled={isLoading}
            />
            {formErrors.email && (
              <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>
            )}
          </div>

          {/* Telefone */}
          <div>
            <Label htmlFor="phone" className="text-sm">
              Telefone com código do país *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+5511999999999"
              className="mt-1 text-sm"
              disabled={isLoading}
            />
            {formErrors.phone && (
              <p className="mt-1 text-xs text-red-600">{formErrors.phone}</p>
            )}
          </div>

          {/* Senha */}
          <div>
            <Label htmlFor="password" className="text-sm">
              Senha *
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Mínimo 8 caracteres"
              className="mt-1 text-sm"
              disabled={isLoading}
            />
            {formErrors.password && (
              <p className="mt-1 text-xs text-red-600">{formErrors.password}</p>
            )}
          </div>

          {/* Confirmar Senha */}
          <div>
            <Label htmlFor="confirmPassword" className="text-sm">
              Confirmar Senha *
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Digite a senha novamente"
              className="mt-1 text-sm"
              disabled={isLoading}
            />
            {formErrors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">{formErrors.confirmPassword}</p>
            )}
          </div>

          {/* Erro geral */}
          {error && (
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded-md">
              {error}
            </div>
          )}

          {/* Botão de Submissão */}
          <Button 
            type="submit" 
            className="w-full text-sm"
            disabled={isLoading}
          >
            {isLoading ? 'Criando conta...' : 'Criar Conta'}
          </Button>

          <p className="text-center text-xs text-gray-600">
            Já tem uma conta?{' '}
            <button
              type="button"
              onClick={() => {
                handleCloseModal();
                onSwitchToLogin();
              }}
              className="text-blue-600 hover:underline font-medium"
            >
              Faça login
            </button>
          </p>
        </form>
      </Card>
    </div>
  );
}
