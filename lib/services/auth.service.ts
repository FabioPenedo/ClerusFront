import { sessionStore, tokenStore } from "../info.store";

export interface AuthResponse {
  accessToken: string;
  tenant: {
    id: number;
    name: string;
  };
  user: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role: string;
  };
}

export type Locality = 'Central' | 'Regional' | 'Local';
export interface SignupRequest {
  tenantName: string;
  locality: Locality;
  userName: string;
  email: string;
  phone: string;
  password: string;
}

export interface TenantOptionResponse {
  tenantId: number;
  tenantName: string;
}

export type IdentifyMode = "single" | "multiple";

export interface IdentifyResponse {
  mode: IdentifyMode;
  tenants: TenantOptionResponse[];
}

const API_BASE_URL = 'https://localhost:7166/api';

export async function signup(
  request: SignupRequest
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    credentials: 'include', // importante para o refresh token
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Erro ao criar conta');
  }

  const data: AuthResponse = await res.json();

  // salva o access token em memória
  tokenStore.set(data.accessToken);
  sessionStore.set({
    tenant: data.tenant,
    user: data.user,
  })

  return data;
}

export async function identify(email: string): Promise<IdentifyResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/identify`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    throw new Error('Email não encontrado');
  }

  const data: IdentifyResponse = await res.json();
  return data;
}


export async function login(
  email: string,
  password: string,
  tenantId: number
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, tenantId }),
  });

  if (!res.ok) {
    throw new Error('Credenciais inválidas');
  }

  const data: AuthResponse = await res.json();

  tokenStore.set(data.accessToken);

  sessionStore.set({
    tenant: data.tenant,
    user: data.user,
  })

  return data;
}

export async function logout(): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Erro ao realizar logout');
  }

  // Remove o access token do estado/memória
  tokenStore.clear();
  sessionStore.clear();
}

