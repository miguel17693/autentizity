import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { hasRemoteMatch } from "next/dist/shared/lib/match-remote-pattern";
import type { RemotePattern } from "next/dist/shared/lib/image-config";
import type { Event } from "@/lib/types";
import { isOptimizableImage } from "@/lib/images";
import Card from "@/components/ui/Card";
import EventoDetailPage from "@/app/(public)/eventos/[slug]/page";

const data = vi.hoisted(() => ({ getEventoBySlug: vi.fn(), getMovimiento: vi.fn() }));
vi.mock("@/lib/data/store", () => data);
vi.mock("next/navigation", () => ({ notFound: () => { throw new Error("NOT_FOUND"); } }));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => undefined }), draftMode: async () => ({ isEnabled: false }) }));

const BLOB = "https://abc123.public.blob.vercel-storage.com/eventos/cover.jpg";
const IMGUR = "https://i.imgur.com/I2NP0i4.png";

afterEach(() => vi.unstubAllEnvs());

describe("isOptimizableImage", () => {
  it.each([BLOB, "/images/logo-transparent.png", "/logos/papageno.png"])("sends %s through the optimizer", (src) => {
    expect(isOptimizableImage(src)).toBe(true);
  });

  it.each([
    IMGUR,
    "http://abc123.public.blob.vercel-storage.com/cover.jpg",
    "https://public.blob.vercel-storage.com/cover.jpg",
    "https://abc123.public.blob.vercel-storage.com.evil.example/cover.jpg",
    "//i.imgur.com/I2NP0i4.png",
    "/\\i.imgur.com/I2NP0i4.png",
    "data:image/png;base64,AAAA",
    "no es una url",
    "",
    undefined,
    null,
  ])("loads %s directly instead of through the optimizer", (src) => {
    expect(isOptimizableImage(src)).toBe(false);
  });

  it("never marks as optimizable a remote URL that the production next.config would reject", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.resetModules();
    const { default: config } = await import("../next.config");
    const patterns = (config.images?.remotePatterns ?? []) as RemotePattern[];
    const samples = [BLOB, IMGUR, "https://images.unsplash.com/photo.jpg", "https://res.cloudinary.com/demo/image.jpg", "http://abc123.public.blob.vercel-storage.com/a.jpg"];
    for (const src of samples) {
      if (isOptimizableImage(src)) expect(hasRemoteMatch([], patterns, new URL(src))).toBe(true);
    }
    expect(hasRemoteMatch([], patterns, new URL(IMGUR))).toBe(false);
    expect(isOptimizableImage(BLOB)).toBe(hasRemoteMatch([], patterns, new URL(BLOB)));
  });
});

describe("content images with real next/image", () => {
  const event: Event = {
    id: "event-fixture", slug: "evento", title: "Evento", description: "Descripción", content: "",
    coverImage: IMGUR, coverImageOriginal: "", coverImageHero: "", coverImageHeroDesktop: "", coverImageCard: "",
    startDate: "2099-05-28T18:00", endDate: "", location: "Madrid", type: "presencial", tags: [], organizer: "AutentiZity",
    registrationUrl: "", featured: false, status: "published", movimientoId: "", updatedAt: "",
  };

  it("renders external hero images directly and keeps Blob images optimized", async () => {
    data.getEventoBySlug.mockResolvedValue(event);
    const external = renderToStaticMarkup(await EventoDetailPage({ params: Promise.resolve({ slug: event.slug }) }));
    expect(external).toContain(`src="${IMGUR}"`);
    expect(external).not.toContain("/_next/image?url=https%3A%2F%2Fi.imgur.com");

    data.getEventoBySlug.mockResolvedValue({ ...event, coverImage: BLOB });
    const blob = renderToStaticMarkup(await EventoDetailPage({ params: Promise.resolve({ slug: event.slug }) }));
    expect(blob).toContain(`/_next/image?url=${encodeURIComponent(BLOB)}`);
  });

  it("renders external card images directly", () => {
    const html = renderToStaticMarkup(<Card href="/eventos/evento" image={IMGUR} title="Evento" description="" tags={[]} />);
    expect(html).toContain(`src="${IMGUR}"`);
    expect(html).not.toContain("/_next/image");
  });
});
