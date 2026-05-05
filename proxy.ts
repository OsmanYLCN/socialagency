import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

/**
 * Next.js 16 Proxy (replaces middleware.ts)
 * This is the new convention for request interception.
 * Currently passes all requests through — auth guards can be added here.
 */
export function proxy(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
