import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Bu prefix'ler altindaki her route korumalidir
const PROTECTED_PREFIXES = ['/admin', '/agency', '/employee', '/customer']

// Auth route'lari (giris yapilmissa erisilemez)
const AUTH_ROUTES = ['/login', '/register']

// Role → Dashboard mapping
const ROLE_REDIRECT: Record<string, string> = {
  super_admin: '/admin',
  agency_owner: '/agency',
  employee: '/employee',
  customer: '/customer',
}

/**
 * Next.js 16 Proxy (replaces middleware.ts)
 * This is the convention for request interception in Next.js 16.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('sb-access-token')?.value
  const role = request.cookies.get('user-role')?.value

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

  // Korumali route'a token olmadan erisim → /login'e yonlendir
  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Auth route'lara token ile erisim → ilgili dashboard'a yonlendir
  if (isAuthRoute && token && role) {
    const destination = ROLE_REDIRECT[role] ?? '/agency'
    return NextResponse.redirect(new URL(destination, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Next.js icsel route'lari, static dosyalar ve API'ler haric her seyi esle:
     * - _next/static, _next/image, favicon.ico
     */
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
}
