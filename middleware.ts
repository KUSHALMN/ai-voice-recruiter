import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Known attack signatures and malicious vulnerability scanner user-agents
const BLOCKED_USER_AGENTS = [
  'sqlmap',
  'nikto',
  'nmap',
  'masscan',
  'dirbuster',
  'gobuster',
  'wpscan',
  'zgrab',
  'havij',
  'acunetix',
  'netsparker'
]

// Common exploit probes and sensitive file paths to block at the edge
const BLOCKED_PATH_PATTERNS = [
  /\/\.\./,                   // Path traversal (../)
  /\/\.env/,                  // Environment variable files
  /\/\.git/,                  // Git repository metadata
  /\/wp-admin|\/wp-login/,    // WordPress probes
  /\/phpmyadmin/i,            // Database administration probes
  /\/etc\/passwd/i,           // UNIX system file probe
  /\/eval-stdin/,             // Code execution probe
  /\/actuator/i,              // Spring Boot actuator probes
  /\/\.aws/                   // Cloud credentials probe
]

/**
 * Next.js Edge Middleware — Security, Anti-Bot & Auth Guard
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase()

  // 1. Anti-Scraper / Vulnerability Scanner Detection
  for (const bot of BLOCKED_USER_AGENTS) {
    if (userAgent.includes(bot)) {
      console.warn(`[Security Alert] Blocked malicious user agent: ${userAgent} on ${pathname}`)
      return new NextResponse('Access Denied: Malicious scanner detected.', { status: 403 })
    }
  }

  // 2. Exploit Probe & Path Traversal Guard
  for (const pattern of BLOCKED_PATH_PATTERNS) {
    if (pattern.test(pathname)) {
      console.warn(`[Security Alert] Blocked suspicious exploit path probe: ${pathname}`)
      return new NextResponse('Forbidden: Prohibited path probe.', { status: 403 })
    }
  }

  // 3. HTTP Method Filtering (Prevent TRACE/TRACK methods)
  if (['TRACE', 'TRACK'].includes(request.method)) {
    return new NextResponse('Method Not Allowed', { status: 405 })
  }

  // 4. Role-based Auth Guard for /dashboard/* and /admin/*
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
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

    const isAdmin = token.email?.includes('admin') || 
                    token.email === 'kkiran6094@gmail.com' || 
                    token.email === 'kushikushal416@gmail.com' || 
                    token.role === 'admin'

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
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (images, icons)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
