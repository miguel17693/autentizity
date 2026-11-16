import { createHmac, randomBytes } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import {
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  getSessionSecret,
  safeEqual,
  verifySessionToken,
} from "@/lib/auth/session";
import { safeAdminRedirect, safeRelativePath } from "@/lib/auth/redirect";
import { middleware } from "@/middleware";
import { POST as login } from "@/app/api/auth/login/route";
import { POST as createNoticiaRoute } from "@/app/api/noticias/route";

const store = vi.hoisted(() => ({ createNoticia: vi.fn(), getNoticias: vi.fn() }));
vi.mock("@/lib/data/store", () => store);

const SECRET = "test-session-secret";
const LEGACY_DEFAULT_SECRET = "autentizity-default-secret-change-in-production";

function legacyToken(secret: string) {
  const token = randomBytes(32).toString("hex");
  return `${token}.${createHmac("sha256", secret).update(token).digest("hex")}`;
}

function loginRequest(body: unknown) {
  return new NextRequest("http://localhost/api/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("SESSION_SECRET", SECRET);
  vi.stubEnv("ADMIN_USER", "admin");
  vi.stubEnv("ADMIN_PASS", "correct horse");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("session tokens", () => {
  it("verifies a freshly signed token", async () => {
    const token = await createSessionToken(SECRET);
    expect(await verifySessionToken(token, SECRET)).toBe(true);
  });

  it("rejects expired tokens", async () => {
    const issuedAt = Date.now();
    const token = await createSessionToken(SECRET, issuedAt);
    const expiry = issuedAt + SESSION_MAX_AGE_SECONDS * 1000;
    expect(await verifySessionToken(token, SECRET, expiry - 1)).toBe(true);
    expect(await verifySessionToken(token, SECRET, expiry)).toBe(false);
  });

  it("rejects tokens signed with another secret", async () => {
    const token = await createSessionToken("another-secret");
    expect(await verifySessionToken(token, SECRET)).toBe(false);
  });

  it("rejects tokens whose expiry was tampered with", async () => {
    const token = await createSessionToken(SECRET, Date.now() - SESSION_MAX_AGE_SECONDS * 2000);
    const [, nonce, signature] = token.split(".");
    const extended = `${Date.now() + 60_000}.${nonce}.${signature}`;
    expect(await verifySessionToken(token, SECRET)).toBe(false);
    expect(await verifySessionToken(extended, SECRET)).toBe(false);
  });

  it.each([
    ["legacy token with the old default secret", legacyToken(LEGACY_DEFAULT_SECRET)],
    ["legacy literal value", "authenticated"],
    ["empty value", ""],
    ["malformed signature", "9999999999999.abc.zz"],
  ])("rejects a %s", async (_label, token) => {
    expect(await verifySessionToken(token, SECRET)).toBe(false);
  });

  it("fails closed when no secret is configured", async () => {
    const token = await createSessionToken(SECRET);
    vi.stubEnv("SESSION_SECRET", "   ");
    expect(getSessionSecret()).toBeNull();
    expect(await verifySessionToken(token, getSessionSecret())).toBe(false);
    await expect(createSessionToken("")).rejects.toThrow();
  });

  it("compares credentials by value", async () => {
    expect(await safeEqual("correct horse", "correct horse")).toBe(true);
    expect(await safeEqual("correct horse", "correct horsf")).toBe(false);
    expect(await safeEqual("short", "a much longer value")).toBe(false);
  });
});

describe("login route", () => {
  it("issues a verifiable session cookie for valid credentials", async () => {
    const response = await login(loginRequest({ username: "admin", password: "correct horse" }));
    expect(response.status).toBe(200);
    const cookie = response.cookies.get("admin_session");
    expect(cookie?.httpOnly).toBe(true);
    expect(await verifySessionToken(cookie?.value, SECRET)).toBe(true);
    expect(response.cookies.get("admin_ui")?.value).toBe("1");
  });

  it("rejects wrong credentials without a cookie", async () => {
    const response = await login(loginRequest({ username: "admin", password: "wrong" }));
    expect(response.status).toBe(401);
    expect(response.cookies.get("admin_session")).toBeUndefined();
  });

  it("returns 500 and never issues a token when SESSION_SECRET is missing", async () => {
    vi.stubEnv("SESSION_SECRET", "");
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const response = await login(loginRequest({ username: "admin", password: "correct horse" }));
      expect(response.status).toBe(500);
      expect(response.cookies.get("admin_session")).toBeUndefined();
    } finally {
      log.mockRestore();
    }
  });
});

describe("middleware", () => {
  function request(path: string, token?: string, method = "GET") {
    return new NextRequest(`http://localhost${path}`, {
      method,
      headers: token ? { cookie: `admin_session=${token}` } : {},
    });
  }

  it("lets a valid session reach the admin panel", async () => {
    const response = await middleware(request("/admin", await createSessionToken(SECRET)));
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("redirects forged default-secret tokens to the login page when SESSION_SECRET is unset", async () => {
    vi.stubEnv("SESSION_SECRET", "");
    const response = await middleware(request("/admin", legacyToken(LEGACY_DEFAULT_SECRET)));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/admin/login");
  });

  it("rejects API mutations when no secret is configured, even with a previously valid token", async () => {
    const token = await createSessionToken(SECRET);
    vi.stubEnv("SESSION_SECRET", "");
    const response = await middleware(request("/api/noticias", token, "POST"));
    expect(response.status).toBe(401);
  });
});

describe("handler-level admin check", () => {
  it("rejects mutations without a session even if middleware is bypassed", async () => {
    const response = await createNoticiaRoute(
      new NextRequest("http://localhost/api/noticias", { method: "POST", body: JSON.stringify({ title: "x" }) })
    );
    expect(response.status).toBe(401);
    expect(store.createNoticia).not.toHaveBeenCalled();
  });
});

describe("redirect guards", () => {
  it.each([
    [null, "/admin"],
    ["/admin", "/admin"],
    ["/admin/noticias", "/admin/noticias"],
    ["/admin?tab=1", "/admin?tab=1"],
    ["https://evil.example/admin", "/admin"],
    ["//evil.example/admin", "/admin"],
    ["/\\evil.example", "/admin"],
    ["/administrator", "/admin"],
    ["/noticias", "/admin"],
    ["javascript:alert(1)", "/admin"],
  ])("safeAdminRedirect(%s) -> %s", (input, expected) => {
    expect(safeAdminRedirect(input)).toBe(expected);
  });

  it.each([
    ["/noticias/slug?x=1", "/noticias/slug?x=1"],
    ["//evil.example", "/"],
    ["https://evil.example", "/"],
    ["/\\evil.example", "/"],
    ["/ok\nLocation: x", "/"],
  ])("safeRelativePath(%s) -> %s", (input, expected) => {
    expect(safeRelativePath(input)).toBe(expected);
  });
});
