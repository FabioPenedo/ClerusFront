# ?? Documentação de Autenticação - API Clerus

## Visão Geral

A API utiliza um sistema de autenticação baseado em **JWT (JSON Web Token)** com **Refresh Token** armazenado em cookies HTTP-only para maior segurança. O fluxo de autenticação suporta **multi-tenancy**, permitindo que um usuário esteja vinculado a múltiplos tenants.

---

## ?? Índice

1. [Fluxo de Autenticação](#fluxo-de-autenticação)
2. [Endpoints](#endpoints)
   - [Signup (Cadastro)](#1-signup-cadastro)
   - [Identify (Identificação)](#2-identify-identificação)
   - [Login](#3-login)
   - [Logout](#4-logout)
3. [Refresh Token Automático](#refresh-token-automático)
4. [Armazenamento de Tokens](#armazenamento-de-tokens)
5. [Tratamento de Erros](#tratamento-de-erros)

---

## ?? Fluxo de Autenticação

### Fluxo Completo (Novo Usuário)

```
1. Frontend coleta dados ? POST /api/auth/signup
2. Backend cria Tenant + Usuário Admin
3. Backend retorna AccessToken + define RefreshToken no cookie
4. Frontend armazena AccessToken e usa em requisições subsequentes
```

### Fluxo Completo (Usuário Existente)

```
1. Frontend coleta email ? POST /api/auth/identify
2. Backend retorna lista de tenants do usuário
3. Usuário seleciona tenant (se múltiplos)
4. Frontend envia credenciais + tenantId ? POST /api/auth/login
5. Backend valida e retorna AccessToken + define RefreshToken no cookie
6. Frontend armazena AccessToken e usa em requisições
```

### Fluxo de Renovação Automática

```
1. Frontend faz requisição com AccessToken expirado
2. Middleware detecta expiração e valida RefreshToken (cookie)
3. Backend gera novos tokens automaticamente
4. Novo AccessToken retornado no header X-New-Access-Token
5. Novo RefreshToken atualizado no cookie
6. Requisição prossegue normalmente
```

---

## ?? Endpoints

### Base URL
```
https://api.clerus.com/api/auth
```

---

## 1. Signup (Cadastro)

Cria um novo **Tenant** e o primeiro **usuário administrador**.

### Endpoint
```http
POST /api/auth/signup
```

### Request Body
```json
{
  "tenantName": "Igreja Exemplo",
  "locality": 1,
  "userName": "João Silva",
  "email": "joao@exemplo.com",
  "phone": "+5511999999999",
  "password": "SenhaSegura123!"
}
```

#### Campos

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `tenantName` | string | Sim | Nome da organização/igreja |
| `locality` | int (enum) | Sim | Localidade (enum: BR, US, etc) |
| `userName` | string | Sim | Nome completo do usuário |
| `email` | string | Sim | Email único do usuário |
| `phone` | string | Sim | Telefone com código do país |
| `password` | string | Sim | Senha (mínimo recomendado: 8 caracteres) |

### Response (200 OK)
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 60
}
```

### Cookies Definidos
```
refresh_token=base64EncodedToken; 
HttpOnly; 
Secure; 
SameSite=Strict; 
Expires=30days
```

#### Response Fields

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `accessToken` | string | Token JWT para autenticação em requisições |
| `expiresIn` | int | Tempo de expiração em **minutos** |

### Erros Possíveis

| Status | Descrição |
|--------|-----------|
| 400 | Dados inválidos (email já cadastrado, campos obrigatórios faltando) |
| 500 | Erro interno do servidor |

---

## 2. Identify (Identificação)

Verifica se um email existe no sistema e retorna os tenants associados.

### Endpoint
```http
POST /api/auth/identify
```

### Request Body
```json
{
  "email": "joao@exemplo.com"
}
```

### Response - Usuário com 1 Tenant (200 OK)
```json
{
  "mode": "single",
  "tenants": [
    {
      "tenantId": 1,
      "tenantName": "Igreja Exemplo"
    }
  ]
}
```

### Response - Usuário com Múltiplos Tenants (200 OK)
```json
{
  "mode": "multiple",
  "tenants": [
    {
      "tenantId": 1,
      "tenantName": "Igreja Exemplo"
    },
    {
      "tenantId": 5,
      "tenantName": "Igreja Filial"
    }
  ]
}
```

#### Response Fields

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `mode` | string | `"single"` ou `"multiple"` |
| `tenants` | array | Lista de tenants do usuário |
| `tenants[].tenantId` | int | ID do tenant para usar no login |
| `tenants[].tenantName` | string | Nome do tenant para exibição |

### Erros Possíveis

| Status | Descrição |
|--------|-----------|
| 401 | Email não encontrado |
| 400 | Email inválido |

### ?? Exemplo de Uso no Frontend

```typescript
// Exemplo React/TypeScript
const handleIdentify = async (email: string) => {
  const response = await fetch('/api/auth/identify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });

  const data = await response.json();

  if (data.mode === 'single') {
    // Login automático com o único tenant
    await handleLogin(email, password, data.tenants[0].tenantId);
  } else {
    // Exibir seletor de tenants
    setTenantOptions(data.tenants);
  }
};
```

---

## 3. Login

Autentica um usuário em um tenant específico.

### Endpoint
```http
POST /api/auth/login
```

### Request Body
```json
{
  "email": "joao@exemplo.com",
  "password": "SenhaSegura123!",
  "tenantId": 1
}
```

#### Campos

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `email` | string | Sim | Email do usuário |
| `password` | string | Sim | Senha do usuário |
| `tenantId` | int | Sim | ID do tenant (obtido do `/identify`) |

### Response (200 OK)
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 60
}
```

### Cookies Definidos
```
refresh_token=base64EncodedToken; 
HttpOnly; 
Secure; 
SameSite=Strict; 
Expires=30days
```

### Erros Possíveis

| Status | Descrição |
|--------|-----------|
| 401 | Email/senha inválidos ou tenant incorreto |
| 400 | Dados inválidos |

---

## 4. Logout

Revoga o refresh token atual e limpa o cookie.

### Endpoint
```http
POST /api/auth/logout
```

### Headers
```http
Authorization: Bearer {accessToken}
```

### Response (204 No Content)
Sem corpo de resposta.

### Ações do Backend
1. Revoga o refresh token do cookie
2. Remove o cookie `refresh_token`
3. Atualiza o campo `RevokedAt` no banco de dados

### Exemplo de Uso
```typescript
const handleLogout = async () => {
  await fetch('/api/auth/logout', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
    credentials: 'include' // Importante para enviar cookies
  });

  // Limpar estado local
  localStorage.removeItem('accessToken');
  navigate('/login');
};
```

---

## ?? Refresh Token Automático

### Middleware JwtRefreshMiddleware

O backend possui um **middleware automático** que intercepta requisições com AccessToken expirado e renova automaticamente usando o RefreshToken do cookie.

### Funcionamento

1. **AccessToken Válido**: Requisição segue normalmente
2. **AccessToken Expirado**:
   - Middleware verifica cookie `refresh_token`
   - Valida o RefreshToken no banco
   - Gera novos tokens (rotação de refresh token)
   - Retorna novo AccessToken no header `X-New-Access-Token`
   - Atualiza cookie `refresh_token`
   - Requisição continua com novo token

### Implementação no Frontend

```typescript
// Exemplo usando Axios
axios.interceptors.response.use(
  (response) => {
    // Verifica se houve renovação automática
    const newToken = response.headers['x-new-access-token'];
    if (newToken) {
      localStorage.setItem('accessToken', newToken);
      console.log('Token renovado automaticamente');
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token e refresh inválidos - redirecionar para login
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Segurança do Refresh Token

- **Rotação de Tokens**: Cada refresh gera um novo RefreshToken (o antigo é revogado)
- **Limite de Sessões**: Máximo de sessões simultâneas por usuário (configurável)
- **Hash SHA256**: RefreshToken armazenado como hash no banco
- **HttpOnly Cookie**: Inacessível via JavaScript (proteção contra XSS)

---

## ?? Armazenamento de Tokens

### AccessToken (JWT)
**Onde armazenar**: `localStorage` ou `sessionStorage`

```typescript
// Após login/signup
localStorage.setItem('accessToken', response.accessToken);

// Em cada requisição
const token = localStorage.getItem('accessToken');
headers: {
  'Authorization': `Bearer ${token}`
}
```

**Estrutura do JWT** (decodificado):
```json
{
  "sub": "42",           // User ID
  "tenant_id": "1",      // Tenant ID
  "role": "Admin",       // Role do usuário
  "exp": 1738195200      // Timestamp de expiração
}
```

### RefreshToken
**Onde armazenar**: **COOKIE (gerenciado pelo backend)**

?? **O frontend NÃO deve manipular o RefreshToken diretamente!**

- Enviado automaticamente pelo navegador em requisições (credentials: 'include')
- HttpOnly = JavaScript não pode acessar
- Secure = Apenas HTTPS
- SameSite = Proteção CSRF

---

## ?? Tratamento de Erros

### Códigos de Status Comuns

| Status | Cenário | Ação Recomendada |
|--------|---------|------------------|
| 200 | Sucesso | Processar resposta normalmente |
| 204 | Logout bem-sucedido | Redirecionar para login |
| 400 | Dados inválidos | Exibir mensagens de validação |
| 401 | Não autenticado / Token inválido | Redirecionar para login |
| 403 | Sem permissão | Exibir mensagem de acesso negado |
| 500 | Erro do servidor | Exibir mensagem genérica de erro |

### Exemplo de Tratamento

```typescript
try {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // IMPORTANTE: Envia cookies
    body: JSON.stringify(loginData)
  });

  if (!response.ok) {
    if (response.status === 401) {
      setError('Email ou senha incorretos');
    } else if (response.status === 400) {
      setError('Dados inválidos. Verifique os campos.');
    } else {
      setError('Erro ao fazer login. Tente novamente.');
    }
    return;
  }

  const data = await response.json();
  localStorage.setItem('accessToken', data.accessToken);
  navigate('/dashboard');
  
} catch (error) {
  setError('Erro de conexão. Verifique sua internet.');
}
```

---

## ?? Boas Práticas de Segurança

### Frontend

1. **Sempre envie cookies**:
   ```typescript
   fetch(url, { credentials: 'include' })
   ```

2. **Limpe tokens no logout**:
   ```typescript
   localStorage.removeItem('accessToken');
   ```

3. **Valide expiração antes de requisições críticas**:
   ```typescript
   const token = localStorage.getItem('accessToken');
   if (!token) redirectToLogin();
   
   // Decodificar JWT e verificar exp
   const payload = JSON.parse(atob(token.split('.')[1]));
   if (payload.exp * 1000 < Date.now()) {
     // Token expirado - próxima requisição vai renovar automaticamente
   }
   ```

4. **Não armazene dados sensíveis**:
   - ? Nunca armazene senhas
   - ? Nunca tente manipular o RefreshToken
   - ? Apenas armazene o AccessToken

### Backend (já implementado)

- ? Refresh tokens armazenados como hash SHA256
- ? Rotação automática de refresh tokens
- ? Limite de sessões simultâneas
- ? Cookies HttpOnly, Secure e SameSite
- ? Middleware de renovação automática

---

## ?? Checklist de Implementação Frontend

- [ ] Implementar tela de cadastro (signup)
- [ ] Implementar tela de identificação (identify)
- [ ] Implementar seletor de tenants (caso mode = "multiple")
- [ ] Implementar tela de login
- [ ] Armazenar accessToken no localStorage/sessionStorage
- [ ] Configurar interceptor HTTP para adicionar token em requisições
- [ ] Configurar interceptor para detectar `X-New-Access-Token` e atualizar token
- [ ] Implementar logout (limpar token + chamar endpoint)
- [ ] Adicionar `credentials: 'include'` em todas as chamadas fetch
- [ ] Implementar redirecionamento em caso de 401
- [ ] Exibir mensagens de erro apropriadas

---

## ?? Exemplos de Código Frontend

### React + TypeScript + Fetch

```typescript
// services/auth.ts
const API_URL = 'https://api.clerus.com/api/auth';

export const authService = {
  async signup(data: SignupRequest) {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error('Signup failed');
    
    const result = await response.json();
    localStorage.setItem('accessToken', result.accessToken);
    return result;
  },

  async identify(email: string) {
    const response = await fetch(`${API_URL}/identify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    if (!response.ok) throw new Error('User not found');
    return response.json();
  },

  async login(email: string, password: string, tenantId: number) {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password, tenantId })
    });

    if (!response.ok) throw new Error('Login failed');
    
    const result = await response.json();
    localStorage.setItem('accessToken', result.accessToken);
    return result;
  },

  async logout() {
    const token = localStorage.getItem('accessToken');
    await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      credentials: 'include'
    });
    
    localStorage.removeItem('accessToken');
  },

  getToken() {
    return localStorage.getItem('accessToken');
  }
};
```

### Hook React Customizado

```typescript
// hooks/useAuth.ts
import { useState } from 'react';
import { authService } from '../services/auth';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = async (data: SignupRequest) => {
    setLoading(true);
    setError(null);
    try {
      await authService.signup(data);
      return true;
    } catch (err) {
      setError('Erro ao criar conta');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, tenantId: number) => {
    setLoading(true);
    setError(null);
    try {
      await authService.login(email, password, tenantId);
      return true;
    } catch (err) {
      setError('Email ou senha incorretos');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
  };

  return { signup, login, logout, loading, error };
};
```

---

## ?? Suporte

Em caso de dúvidas sobre a integração, entre em contato com a equipe de backend.

**Última atualização**: Janeiro 2025
