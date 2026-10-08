import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { ROLE_REDIRECT } from '@/lib/constants'

const PROTECTED_PREFIXES = ['/admin', '/agency', '/employee', '/customer']
const AUTH_ROUTES = ['/login', '/register']

// Rotaları ve oturumları korur
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('sb-access-token')?.value
  const role = request.cookies.get('user-role')?.value

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

  // 1. Korumalı rotaya erişen kullanıcıların oturum ve rol denetimi
  if (isProtected) {
    if (!token) {
      const refreshToken = request.cookies.get('sb-refresh-token')?.value
      if (refreshToken) {
        const refreshUrl = new URL('/auth/refresh', request.url)
        refreshUrl.searchParams.set('next', pathname)
        return NextResponse.redirect(refreshUrl)
      }

      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // 1.5. Token Doğrulama (Edge uyumlu Supabase Auth API çağrısı)
    let isValidToken = false
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseAnonKey && token) {
      try {
        const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
            apikey: supabaseAnonKey,
          },
          cache: 'no-store'
        })
        if (response.ok) {
          isValidToken = true
        }
      } catch (err) {
        // Ağ veya fetch hatası durumunda token geçersiz sayılır
      }
    }

    // Token geçersizse (süresi dolmuş, manipüle edilmiş vb.)
    if (!isValidToken) {
      const refreshToken = request.cookies.get('sb-refresh-token')?.value
      if (refreshToken) {
        const refreshUrl = new URL('/auth/refresh', request.url)
        refreshUrl.searchParams.set('next', pathname)
        return NextResponse.redirect(refreshUrl)
      }
      
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Token var ancak rol çerezi eksik veya geçersizse girişe yönlendir
    if (!role || !ROLE_REDIRECT[role]) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // 2. Korumalı rotaya erişen oturumlu kullanıcıların rol denetimi (Middleware Route Guard)
    const defaultHome = ROLE_REDIRECT[role]

    if (pathname.startsWith('/admin') && role !== 'super_admin') {
      return NextResponse.redirect(new URL(defaultHome, request.url))
    }
    if (pathname.startsWith('/agency') && role !== 'agency_owner') {
      return NextResponse.redirect(new URL(defaultHome, request.url))
    }
    if (pathname.startsWith('/employee') && role !== 'employee') {
      return NextResponse.redirect(new URL(defaultHome, request.url))
    }
    if (pathname.startsWith('/customer') && role !== 'customer') {
      return NextResponse.redirect(new URL(defaultHome, request.url))
    }
  }

  // 3. Zaten oturum açmış kullanıcının giriş/kayıt sayfalarına gitmesini önle
  if (isAuthRoute && token && role) {
    const destination = ROLE_REDIRECT[role] ?? '/agency'
    return NextResponse.redirect(new URL(destination, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}
