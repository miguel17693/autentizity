import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/lib/ThemeContext";
import StyleSwitcher from "@/components/ui/StyleSwitcher";
import "./globals.css";

const chulapa = localFont({
  src: [
    { path: "../../public/fonts/Chulapa-Light.otf", weight: "300", style: "normal" },
    { path: "../../public/fonts/Chulapa-Regular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/Chulapa-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-chulapa",
  display: "swap",
});

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
    <html lang="es" className={chulapa.variable}>
      <head>
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
