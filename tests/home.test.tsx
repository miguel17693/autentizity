import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { ReactNode } from "react";
import HomePage from "@/app/(public)/page";
import Header from "@/components/layout/Header";

vi.mock("@/lib/data/store", () => ({ getEventos: async () => [], getNoticias: async () => [] }));
vi.mock("@/components/ui/ScrollReveal", () => ({ default: ({ children }: { children: ReactNode }) => <>{children}</> }));
vi.mock("@/components/ui/Section", () => ({ default: ({ children }: { children: ReactNode }) => <>{children}</> }));
vi.mock("@/components/ui/CountUp", () => ({ default: () => null }));
vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
vi.mock("next/image", () => ({ default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} /> }));

const text = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");

describe("QA 3 home", () => {
  it("offers the requested hero links without angular quotes", async () => {
    const html = renderToStaticMarkup(await HomePage());
    const hero = html.split("</section>")[0];
    expect(hero).not.toContain("«autenticidad»");
    expect(hero).toMatch(/href="\/actividad\/movimientos"[^>]*>\s*Movimientos Corporativos/);
    expect(hero).toMatch(/href="\/unete"[^>]*>\s*Únete/);
    expect(text(hero)).not.toContain("Próximos eventos");
  });

  it("contains horizontal entrance animations inside the introduction", async () => {
    const html = renderToStaticMarkup(await HomePage());
    const intro = html.split("<section ").find((section) => section.includes("Un espacio compartido"));
    expect(intro?.split(">")[0]).toContain("overflow-x-clip");
  });

  it("renames recognition and the agenda label consistently", async () => {
    const html = renderToStaticMarkup(await HomePage());
    expect(text(html)).toContain("Referentes de la autenticidad 2026");
    expect(text(html)).toContain("Diploma “Empresa AutentiZity”");
    expect(text(html)).not.toContain(" Agenda ");
    const header = renderToStaticMarkup(<Header />);
    expect(text(header)).toContain("Referentes de la autenticidad 2026");
    expect(text(header)).toContain("Diploma “Empresa AutentiZity”");
    expect(header).toContain('href="/ecosistema#consejo-consultivo-impacto-social"');
    expect(header).toContain('href="/ecosistema#empresas-impulsoras"');
    expect(header).toContain('href="/ecosistema#entidades-colaboradoras"');
  });

  it("renders the approved introduction paragraphs with equal typography and full stops", async () => {
    const html = renderToStaticMarkup(await HomePage());
    const paragraphs = [...html.matchAll(/<p class="([^"]*)">([^<]*)<\/p>/g)];
    const first = paragraphs.find((p) => p[2].startsWith("AutentiZity es el punto"));
    const second = paragraphs.find((p) => p[2].startsWith("Contribuimos a crear"));
    expect(first?.[2]).toBe("AutentiZity es el punto de encuentro entre los valores de la sociedad y la cultura de las empresas. Impulsamos una cultura empresarial basada en lo que nos une, aquello que nos identifica, nos hace únicos y nos posiciona en el mundo.");
    expect(second?.[2]).toBe("Contribuimos a crear entornos laborales más humanos, en los que cada persona pueda mostrarse tal como es. En este camino nos acompañan empresas, instituciones asociaciones y profesionales.");
    const typography = (classes: string) => classes.split(" ").filter((c) => !c.startsWith("mt-")).join(" ");
    expect(typography(first![1])).toBe(typography(second![1]));
  });
});
