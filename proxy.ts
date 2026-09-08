import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const PROTECTED_PREFIXES = ['/admin', '/agency', '/employee', '/customer']
const AUTH_ROUTES = ['/login', '/register']

const ROLE_REDIRECT: Record<string, string> = {
  super_admin: '/admin',
  agency_owner: '/agency',
  employee: '/employee',
  customer: '/customer',
}

// Rota koruma ve oturum kontrolü (Next.js 16)
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('sb-access-token')?.value
  const role = request.cookies.get('user-role')?.value

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute && token && role) {
    const destination = ROLE_REDIRECT[role] ?? '/agency'
    return NextResponse.redirect(new URL(destination, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}
