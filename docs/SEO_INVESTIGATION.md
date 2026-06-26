# SEO Investigation Report — AutentiZity

**Date:** 2026-06-26
**Site:** Next.js 15.3 + React 19
**Overall SEO Score: 35 / 100**

---

## Summary

The AutentiZity site has clean code, good heading hierarchy, and proper semantic layout scaffolding (header, nav, main, footer). However, nearly every other pillar of modern SEO is missing: no page-specific metadata, no OpenGraph/Twitter Cards, no sitemap, no robots.txt, no canonical URLs, no structured data, no viewport config, and no static generation — every page is `force-dynamic`, meaning search engines receive fully client-rendered pages with no SSG/ISR benefit.

---

## What's Done Well

| Area | Notes |
|---|---|
| **`<html lang="es">`** | Correctly declared in `src/app/layout.tsx:19` |
| **Font preconnect** | Google Fonts preconnect hints in `<head>` improve LCP |
| **Heading hierarchy** | Every page has a single `<h1>`; h1→h2→h3 progression is consistent and semantic. Example: `src/app/(public)/page.tsx:50` (h1), `:103` (h2), `:133` (h3). |
| **Semantic layout scaffolding** | `<header>` (`Header.tsx:98`), `<nav>` (`Header.tsx:121`, `Footer.tsx:31`), `<main>` (`(public)/layout.tsx:13`), `<footer>` (`Footer.tsx:15`), `<aside>` (`eventos/[slug]/page.tsx:147`) all used correctly. |
| **`next/image` usage** | Images use `next/image` with `fill`, `priority`, and `sizes` attributes throughout. This provides automatic WebP/AVIF conversion and lazy loading. Example: `noticias/page.tsx:72-77`. |
| **Image `alt` attributes** | Most images have meaningful `alt` text (`alt={event.title}`, etc.). |
| **Clean URLs** | Slug-based routes (`/noticias/mi-post`) are clean and crawlable. |
| **Responsive design** | Tailwind responsive utilities used consistently (`sm:`, `lg:` breakpoints). |

---

## What's Missing or Needs Improvement

### 1. No Page-Specific Metadata (HIGH)
**Impact:** Every page (except the root layout) shares the same `<title>` and `<meta description>`. Search engines see every page as "AutentiZity — Aceleradora de Impacto Social" with no differentiation.

No page exports `generateMetadata` or a page-level `metadata` object. The layout-level metadata in `src/app/layout.tsx:4-11` has only `title.template` and `description` — no page sets its own title to use the template.

**Affected files (all public pages):**
- `src/app/(public)/page.tsx` — no metadata
- `src/app/(public)/ecosistema/page.tsx` — no metadata
- `src/app/(public)/noticias/page.tsx` — no metadata
- `src/app/(public)/noticias/[slug]/page.tsx` — no metadata
- `src/app/(public)/eventos/[slug]/page.tsx` — no metadata
- `src/app/(public)/ranking/page.tsx` — no metadata
- `src/app/(public)/unete/page.tsx` — no metadata
- `src/app/(public)/actividad/page.tsx` — no metadata
- `src/app/(public)/movimientos/[slug]/page.tsx` — no metadata
- `src/app/(public)/actividades/[slug]/page.tsx` — no metadata
- `src/app/(public)/about/page.tsx` — no metadata

**Recommendation:** Add `generateMetadata` to every page, especially dynamic slug pages where content-specific titles and descriptions are available.

```tsx
// Example for noticias/[slug]/page.tsx
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const noticia = await getNoticiaBySlug(slug);
  if (!noticia) return { title: "Noticia no encontrada" };

  return {
    title: noticia.title,
    description: stripHtml(noticia.excerpt).slice(0, 160),
    openGraph: {
      title: noticia.title,
      description: stripHtml(noticia.excerpt).slice(0, 160),
      images: [{ url: noticia.coverImage, width: 1200, height: 630 }],
      type: "article",
      publishedTime: noticia.publishedAt,
    },
  };
}
```

---

### 2. No OpenGraph / Twitter Card Configuration (HIGH)
**Impact:** Zero social-media preview cards. When shared on LinkedIn, Twitter, WhatsApp, or Slack, the site shows no image, title, or description.

