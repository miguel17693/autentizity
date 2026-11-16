import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_HINT_COOKIE,
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  getSessionSecret,
  safeEqual,
} from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  const adminUser = process.env.ADMIN_USER;
  const adminPass = process.env.ADMIN_PASS;
  const secret = getSessionSecret();

  if (!adminUser || !adminPass || !secret) {
    console.error("[POST /api/auth/login] ADMIN_USER, ADMIN_PASS or SESSION_SECRET is not configured");
    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Solicitud no válida" }, { status: 400 });
  }
  const { username, password } = (body ?? {}) as { username?: unknown; password?: unknown };

  const [userOk, passOk] = await Promise.all([
    safeEqual(typeof username === "string" ? username : "", adminUser),
    safeEqual(typeof password === "string" ? password : "", adminPass),
  ]);

  if (userOk && passOk) {
    const token = await createSessionToken(secret);
    const secure = process.env.NODE_ENV === "production";
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });
    response.cookies.set(ADMIN_HINT_COOKIE, "1", {
      httpOnly: false,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });
    return response;
  }

  return NextResponse.json(
    { ok: false, error: "Credenciales incorrectas" },
    { status: 401 }
  );
}
