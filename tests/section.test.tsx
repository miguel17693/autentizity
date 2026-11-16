import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Section from "@/components/ui/Section";

const { getSections, draft } = vi.hoisted(() => ({
  getSections: vi.fn(),
  draft: { isEnabled: false },
}));
vi.mock("@/lib/data/sections", () => ({ getSections }));
vi.mock("next/headers", () => ({ draftMode: async () => draft }));

const render = async (id: string) => renderToStaticMarkup(await Section({ id, children: <p>Contenido privado</p> }));

beforeEach(() => {
  draft.isEnabled = false;
  getSections.mockResolvedValue([
    { id: "rank-cta", label: "CTA", page: "Reconocimiento", visible: false },
    { id: "rank-intro", label: "Intro", page: "Reconocimiento", visible: true },
  ]);
});

describe("Section visibility", () => {
  it("does not send hidden sections to visitors", async () => {
    expect(await render("rank-cta")).toBe("");
  });

  it("renders visible and unconfigured sections", async () => {
    expect(await render("rank-intro")).toContain("Contenido privado");
    expect(await render("unknown")).toContain("Contenido privado");
  });

  it("keeps hidden sections flagged in admin preview", async () => {
    draft.isEnabled = true;
    const html = await render("rank-cta");
    expect(html).toContain('data-hidden="true"');
    expect(html).toContain("Contenido privado");
  });

  it("falls back to visible when the configuration cannot be read", async () => {
    getSections.mockRejectedValueOnce(new Error("db down"));
    expect(await render("rank-cta")).toContain("Contenido privado");
  });
});
