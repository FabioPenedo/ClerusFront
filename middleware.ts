// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { routes } from './lib/routes';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1️⃣ Home sempre liberada
  if (pathname === '/') {
    return NextResponse.next();
  }

  // 2️⃣ Rota pública (login, signup, etc.)
  const routeConfig = routes[pathname];
  if (routeConfig?.type === 'public') {
    return NextResponse.next();
  }

  // 3️⃣ Verifica cookie de sessão (refresh token)
  const hasSession =
    req.cookies.has('refresh_token'); // NOME REAL DO COOKIE

  if (!hasSession) {
    const loginUrl = new URL('/', req.url);
    return NextResponse.redirect(loginUrl);
  }

  // 4️⃣ Tudo ok
  return NextResponse.next();
}

// middleware.ts
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:css|js|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf)).*)',
  ],
};
