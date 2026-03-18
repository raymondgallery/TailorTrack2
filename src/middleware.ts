import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth-edge";

export async function middleware(request: NextRequest) {
  const { method, nextUrl } = request;

  // Only protect write operations on data API routes
  const isDataRoute =
    nextUrl.pathname.startsWith("/api/customers") ||
    nextUrl.pathname.startsWith("/api/orders") ||
    nextUrl.pathname.startsWith("/api/appointments");

  const isWriteMethod = ["POST", "PATCH", "PUT", "DELETE"].includes(method);

  if (isDataRoute && isWriteMethod) {
    const sessionCookie = request.cookies.get("admin_session");
    if (!sessionCookie || !(await verifySessionToken(sessionCookie.value))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/customers/:path*",
    "/api/orders/:path*",
    "/api/appointments/:path*",
  ],
};
