import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getAnonClient } from '@/lib/supabase/server'

function getCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get('sb-refresh-token')?.value
  const requestedDestination = url.searchParams.get('next') || '/login'
  const destination = requestedDestination.startsWith('/') && !requestedDestination.startsWith('//')
    ? requestedDestination
    : '/login'

  if (!refreshToken) {
    return NextResponse.redirect(new URL('/login', url.origin))
  }

  const supabase = getAnonClient()
  const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken })

  if (error || !data.session) {
    const response = NextResponse.redirect(new URL('/login', url.origin))
    response.cookies.delete('sb-access-token')
    response.cookies.delete('sb-refresh-token')
    response.cookies.delete('user-role')
    response.cookies.delete('user-id')
    response.cookies.delete('agency-id')
    return response
  }

  const response = NextResponse.redirect(new URL(destination, url.origin))
  response.cookies.set('sb-access-token', data.session.access_token, getCookieOptions(60 * 60 * 24 * 7))
  response.cookies.set('sb-refresh-token', data.session.refresh_token, getCookieOptions(60 * 60 * 24 * 30))
  return response
}
