import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. ALLOW PUBLIC ACCESS: This lets the investor see your pitch page
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/nssf-pitch") || // Your custom story page
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 2. EDGE-SAFE LOGIC: Standard routing only.
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
