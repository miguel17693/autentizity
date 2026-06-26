import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_SECRET =
  process.env.SESSION_SECRET || "autentizity-default-secret-change-in-production";

const PUBLIC_PREFIXES = [
  "/admin/login",
  "/api/auth/login",
  "/api/auth/logout",
];

const PUBLIC_GET_API = [
  "/api/noticias",
  "/api/eventos",
  "/api/movimientos",
  "/api/actividades",
  "/api/ecosistema",
  "/api/sections",
];

const loginRateLimit = new Map<string, { count: number; resetTime: number }>();
const LOGIN_LIMIT = 5;
const LOGIN_WINDOW = 15 * 60 * 1000;

async function verifySessionToken(cookieValue: string): Promise<boolean> {
  try {
    const [token, sig] = cookieValue.split(".");
    if (!token || !sig) return false;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(SESSION_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sigRaw = await crypto.subtle.sign("HMAC", key, encoder.encode(token));
    const expectedSig = Array.from(new Uint8Array(sigRaw), (b) =>
      b.toString(16).padStart(2, "0")
    ).join("");
    return sig === expectedSig;
  } catch {
    return false;
  }
}

function getIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
    if (pathname === "/api/auth/login" && method === "POST") {
      const ip = getIP(request);
      const now = Date.now();
      const entry = loginRateLimit.get(ip);
      if (entry && now < entry.resetTime && entry.count >= LOGIN_LIMIT) {
        return NextResponse.json(
          { ok: false, error: "Demasiados intentos. Inténtalo más tarde." },
          { status: 429 }
        );
      }
      if (!entry || now >= entry.resetTime) {
        loginRateLimit.set(ip, { count: 1, resetTime: now + LOGIN_WINDOW });
      } else {
        entry.count++;
      }
    }
    return NextResponse.next();
  }

  if (
    method === "GET" &&
    PUBLIC_GET_API.some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.next();
  }

  const needsAuth =
    pathname.startsWith("/admin") || pathname.startsWith("/api");
  if (needsAuth) {
    const session = request.cookies.get("admin_session");
    if (!session || !(await verifySessionToken(session.value))) {
      if (pathname.startsWith("/api")) {
        return NextResponse.json(
          { error: "No autorizado" },
          { status: 401 }
        );
      }
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
