import type { ImgHTMLAttributes, ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));
vi.mock("@/components/ui/ScrollReveal", () => ({
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));
vi.mock("@/components/ui/Section", () => ({
  default: ({ id, children }: { id: string; children: ReactNode }) => (
    <div id={id}>{children}</div>
  ),
}));

import RankingPage, { metadata } from "@/app/(public)/ranking/page";

const pageTitle = "Referentes de la autenticidad 2026";
const renderPage = () => renderToStaticMarkup(<RankingPage />);
const textContent = (markup: string) => markup.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
const elementTexts = (markup: string, tag: string) =>
  [...markup.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, "g"))].map(
    (match) => textContent(match[1]),
  );

describe("Ranking page", () => {
  it("reserves the actual logo aspect ratios before images load on mobile", () => {
    const markup = renderPage();
    expect(markup).toMatch(/src="\/images\/logo-transparent.png"[^>]*width="944"[^>]*height="550"/);
    expect(markup).toMatch(/src="\/MPG_BE_Logo_SS_STK_WHT-1.webp"[^>]*width="1144"[^>]*height="617"/);
  });
  it("names the company diploma without changing the public anchors", () => {
    const markup = renderPage();
    const diploma = markup.match(/<section id="diploma"[^>]*>([\s\S]*?)<\/section>/)?.[1] ?? "";

    expect(elementTexts(diploma, "h2")).toEqual(['Diploma “Empresa AutentiZity”']);
    expect(textContent(diploma)).toContain('El Diploma “Empresa AutentiZity” distingue');
    for (const id of ["ranking", "diploma", "rank-intro", "rank-categories", "rank-process", "rank-cta", "rank-diploma"]) {
      expect(markup).toContain(`id="${id}"`);
    }
    expect(metadata.alternates?.canonical).toBe("https://autentizity.org/ranking");
  });

  it("places the hero PARTICIPA button after both partner logos", () => {
    const hero = renderPage().match(/<section\b[^>]*>([\s\S]*?)<\/section>/)?.[1] ?? "";
    const participaPosition = hero.indexOf('href="https://tally.so/r/1Aa2gp"');

    for (const logo of ["AutentiZity", "ManpowerGroup"]) {
      const logoPosition = hero.indexOf(`alt="${logo}"`);
      expect(logoPosition).toBeGreaterThanOrEqual(0);
      expect(participaPosition).toBeGreaterThan(logoPosition);
    }
  });

  it("links the hero and lower PARTICIPA pills to the exact application form", () => {
    const markup = renderPage();
    const participationLinks = [...markup.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)]
      .filter((match) => textContent(match[2]).toUpperCase() === "PARTICIPA");

    expect(participationLinks).toHaveLength(2);
    for (const link of participationLinks) {
      expect(link[1]).toContain('href="https://tally.so/r/1Aa2gp"');
      expect(link[1]).toMatch(/class="[^"]*\brounded-full\b/);
    }
    expect(markup.slice(0, markup.indexOf("</section>"))).toContain('href="https://tally.so/r/1Aa2gp"');
    expect(markup.slice(markup.indexOf('id="rank-cta"'))).toContain('href="https://tally.so/r/1Aa2gp"');
    const shareLink = [...markup.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)]
      .find((match) => textContent(match[2]) === "Comparte");
    expect(shareLink?.[1]).toContain('href="mailto:comunidad@autentizity.org?subject=Nominar%20l%C3%ADder"');
  });

  it("explains the impact and commitment recognized in selection step 03", () => {
    const markup = renderPage();
    const selection = markup.match(/>03<\/span><h3[^>]*>Selección<\/h3><p[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? "";

    expect(textContent(selection)).toBe(
      "Se seleccionan los 100 líderes y voces que serán reconocidos por su impacto, coherencia y compromiso, impulsando acciones concretas de bienestar, salud mental, inclusión y liderazgo",
    );
  });

  it("introduces the Top 100 with the approved copy and four distinct areas", () => {
    const markup = renderPage();
    const intro = markup.match(/<section id="ranking"[^>]*>([\s\S]*?)<\/section>/)?.[1] ?? "";

    expect(elementTexts(intro, "h2")).toEqual(["Top 100"]);
    expect(elementTexts(intro, "p")).toContain(
      "Referentes de la autenticidad 2026 es una iniciativa de AutentiZity y ManpowerGroup que reconoce a los 100 profesionales que más contribuyen a impulsar la autenticidad en España. Personas que, desde organizaciones, entidades sociales promueven entornos donde cada individuo puede desarrollar su potencial sin renunciar a quién es",
    );
    expect(elementTexts(intro, "li")).toEqual([
      "Bienestar Integral", "Salud Mental", "Inclusión", "Liderazgo Auténtico",
    ]);
  });

  it("uses the 2026 name consistently in the hero, metadata and participation copy", () => {
    const markup = renderPage();

    expect(elementTexts(markup, "h1")).toEqual([pageTitle]);
    expect(metadata.title).toBe(pageTitle);
    expect(elementTexts(markup, "p")).toContain(
      "Líderes y voces que están redefiniendo la cultura empresarial en España",
    );
    expect(textContent(markup)).not.toMatch(/ranking líderes de la autenticidad|authentic leaders/i);
    expect(textContent(markup)).toContain(`¿Quieres formar parte de ${pageTitle}`);
    expect(textContent(markup)).toContain(`Liderazgo Auténtico &amp; ${pageTitle}`);
  });
});
