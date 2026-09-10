import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { metadata } from "@/app/layout";

const imagePath = "/images/og-autentizity-v2.png";

describe("Default social preview", () => {
  it("ships a compact opaque 1200 by 630 PNG with strong contrast", async () => {
    const file = resolve("public", imagePath.slice(1));
    expect(existsSync(file)).toBe(true);
    expect(statSync(file).size).toBeLessThan(500_000);
    const image = sharp(file);
    expect(await image.metadata()).toMatchObject({
      width: 1200, height: 630, format: "png", hasAlpha: false,
    });
    expect((await image.stats()).channels[1].stdev).toBeGreaterThan(40);
  });

  it("uses the same versioned, described image for Open Graph and Twitter", () => {
    expect(metadata.openGraph?.images).toEqual([
      {
        url: imagePath,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "AutentiZity — Aceleradora de Impacto Social. Autenticidad en el trabajo.",
      },
    ]);
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      images: [{ url: imagePath, alt: "AutentiZity — Aceleradora de Impacto Social. Autenticidad en el trabajo." }],
    });
  });
});
