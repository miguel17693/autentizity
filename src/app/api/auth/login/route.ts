import { NextRequest, NextResponse } from "next/server";

const ADMIN_USER = "admin";
const ADMIN_PASS = "admin1234";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, password } = body;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const response = NextResponse.json({ ok: true });
    response.cookies.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    });
    return response;
  }

  return NextResponse.json(
    { ok: false, error: "Credenciales incorrectas" },
    { status: 401 }
  );
}
