import type { Metadata } from "next";
import { ThemeProvider } from "@/lib/ThemeContext";
import StyleSwitcher from "@/components/ui/StyleSwitcher";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AutentiZity — Aceleradora de Impacto Social",
    template: "%s | AutentiZity",
  },
  description:
    "Aceleradora de Impacto Social que acompaña a empresas, ONG e instituciones a impulsar una cultura corporativa basada en la autenticidad y el compromiso social.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        {/* Preload Chulapa serif fonts for titles */}
        <link rel="preload" href="/fonts/Chulapa-Light.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Chulapa-Regular.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Chulapa-Bold.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans">
        <ThemeProvider>
          {children}
          <StyleSwitcher />
        </ThemeProvider>
      </body>
    </html>
  );
}
