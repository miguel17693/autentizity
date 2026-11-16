export const SESSION_COOKIE = "admin_session";
export const ADMIN_HINT_COOKIE = "admin_ui";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

const encoder = new TextEncoder();

export function getSessionSecret(): string | null {
  const secret = process.env.SESSION_SECRET?.trim();
  return secret ? secret : null;
}

function toHex(bytes: ArrayBuffer | Uint8Array): string {
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, "0")).join("");
}

function fromHex(hex: string): Uint8Array<ArrayBuffer> | null {
  if (hex.length === 0 || hex.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(hex)) return null;
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function importHmacKey(secret: string, usage: "sign" | "verify"): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    [usage]
  );
}

export async function createSessionToken(
  secret: string,
  now: number = Date.now(),
  maxAgeSeconds: number = SESSION_MAX_AGE_SECONDS
): Promise<string> {
  if (!secret) throw new Error("SESSION_SECRET is not configured");
  const expiresAt = now + maxAgeSeconds * 1000;
  const nonce = toHex(crypto.getRandomValues(new Uint8Array(16)));
  const payload = `${expiresAt}.${nonce}`;
  const key = await importHmacKey(secret, "sign");
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return `${payload}.${toHex(signature)}`;
}

export async function verifySessionToken(
  token: string | null | undefined,
  secret: string | null | undefined,
  now: number = Date.now()
): Promise<boolean> {
  if (!token || !secret) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [expiresAtRaw, nonce, signatureHex] = parts;
  if (!/^\d+$/.test(expiresAtRaw) || !nonce) return false;
  const expiresAt = Number(expiresAtRaw);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= now) return false;
  const signature = fromHex(signatureHex);
  if (!signature) return false;
  try {
    const key = await importHmacKey(secret, "verify");
    return await crypto.subtle.verify(
      "HMAC",
      key,
      signature,
      encoder.encode(`${expiresAtRaw}.${nonce}`)
    );
  } catch {
    return false;
  }
}

export async function safeEqual(a: string, b: string): Promise<boolean> {
  const [hashA, hashB] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(a)),
    crypto.subtle.digest("SHA-256", encoder.encode(b)),
  ]);
  const bytesA = new Uint8Array(hashA);
  const bytesB = new Uint8Array(hashB);
  let diff = 0;
  for (let i = 0; i < bytesA.length; i++) diff |= bytesA[i] ^ bytesB[i];
  return diff === 0;
}

export function readCookie(cookieHeader: string | null, name: string): string | undefined {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(";")) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    if (part.slice(0, index).trim() === name) {
      const value = part.slice(index + 1).trim();
      try {
        return decodeURIComponent(value);
      } catch {
        return value;
      }
    }
  }
  return undefined;
}

export async function isAdminRequest(request: Request): Promise<boolean> {
  const token = readCookie(request.headers.get("cookie"), SESSION_COOKIE);
  return verifySessionToken(token, getSessionSecret());
}
