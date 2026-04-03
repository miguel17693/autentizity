// Placeholder — Detalle de noticia
export default function NoticiaDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">Noticia: {params.slug}</h1>
      <p className="text-text-secondary mt-2">Próximamente — Fase 2</p>
    </div>
  );
}
