import { cleanupOrphanImage } from "@/lib/data/cleanup";

export const COVER_IMAGE_FIELDS = [
  "coverImage",
  "coverImageOriginal",
  "coverImageHero",
  "coverImageHeroDesktop",
  "coverImageCard",
] as const;

export type CoverImages = { [K in (typeof COVER_IMAGE_FIELDS)[number]]?: string };

/** Deletes blobs for image fields that the request changed or cleared. */
export async function cleanupReplacedImages(
  previous: CoverImages,
  current: CoverImages,
  submitted: Record<string, unknown>
): Promise<void> {
  for (const field of COVER_IMAGE_FIELDS) {
    const oldUrl = previous[field];
    if (submitted[field] !== undefined && oldUrl && oldUrl !== current[field]) {
      await cleanupOrphanImage(oldUrl);
    }
  }
}

export async function cleanupAllImages(item: CoverImages | undefined): Promise<void> {
  if (!item) return;
  for (const field of COVER_IMAGE_FIELDS) {
    const url = item[field];
    if (url) await cleanupOrphanImage(url);
  }
}
