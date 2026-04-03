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
      <body className="min-h-screen flex flex-col">
        {/* TODO: Header component */}
        <main className="flex-1">{children}</main>
        {/* TODO: Footer component */}
      </body>
    </html>
  );
}
