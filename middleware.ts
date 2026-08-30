import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

/**
 * Next.js Middleware — Auth Guard
 * 
 * Only runs on routes that NEED protection: /dashboard/* and /admin/*
 * Interview pages are public (candidates access via UUID link).
 * API routes handle their own auth where needed.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check for NextAuth JWT session
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  })

  // If no session, redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const isAdmin = token.email?.includes('admin') || token.email === 'kkiran6094@gmail.com' || token.email === 'kushikushal416@gmail.com' || token.role === 'admin'

  // Admin routes require admin role
  if (pathname.startsWith('/admin')) {
    if (!isAdmin) {
      if (pathname.startsWith('/admin/templates')) {
        return NextResponse.redirect(new URL('/dashboard/templates', request.url))
      }
      if (pathname.startsWith('/admin/reports')) {
        return NextResponse.redirect(new URL('/dashboard/reports', request.url))
      }
      if (pathname.startsWith('/admin/settings')) {
        return NextResponse.redirect(new URL('/dashboard/settings', request.url))
      }
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  /*
   * Only protect dashboard and admin routes.
   * Everything else (/, /login, /shared/*, /interview/*, /api/*, /_next/*) is public.
   * This prevents middleware from interfering with Next.js internals,
   * error components, HMR, static files, etc.
   */
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
  ],
}
