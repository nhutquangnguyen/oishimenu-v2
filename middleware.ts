import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl

  // Handle different domains/subdomains
  if (hostname === 'oishimenu.com' || hostname === 'www.oishimenu.com') {
    // Main domain - serve landing page at root

    // Allow access to static assets and API routes
    if (url.pathname.startsWith('/_next') ||
        url.pathname.startsWith('/api') ||
        url.pathname.startsWith('/favicon.ico')) {
      return NextResponse.next()
    }

    // Landing page is now at root, so allow root access
    if (url.pathname === '/') {
      return NextResponse.next()
    }

    // Redirect auth pages to merchant subdomain
    if (url.pathname.startsWith('/login') ||
        url.pathname.startsWith('/signup') ||
        url.pathname.startsWith('/forgot-password')) {
      return NextResponse.redirect(new URL(`https://merchant.oishimenu.com${url.pathname}`, request.url))
    }

    // Redirect dashboard routes to merchant subdomain
    if (url.pathname.startsWith('/dashboard') ||
        url.pathname.startsWith('/insights') ||
        url.pathname.startsWith('/orders') ||
        url.pathname.startsWith('/pos') ||
        url.pathname.startsWith('/feedback') ||
        url.pathname.startsWith('/menu') ||
        url.pathname.startsWith('/inventory') ||
        url.pathname.startsWith('/employees') ||
        url.pathname.startsWith('/finance') ||
        url.pathname.startsWith('/marketing') ||
        url.pathname.startsWith('/help')) {
      return NextResponse.redirect(new URL(`https://merchant.oishimenu.com${url.pathname}`, request.url))
    }

    // For any other path on main domain, redirect to home
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (hostname === 'merchant.oishimenu.com') {
    // Merchant subdomain - serve dashboard and auth pages

    // Redirect root to dashboard
    if (url.pathname === '/') {
      return NextResponse.rewrite(new URL('/dashboard', request.url))
    }

    // Allow access to all dashboard routes, auth pages, and assets
    if (url.pathname.startsWith('/dashboard') ||
        url.pathname.startsWith('/login') ||
        url.pathname.startsWith('/signup') ||
        url.pathname.startsWith('/forgot-password') ||
        url.pathname.startsWith('/insights') ||
        url.pathname.startsWith('/orders') ||
        url.pathname.startsWith('/pos') ||
        url.pathname.startsWith('/feedback') ||
        url.pathname.startsWith('/menu') ||
        url.pathname.startsWith('/inventory') ||
        url.pathname.startsWith('/employees') ||
        url.pathname.startsWith('/finance') ||
        url.pathname.startsWith('/marketing') ||
        url.pathname.startsWith('/help') ||
        url.pathname.startsWith('/_next') ||
        url.pathname.startsWith('/api') ||
        url.pathname.startsWith('/favicon.ico')) {
      return NextResponse.next()
    }

    // Redirect unknown paths to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // For development with localhost
  if (hostname.startsWith('localhost')) {
    // Allow direct access to all routes during development
    return NextResponse.next()
  }

  // Default: redirect to main domain
  return NextResponse.redirect(new URL('https://oishimenu.com', request.url))
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}