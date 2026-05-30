import { NextRequest, NextResponse } from "next/server";
import { ACCESS_COOKIE, verifyToken } from "@/lib/auth";

const protectedRoutes = [
  { prefix: "/seller", roles: ["seller", "admin"] },
  { prefix: "/admin", roles: ["admin"] },
  { prefix: "/cart", roles: ["customer", "admin"] },
  { prefix: "/orders", roles: ["customer", "admin"] },
  { prefix: "/profile", roles: ["customer", "seller", "admin"] },
  { prefix: "/wishlist", roles: ["customer", "admin"] }
];

export function middleware(request: NextRequest) {
  const rule = protectedRoutes.find((route) => request.nextUrl.pathname.startsWith(route.prefix));
  if (!rule) return NextResponse.next();
  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  if (!token) return NextResponse.redirect(new URL(`/auth/login?next=${request.nextUrl.pathname}`, request.url));
  try {
    const payload = verifyToken(token, "access");
    if (!rule.roles.includes(payload.role)) return NextResponse.redirect(new URL("/", request.url));
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL(`/auth/login?next=${request.nextUrl.pathname}`, request.url));
  }
}

export const config = { matcher: ["/seller/:path*", "/admin/:path*", "/cart/:path*", "/orders/:path*", "/profile/:path*", "/wishlist/:path*"] };
