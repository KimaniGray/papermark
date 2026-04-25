import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. ALLOW PUBLIC ACCESS: Explicitly let investors see the NSSF Storyboard
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/nssf-pitch") || // This allows your custom pitch page
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 2. STANDARD ROUTING: No __dirname or Node.js-only modules allowed here
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