The metadata in `src/app/layout.tsx:4-11` has no `openGraph`, `twitter`, `creator`, or `publisher` properties.

**Recommendation:** Add `openGraph` and `twitter` to the root `metadata` export in `src/app/layout.tsx`:

```tsx
export const metadata: Metadata = {
  title: {
    default: "AutentiZity — Aceleradora de Impacto Social",
    template: "%s | AutentiZity",
  },
  description: "Aceleradora de Impacto Social que acompaña a empresas, ONG e instituciones...",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://autentizity.org",
    siteName: "AutentiZity",
    title: "AutentiZity — Aceleradora de Impacto Social",
    description: "Aceleradora de Impacto Social que acompaña a empresas, ONG e instituciones...",
    images: [{ url: "https://autentizity.org/images/og-default.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AutentiZity — Aceleradora de Impacto Social",
    description: "Aceleradora de Impacto Social que acompaña a empresas, ONG e instituciones...",
    images: ["https://autentizity.org/images/og-default.jpg"],
  },
};
```

---

### 3. No Sitemap.xml (HIGH)
**Impact:** Search engines have no map of the site's pages. Crawlers must discover pages via links alone, which can delay or prevent indexing of deeper pages.

**Findings:**
- No `public/sitemap.xml`
- No `src/app/sitemap.ts` (Next.js convention → `sitemap.xml`)
- No `next-sitemap` package
- All pages use `force-dynamic`, so a static export is not possible

**Recommendation:** Create a Next.js `sitemap.ts` file at `src/app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://autentizity.org";

  const staticRoutes = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${baseUrl}/ecosistema`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/ranking`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/unete`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/actividad`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/actividad/eventos`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/actividad/movimientos`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/actividad/actividades`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${baseUrl}/noticias`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
  ];

  // Fetch dynamic routes from DB (noticias, eventos, movimientos, actividades)
  // const noticias = await getNoticias();
  // const newsRoutes = noticias.filter(n => n.status === "published").map(n => ({
  //   url: `${baseUrl}/noticias/${n.slug}`,
  //   lastModified: new Date(n.updatedAt || n.publishedAt),
  //   changeFrequency: "monthly" as const,
  //   priority: 0.6,
  // }));
  // ... repeat for eventos, movimientos, actividades

  return [...staticRoutes /*, ...newsRoutes, ...eventRoutes, ...movRoutes, ...actRoutes */];
}
```

---

### 4. No Robots.txt (HIGH)
**Impact:** Without a robots.txt file or Next.js equivalent, crawlers may waste resources crawling admin pages, API routes, or other non-public paths. Worse, some crawlers may not crawl the site at all without explicit permission.

**Recommendation:** Create `src/app/robots.ts`:

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: "https://autentizity.org/sitemap.xml",
  };
}
```

---

### 5. No Canonical URLs (HIGH)
**Impact:** Duplicate content penalties. Every page should declare its canonical URL, especially content pages that might be accessible via multiple filter query params (e.g., `/actividad/eventos?tipo=virtual` vs `/actividad/eventos`).

**Recommendation:** Add `alternates.canonical` to the root metadata and to each page's metadata:

```tsx
// In src/app/layout.tsx metadata
export const metadata: Metadata = {
  // ... existing metadata
  alternates: {
    canonical: "https://autentizity.org",
  },
  metadataBase: new URL("https://autentizity.org"),  // Required for relative URLs
};

// For slug pages in generateMetadata:
// alternates: { canonical: `https://autentizity.org/noticias/${noticia.slug}` }
```

---

### 6. No Viewport Configuration (HIGH)
**Impact:** Next.js 15 separates `viewport` from `metadata`. Without a viewport export, the site renders at a potentially non-optimal viewport, affecting mobile ranking.

**Recommendation:** In `src/app/layout.tsx`, export `viewport` separately from `metadata`:

```tsx
import type { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#013F3F",
};
```

---

### 7. No Structured Data / JSON-LD (HIGH)
**Impact:** Rich results (sitelinks, article carousels, event listings, organization info) are not achievable. Competitors using JSON-LD will get enhanced SERP presence (rich snippets).

**Recommendation:** Add JSON-LD to key page types:

- **Home page:** `Organization` schema
- **News articles:** `Article` or `NewsArticle` schema
- **Events:** `Event` schema
- **Breadcrumbs:** `BreadcrumbList` schema

Example for Organization JSON-LD (add to `src/app/layout.tsx`):

```tsx
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AutentiZity",
  url: "https://autentizity.org",
  logo: "https://autentizity.org/images/logo-transparent.png",
  sameAs: [
    "https://www.linkedin.com/company/autentizity",
    "https://www.instagram.com/autentizity",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "comunidad@autentizity.org",
    contactType: "community",
  },
};

