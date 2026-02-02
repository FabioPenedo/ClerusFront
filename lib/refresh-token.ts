// lib/http/refresh-token.ts
import { tokenStore } from './token-store';
import { ApiError } from './api-error';

const API_BASE_URL = 'https://localhost:7166';

let isRefreshing = false;
let queue: (() => void)[] = [];

export async function refreshAccessToken(): Promise<string> {
  if (isRefreshing) {
    return new Promise(resolve => queue.push(() => resolve(tokenStore.get()!)));
  }

  isRefreshing = true;

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include'
  });

  if (!response.ok) {
    tokenStore.clear();
    throw new ApiError('Sessão expirada', 401);
  }

  const { accessToken } = await response.json();
  tokenStore.set(accessToken);

  queue.forEach(cb => cb());
  queue = [];
  isRefreshing = false;

  return accessToken;
}
