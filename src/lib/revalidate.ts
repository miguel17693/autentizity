import { revalidatePath } from "next/cache";

/**
 * Content is cross-linked across many ISR pages (home, listings, detail pages,
 * movement pages, ecosistema, sitemap), so every public route under the root
 * layout is invalidated. Pages regenerate lazily on their next request.
 */
export function revalidatePublicContent(): void {
  revalidatePath("/", "layout");
}