// In the <head> of RootLayout:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

Example for Event JSON-LD (in `eventos/[slug]/page.tsx`):

```tsx
const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: evento.title,
  startDate: evento.startDate,
  location: {
    "@type": "Place",
    name: evento.location,
  },
  description: stripHtml(evento.description),
  image: evento.coverImage,
  organizer: {
    "@type": "Organization",
    name: evento.organizer || "AutentiZity",
  },
};
```

---

### 8. All Pages Use `force-dynamic` — No SSG/ISR (HIGH)
**Impact:** Every page is server-rendered on each request with `export const dynamic = "force-dynamic"`. This means:
- No static HTML in the build output
- Slower Time to First Byte
- Higher server costs
- Search engine crawlers may be rate-limited or get slower responses
- No Incremental Static Regeneration (ISR) for content pages

All 14 public page files use `force-dynamic`.

**Recommendation:** Replace `force-dynamic` with ISR revalidation where possible:

```tsx
// Instead of:
export const dynamic = "force-dynamic";

// Use ISR for content pages:
export const revalidate = 3600; // Revalidate every hour

// Or for more dynamic pages:
export const revalidate = 60; // Revalidate every minute

// For truly real-time pages, keep force-dynamic but consider partial prerendering
```

Pages like `/noticias`, `/ecosistema`, `/ranking`, and `/unete` are good candidates for ISR with longer revalidation times (1 hour+). News and event detail pages can use shorter revalidation (5–15 minutes).

---

### 9. Plain `<img>` Tags on Ranking Page (MEDIUM)
**Impact:** `src/app/(public)/ranking/page.tsx:81-82` uses plain `<img>` tags for the AutentiZity and ManpowerGroup logos. This bypasses Next.js image optimization, meaning:
- No automatic WebP/AVIF conversion
- No lazy loading
- No responsive sizes
- No blur-up placeholder

**Recommendation:** Replace with `next/image`:

```tsx
// Replace:
<img src="/images/logo-transparent.png" alt="AutentiZity" className="h-8 w-auto" />

// With:
<Image src="/images/logo-transparent.png" alt="AutentiZity" width={120} height={32} className="h-8 w-auto" />
```

---

### 10. No Breadcrumbs (MEDIUM)
**Impact:** Missing breadcrumb navigation harms UX and prevents `BreadcrumbList` structured data. Search results show URLs instead of breadcrumb trails.

**Recommendation:** Add a `Breadcrumbs` component and include it on content detail pages:

