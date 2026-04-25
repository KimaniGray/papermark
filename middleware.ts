import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. PUBLIC PATHS: Let investors see the Tsavo Resilience Fund 1 Pitch
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/tsavo-pitch") || // Update your page name here if needed
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 2. EDGE-SAFE ROUTING: No __dirname allowed.
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
