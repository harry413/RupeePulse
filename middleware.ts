// middleware.ts — Route protection via NextAuth
// Runs on every request BEFORE the page renders (Edge runtime)

import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Allow the request through if the token exists
    return NextResponse.next();
  },
  {
    callbacks: {
      // Return true = allow, false = redirect to login
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Public routes — always allow
        const publicPaths = ['/login', '/signup', '/api/auth'];
        if (publicPaths.some((p) => pathname.startsWith(p))) return true;

        // Everything under /dashboard requires a valid session token
        if (pathname.startsWith('/dashboard')) return !!token;

        // Allow everything else (root redirect, static assets, etc.)
        return true;
      },
    },
    pages: {
      signIn: '/login',
    },
  }
);

// Only run middleware on these routes (not _next/static, images, etc.)
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/signup',
  ],
};
