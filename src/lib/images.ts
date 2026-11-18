// Mirrors images.remotePatterns in next.config.ts. Any other remote host must be
// rendered with `unoptimized` so the browser loads it directly (CSP img-src allows https:).
const OPTIMIZER_REMOTE_HOST = /^[a-z0-9-]+\.public\.blob\.vercel-storage\.com$/i;

export function isVercelBlobHost(hostname: string): boolean {
  return OPTIMIZER_REMOTE_HOST.test(hostname);
}

export function isOptimizableImage(src: string | null | undefined): boolean {
  if (!src) return false;
  if (src.startsWith("/")) return !src.startsWith("//") && !src.startsWith("/\\");
  try {
    const url = new URL(src);
    return url.protocol === "https:" && isVercelBlobHost(url.hostname);
  } catch {
    return false;
  }
}