```tsx
// components/ui/Breadcrumbs.tsx
import Link from "next/link";

interface Crumb { label: string; href: string; }

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: `https://autentizity.org${item.href}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="text-xs text-text-muted font-light">
        {items.map((item, i) => (
          <span key={item.href}>
            {i > 0 && <span className="mx-2">/</span>}
            {i < items.length - 1 ? (
              <Link href={item.href} className="hover:text-primary">{item.label}</Link>
            ) : (
              <span>{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
```

---

### 11. No `<article>` Tags for Content (MEDIUM)
**Impact:** News articles, event descriptions, and movement details are not wrapped in `<article>` HTML elements. This is a semantic HTML gap that affects content discoverability and accessibility.

**Recommendation:** Wrap news/post content in `<article>`:

```tsx
// In noticias/[slug]/page.tsx, replace the content section:
<article className="py-10 sm:py-16 lg:py-24">
  {/* ... content ... */}
</article>
```

Apply the same to event detail pages and movement detail pages.

---

### 12. About Page is a Placeholder (LOW)
**Impact:** `/about` (`src/app/(public)/about/page.tsx`) is a placeholder with "Próximamente." Search engines may index this thin-content page.

**Recommendation:** Either add real content or use a temporary `noindex`:

```tsx
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
```

---

### 13. Footer Links Point to Missing Pages (MEDIUM)
**Impact:** `src/components/layout/Footer.tsx:82-84` links to `/privacy`, `/cookies`, and `/legal` — these pages do not exist in the codebase. 404s hurt crawl budget and trust signals.

**Recommendation:** Create these pages or remove the links until they exist.

---

### 14. No `metadataBase` Configured (LOW)
**Impact:** All relative metadata URLs (like og:images) will be resolved incorrectly without `metadataBase`. This property is required for OpenGraph images to work.

**Recommendation:** Add to `src/app/layout.tsx` metadata:

```tsx
export const metadata: Metadata = {
  metadataBase: new URL("https://autentizity.org"),
  // ...
};
```

---

## Priority Action Plan

### HIGH (do first — foundational SEO)

| # | Task | Effort |
|---|---|---|
| 1 | Add `viewport` export with `width`, `initialScale`, `themeColor` to `layout.tsx` | 5 min |
| 2 | Add `metadataBase`, `openGraph`, and `twitter` to root `metadata` in `layout.tsx` | 15 min |
| 3 | Add `generateMetadata` to all slug-based dynamic pages (`noticias/[slug]`, `eventos/[slug]`, `movimientos/[slug]`, `actividades/[slug]`) | 1 hour |
| 4 | Add static page-level `metadata` exports to list pages (`noticias`, `actividad`, `ecosistema`, `ranking`, `unete`) | 30 min |
| 5 | Create `src/app/robots.ts` | 5 min |
| 6 | Create `src/app/sitemap.ts` with dynamic route generation | 1 hour |
| 7 | Add canonical URLs to root layout metadata and to `generateMetadata` on detail pages | 15 min |

### MEDIUM

| # | Task | Effort |
|---|---|---|
| 8 | Replace `<img>` with `<Image>` on ranking page | 5 min |
| 9 | Add `<article>` wrapper to news, event, and movement detail pages | 15 min |
| 10 | Add `Breadcrumbs` component with `BreadcrumbList` JSON-LD to detail pages | 1 hour |
| 11 | Replace `force-dynamic` with `revalidate` (ISR) on list pages where real-time data is not critical | 2 hours |
| 12 | Create `/privacy`, `/cookies`, `/legal` pages or remove footer links | 30 min |
| 13 | Add `Organization` JSON-LD to root layout | 15 min |
| 14 | Add `NewsArticle` JSON-LD to news detail pages | 30 min |
| 15 | Add `Event` JSON-LD to event detail pages | 30 min |

### LOW

| # | Task | Effort |
|---|---|---|
| 16 | Complete `/about` page content or add `noindex` | 30 min |
| 17 | Add `next.config.ts` `headers()` for cache-control and security headers | 30 min |
| 18 | Set up Google Search Console verification via TXT record or `verification` metadata | 10 min |
| 19 | Create a default OpenGraph image (`1200×630`) for social sharing fallback | 15 min |

---

## Checklist Summary

| Check | Status | Score |
|---|---|---|
| Title tags / meta descriptions | Partial (layout only) | 6/15 |
| OpenGraph / Twitter Cards | Missing | 0/10 |
| Canonical URLs | Missing | 0/5 |
| Sitemap.xml | Missing | 0/10 |
| Robots.txt | Missing | 0/5 |
| Structured data / JSON-LD | Missing | 0/10 |
| Heading hierarchy (h1→h4) | Good | 8/10 |
| Semantic HTML (header/nav/main/footer/article) | Mostly good, missing article | 7/10 |
| Image optimization (next/image, alt, sizes) | Good, 2 plain `<img>` exceptions | 6/10 |
| Viewport / mobile responsiveness | Viewport missing; responsive CSS good | 2/5 |
| Page performance (SSG/ISR vs force-dynamic) | All force-dynamic | 3/10 |
| URL structure (clean, descriptive, no params) | Good | 3/5 |
| **TOTAL** | | **35/100** |

---

*Report generated by codebase analysis. No files were modified.*
