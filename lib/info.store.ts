export const tokenStore = {
  get(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  },

  set(token: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('accessToken', token);
  },

  clear() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('accessToken');
  }
};

// session.types.ts
export type Tenant = {
  id: number;
  name: string;
  plan: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
};

export type Session = {
  tenant: Tenant;
  user: User;
};

// sessionStore.ts

const SESSION_KEY = 'session';

export const sessionStore = {
  get(): Session | null {
    if (typeof window === 'undefined') return null;

    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as Session;
    } catch {
      return null;
    }
  },

  set(session: Session) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },

  clear() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(SESSION_KEY);
  }
};


