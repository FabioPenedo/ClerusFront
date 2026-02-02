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
