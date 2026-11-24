import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { ReactNode } from "react";
import UnetePage from "@/app/(public)/unete/page";

vi.mock("@/components/ui/ScrollReveal", () => ({ default: ({ children }: { children: ReactNode }) => <>{children}</> }));
vi.mock("@/components/ui/Section", () => ({ default: ({ children }: { children: ReactNode }) => <>{children}</> }));

describe("Únete", () => {
  it("ends each section with a CONTACTA mailto button for its title", () => {
    const html = renderToStaticMarkup(<UnetePage />);
    const hrefs = [...html.matchAll(/<a href="([^"]+)"[^>]*>CONTACTA<\/a>/g)].map((match) => match[1].replaceAll("&amp;", "&"));
    const titles = ["Empresas que quieren liderar el cambio", "Organizaciones que generan impacto", "Embajadores que inspiran"];
    expect(hrefs).toEqual(
      titles.map((title) => `mailto:miguelgarzon@autentizity.org?subject=${encodeURIComponent(`Quiero unirme a AutentiZity – ${title}`)}`),
    );
  });
});
