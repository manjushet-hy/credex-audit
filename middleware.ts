import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Scaffold for:
  // - Rate limiting
  // - Abuse prevention
  // - Bot protection
  
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
