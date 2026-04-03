import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AuthentiZity",
  description: "Portal comunitario de noticias y eventos",
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
          href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans">
        {/* TODO: Header component */}
        <main className="flex-1">{children}</main>
        {/* TODO: Footer component */}
      </body>
    </html>
  );
}
