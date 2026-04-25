import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. ALLOW PUBLIC ACCESS: This lets investors see your story without a login
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/nssf-pitch") || // Your custom NSSF Storyboard
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 2. EDGE-SAFE ROUTING
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
