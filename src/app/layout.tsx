import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#013F3F",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://autentizity.org"),
  title: {
    default: "AutentiZity — Aceleradora de Impacto Social",
    template: "%s | AutentiZity",
  },
  description:
    "Aceleradora de Impacto Social que acompaña a empresas, ONG e instituciones a impulsar una cultura corporativa basada en la autenticidad y el compromiso social.",
  alternates: {
    canonical: "https://autentizity.org",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://autentizity.org",
    siteName: "AutentiZity",
    title: "AutentiZity — Aceleradora de Impacto Social",
    description:
      "Aceleradora de Impacto Social que acompaña a empresas, ONG e instituciones a impulsar una cultura corporativa basada en la autenticidad y el compromiso social.",
    images: [{ url: "/images/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AutentiZity — Aceleradora de Impacto Social",
    description:
      "Aceleradora de Impacto Social que acompaña a empresas, ONG e instituciones a impulsar una cultura corporativa basada en la autenticidad y el compromiso social.",
    images: ["/images/og-default.png"],
  },
};

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&family=Montserrat:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
