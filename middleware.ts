import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. PUBLIC PATHS: Allow access to the Tsavo Resilience Fund 1 pitch
  // and vital Next.js system files.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/tsavo-pitch") || // Replace with your actual pitch slug
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 2. FORCED BYPASS: Temporarily let everything through to stop the 500 error
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
