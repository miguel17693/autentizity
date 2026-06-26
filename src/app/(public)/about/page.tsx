import type { Metadata } from "next";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Sobre Nosotros",
  robots: { index: false },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">Sobre Nosotros</h1>
      <p className="text-text-secondary mt-2">Próximamente</p>
    </div>
  );
}
