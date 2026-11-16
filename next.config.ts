import type { NextConfig } from "next";

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.vercel.live",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' https://fonts.gstatic.com",
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
  "connect-src 'self' https://*.vercel-storage.com https://*.blob.vercel-storage.com",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  // Lint runs in CI; a lint error must not block a production deploy.
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/**",
      },
      // Mock data used by the dev-only seed endpoint
      ...(process.env.NODE_ENV !== "production"
        ? [{ protocol: "https" as const, hostname: "images.unsplash.com", pathname: "/**" }]
        : []),
    ],
  },
  async redirects() {
    return [
      { source: "/privacy", destination: "/privacidad", permanent: true },
      { source: "/politica-privacidad", destination: "/privacidad", permanent: true },
      { source: "/legal", destination: "/aviso-legal", permanent: true },
      { source: "/politica-cookies", destination: "/cookies", permanent: true },
      { source: "/cookie-policy", destination: "/cookies", permanent: true },
      { source: "/code-of-ethics", destination: "/codigo-etico", permanent: true },
      { source: "/ethics", destination: "/codigo-etico", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
