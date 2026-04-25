import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: [
    "/((?!api/|_next/|_static|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // 1. PUBLIC PATHS: Let investors see these without logging in
  if (
    path.startsWith("/view") || 
    path.startsWith("/verify") || 
    path.startsWith("/unsubscribe") ||
    path.startsWith("/login") ||
    path.startsWith("/register")
  ) {
    return NextResponse.next();
  }

  // 2. AUTH CHECK: Check if the user is logged in
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // 3. PROTECTED PATHS: If not logged in, send to login page
  if (!session && (path === "/" || path.startsWith("/dashboard") || path.startsWith("/settings"))) {
    const url = new URL("/login", req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
