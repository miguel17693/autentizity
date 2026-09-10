import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { ComponentProps, ReactNode } from "react";
import type { Activity, Event } from "@/lib/types";
import EventoDetailPage from "@/app/(public)/eventos/[slug]/page";
import ActividadDetailPage from "@/app/(public)/actividades/[slug]/page";
import ActividadPage from "@/app/(public)/actividad/page";
import ActividadesTodosPage, { metadata } from "@/app/(public)/actividad/actividades/page";

const data = vi.hoisted(() => ({
  getEventoBySlug: vi.fn(), getMovimiento: vi.fn(), getActividadBySlug: vi.fn(),
  getMovimientosByActividad: vi.fn(), getEventos: vi.fn(), getMovimientos: vi.fn(), getActividades: vi.fn(),
}));
vi.mock("@/lib/data/store", () => data);
vi.mock("next/image", () => ({ default: ({ fill, priority, ...props }: ComponentProps<"img"> & { fill?: boolean; priority?: boolean }) => <img {...props} /> }));
vi.mock("next/navigation", () => ({ notFound: () => { throw new Error("NOT_FOUND"); } }));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => undefined }) }));
vi.mock("@/components/ui/Section", () => ({ default: ({ children }: { children: ReactNode }) => <>{children}</> }));
vi.mock("@/components/ui/FilterBar", () => ({ default: () => null }));

const activity: Activity = {
  id: "activity-fixture", slug: "actividad-prueba", title: "Actividad de prueba", description: "Descripción",
  content: "", coverImage: "/fixture.png", coverImageOriginal: "", coverImageHero: "", coverImageHeroDesktop: "",
  coverImageCard: "", tags: [], status: "published", featured: false, buttonText: "Reservar en Eventbrite", buttonUrl: "https://tickets.example/registro?source=actividad",
};
const event: Event = {
  ...activity, id: "event-fixture", slug: "evento-prueba", title: "Evento de prueba", type: "presencial",
  startDate: "2026-12-01T10:00:00Z", endDate: "", location: "Madrid", organizer: "Organización de prueba",
  registrationUrl: "https://tickets.example/registro?source=evento", updatedAt: "", movimientoId: "",
};
const params = Promise.resolve({ slug: "fixture" });

beforeEach(() => {
  vi.clearAllMocks();
  data.getEventoBySlug.mockResolvedValue(event);
  data.getActividadBySlug.mockResolvedValue(activity);
  data.getMovimientosByActividad.mockResolvedValue([]);
  data.getEventos.mockResolvedValue([]);
  data.getMovimientos.mockResolvedValue([]);
  data.getActividades.mockResolvedValue([activity]);
});

describe("activity listings", () => {
  it("removes the secondary ecosystem subtitle from both listings and metadata", async () => {
    const overview = renderToStaticMarkup(await ActividadPage());
    const listing = renderToStaticMarkup(await ActividadesTodosPage({ searchParams: Promise.resolve({}) }));
    for (const html of [overview, listing]) {
      expect(html).toContain("Actividades");
      expect(html).toContain(activity.title);
      expect(html).not.toContain("Otras actividades del ecosistema");
    }
    expect(metadata.description).not.toContain("Otras actividades del ecosistema");
  });
});

describe("registration copy", () => {
  it.each(["Reservar en Eventbrite", "Reservar en Evenbrite", "Inscribirse", "Inscríbete", "Registrarse", "Regístrate en otra plataforma", "Reservar plaza", "  RESERVAR EN EVENTBRITE  "])("normalizes legacy registration activity CTA %s while retaining buttonUrl", async (buttonText) => {
    data.getActividadBySlug.mockResolvedValue({ ...activity, buttonText });
    const html = renderToStaticMarkup(await ActividadDetailPage({ params }));
    expect(html).toMatch(/<a[^>]*href="https:\/\/tickets.example\/registro\?source=actividad"[^>]*>Regístrate<\/a>/);
  });

  it.each(["Descargar programa", "Ver vídeo", "Descargar guía de Eventbrite", "Conoce el proyecto"])("preserves the custom non-registration CTA %s", async (buttonText) => {
    data.getActividadBySlug.mockResolvedValue({ ...activity, buttonText });
    const html = renderToStaticMarkup(await ActividadDetailPage({ params }));
    expect(html).toContain(`>${buttonText}</a>`);
    expect(html).toContain(`href="${activity.buttonUrl}"`);
  });

  it("does not create a registration button without a URL or for cancelled events", async () => {
    data.getEventoBySlug.mockResolvedValue({ ...event, status: "cancelled" });
    expect(renderToStaticMarkup(await EventoDetailPage({ params }))).not.toContain(">Regístrate</a>");
    data.getEventoBySlug.mockResolvedValue({ ...event, registrationUrl: "" });
    expect(renderToStaticMarkup(await EventoDetailPage({ params }))).not.toContain(">Regístrate</a>");
    data.getActividadBySlug.mockResolvedValue({ ...activity, buttonUrl: "" });
    expect(renderToStaticMarkup(await ActividadDetailPage({ params }))).not.toContain(">Regístrate</a>");
  });

  it.each(["presencial", "híbrido", "virtual"] as const)("uses Regístrate for %s events without changing the registration destination", async (type) => {
    data.getEventoBySlug.mockResolvedValue({ ...event, type });
    const html = renderToStaticMarkup(await EventoDetailPage({ params }));
    expect(html).toMatch(/<a[^>]*href="https:\/\/tickets.example\/registro\?source=evento"[^>]*>Regístrate<\/a>/);
    expect(html).not.toContain("Eventbrite");
  });
});
