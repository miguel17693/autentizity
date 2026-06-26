import { NextRequest, NextResponse } from "next/server";
import { randomBytes, createHmac } from "crypto";

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;
const SESSION_SECRET =
  process.env.SESSION_SECRET || "autentizity-default-secret-change-in-production";

function createSessionToken(): string {
  const token = randomBytes(32).toString("hex");
  const hmac = createHmac("sha256", SESSION_SECRET).update(token).digest("hex");
  return `${token}.${hmac}`;
}

export async function POST(request: NextRequest) {
  if (!ADMIN_USER || !ADMIN_PASS) {
    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }

  const body = await request.json();
  const { username, password } = body;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = createSessionToken();
    const response = NextResponse.json({ ok: true });
    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    return response;
  }

  return NextResponse.json(
    { ok: false, error: "Credenciales incorrectas" },
    { status: 401 }
  );
}
