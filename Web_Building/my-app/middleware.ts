// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Allow all HTTP methods for article routes
  if (req.nextUrl.pathname.startsWith('/articles/') && !req.nextUrl.pathname.endsWith('/edit')) {
    return NextResponse.next();
  }

  // Development mode handling
  if (process.env.NODE_ENV === 'development') {
    if (req.nextUrl.pathname.endsWith('/edit')) {
      const path = req.nextUrl.pathname.slice(0, -5);
      return NextResponse.rewrite(new URL(`/puck${path}`, req.url));
    }
    return NextResponse.next();
  }

  // Production mode - block edit routes
  if (req.nextUrl.pathname.endsWith('/edit') || 
      req.nextUrl.pathname.startsWith('/puck')) {
    return new NextResponse('Editing not available in production', { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/articles/:path*', 
    '/:path*/edit',
    '/puck/:path*'
  ]
};