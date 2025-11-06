import { NextRequest, NextResponse } from 'next/server';
import { auth } from './lib/auth';

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  const { pathname } = request.nextUrl;

  // Redirect authenticated users away from login/signup pages
  if (!session && !['/login'].includes(pathname)) {
    return NextResponse.redirect(new URL(`/login?redirect=${encodeURIComponent(request.url)}`, request.url));
  } else if (pathname.startsWith('/admin') && session?.user.role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)'],
};
