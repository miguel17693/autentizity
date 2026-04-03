// Placeholder — Detalle de evento
export default function EventoDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">Evento: {params.slug}</h1>
      <p className="text-text-secondary mt-2">Próximamente — Fase 3</p>
    </div>
  );
}
