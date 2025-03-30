import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protected routes
  const protectedPaths = ['/dashboard', '/booking']
  const isProtectedRoute = protectedPaths.some(path => pathname.startsWith(path))

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Check for token
  const token = request.cookies.get('token')?.value

  if (!token) {
    // Redirect to login if no token found
    const url = new URL('/login', request.url)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  // Allow access to protected route
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/booking/:path*',
  ]
}