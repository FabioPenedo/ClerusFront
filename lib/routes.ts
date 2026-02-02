export type RouteType = 'public' | 'private';

export interface RouteConfig {
  type: RouteType;
}

export const routes: Record<string, RouteConfig> = {
  '/auth/signup': { type: 'public' },
  '/auth/identify': { type: 'public' },
  '/auth/login': { type: 'public' },
  '/auth/logout': { type: 'public' },
};
