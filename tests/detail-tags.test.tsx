import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { ComponentProps } from "react";
import EventoDetailPage from "@/app/(public)/eventos/[slug]/page";
import ActividadDetailPage from "@/app/(public)/actividades/[slug]/page";
import MovimientoDetailPage from "@/app/(public)/movimientos/[slug]/page";
import NoticiaDetailPage from "@/app/(public)/noticias/[slug]/page";

const TAGS = ["Inclusión", "Salud Mental"];
const base = {
  id: "fixture", slug: "fixture", title: "Título de prueba", description: "Descripción", content: "Contenido",
  coverImage: "/fixture.png", coverImageOriginal: "", coverImageHero: "", coverImageHeroDesktop: "", coverImageCard: "",
  tags: TAGS, status: "published", featured: false, movimientoId: "", updatedAt: "",
};

vi.mock("@/lib/data/store", () => ({
  getEventoBySlug: async () => ({ ...base, startDate: "2099-01-01T10:00", endDate: "", location: "Madrid", type: "presencial", organizer: "AutentiZity", registrationUrl: "" }),
  getActividadBySlug: async () => ({ ...base, buttonText: "", buttonUrl: "" }),
  getMovimientoBySlug: async () => base,
  getNoticiaBySlug: async () => ({ ...base, excerpt: "Entradilla", author: "Redacción", publishedAt: "2026-11-01" }),
  getMovimiento: async () => undefined,
  getMovimientosByActividad: async () => [],
  getEmbajadoresByMovimiento: async () => [],
  getEcosistemaSections: async () => [],
  getActividadesByMovimiento: async () => [],
  getNoticiasByMovimiento: async () => [],
  getEventosByMovimiento: async () => [],
}));
vi.mock("next/image", () => ({ default: ({ fill, priority, unoptimized, ...props }: ComponentProps<"img"> & { fill?: boolean; priority?: boolean; unoptimized?: boolean }) => <img {...props} /> }));
vi.mock("next/navigation", () => ({ notFound: () => { throw new Error("NOT_FOUND"); } }));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => undefined }), draftMode: async () => ({ isEnabled: false }) }));

const params = Promise.resolve({ slug: "fixture" });

describe("detail page tags", () => {
  it.each([
    ["eventos", EventoDetailPage],
    ["actividades", ActividadDetailPage],
    ["movimientos", MovimientoDetailPage],
    ["noticias", NoticiaDetailPage],
  ] as const)("renders %s tags once, below the header image instead of over it", async (_, Page) => {
    const html = renderToStaticMarkup(await Page({ params }));
    const heroEnd = html.indexOf("</section>");
    const hero = html.slice(0, heroEnd);
    const body = html.slice(heroEnd);
    for (const tag of TAGS) {
      expect(hero).not.toContain(tag);
      expect(body.split(`>${tag}</span>`)).toHaveLength(2);
    }
  });
});
