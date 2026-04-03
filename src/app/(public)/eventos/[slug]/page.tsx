// Placeholder — Detalle de evento
export default async function EventoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24">
      <h1 className="font-serif text-4xl text-primary font-light">Evento: {slug}</h1>
      <p className="text-text-secondary mt-2 font-light">Próximamente — Fase 3</p>
    </div>
  );
}
