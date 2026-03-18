import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth-edge";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session");

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ isAdmin: false });
    }

    const isValid = await verifySessionToken(sessionCookie.value);
    return NextResponse.json({ isAdmin: isValid });
  } catch {
    return NextResponse.json({ isAdmin: false });
  }
}
