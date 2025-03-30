import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const protectedRoutes = ['/dashboard', '/booking']
  const isProtected = protectedRoutes.some(path => pathname.startsWith(path))

  if (!isProtected) return NextResponse.next()

  const token = request.cookies.get('token')?.value

  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // ✅ Optional: Validate token with backend
  try {
    const res = await fetch('http://localhost:5000/auth/test', {
      method: 'GET',
      headers: {
        Cookie: `token=${token}`,
      },
      credentials: 'include', 
    })

    if (!res.ok) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  } catch (err) {
    console.error('Middleware auth check failed:', err)
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/booking/:path*'],
}