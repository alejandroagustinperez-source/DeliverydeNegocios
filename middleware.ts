import { NextRequest, NextResponse } from "next/server";
import { computeAdminToken, ADMIN_COOKIE_NAME } from "./lib/adminToken";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = await computeAdminToken();
  const cookieValue = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

  if (!token || cookieValue !== token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
