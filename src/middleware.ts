import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    '/groups/:path*',
    '/profile/:path*',
    '/admin/:path*',
  ],
};

export function middleware(request: NextRequest) {
  // Vérifier si l'utilisateur est authentifié
  const sessionId = request.cookies.get('session')?.value;

  if (!sessionId) {
    // Rediriger vers login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
