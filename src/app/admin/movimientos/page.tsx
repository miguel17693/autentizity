"use client";

import { useState } from "react";
import type { Movement, Activity, EcosistemaEntity, EcosistemaSection } from "@/lib/types";
import ImageUpload from "@/components/admin/ImageUpload";
import MultiSelectCheckbox from "@/components/admin/MultiSelectCheckbox";
import RichTextEditor from "@/components/admin/RichTextEditor";
import AdminAlert from "@/components/admin/AdminAlert";
import FormActions from "@/components/admin/FormActions";
import { useCrud, useList } from "@/hooks/useCrud";
import { parseTags, stripHtml } from "@/lib/utils";
import { groupMovementParticipants } from "@/lib/movement-participants";

const emptyMovimiento: Partial<Movement> = {
  title: "",
  description: "",
  content: "",
  coverImage: "",
  coverImageOriginal: "",
  tags: [],
  status: "draft",
  featured: false,
};

export default function AdminMovimientosPage() {
  const { items: movimientos, save, remove, saving, error, clearError } = useCrud<Movement>("/api/movimientos");
  const [editing, setEditing] = useState<Partial<Movement> | null>(null);
  const [tagsInput, setTagsInput] = useState("");

  const { items: actividadesDisp } = useList<Activity>("/api/actividades");
  const { items: embajadoresDisp } = useList<EcosistemaEntity>("/api/ecosistema/entidades");
  const { items: participantSections } = useList<EcosistemaSection>("/api/ecosistema/secciones");
  const [selectedActividadIds, setSelectedActividadIds] = useState<string[]>([]);
  const [selectedEmbajadorIds, setSelectedEmbajadorIds] = useState<string[]>([]);

  function startCreate() {
    clearError();
    setEditing({ ...emptyMovimiento });
    setTagsInput("");
    setSelectedActividadIds([]);
    setSelectedEmbajadorIds([]);
  }

  async function startEdit(mov: Movement) {
    clearError();
    setEditing({ ...mov });
    setTagsInput(mov.tags.join(", "));

    const res = await fetch(`/api/movimientos/${mov.id}`);
    if (res.ok) {
      const data = await res.json();
      setSelectedActividadIds(
        (data.actividades as { id: string }[] | undefined)?.map((a) => a.id) || []
      );
      setSelectedEmbajadorIds(
        (data.embajadores as { id: string }[] | undefined)?.map((e) => e.id) || []
      );
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const saved = await save({
      ...editing,
      tags: parseTags(tagsInput),
      embajadorIds: selectedEmbajadorIds,
      actividadIds: selectedActividadIds,
    });
    if (saved) setEditing(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este movimiento?")) return;
    await remove(id);
  }

  const actividadesItems = actividadesDisp
    .filter((a) => a.status === "published")
    .map((a) => ({ id: a.id, label: a.title }));
  const participantGroups = groupMovementParticipants(embajadoresDisp, participantSections)
    .map(({ section, entities }) => ({
      id: section.id,
      label: `${section.name}${section.active ? "" : " (sección inactiva)"}`,
      entities,
    }));
  const unclassifiedEntities = embajadoresDisp.filter(
    (entity) => !participantSections.some((section) => section.id === entity.section_id),
  );
  if (unclassifiedEntities.length > 0) {
    participantGroups.push({ id: "unclassified", label: "Sin sección válida", entities: unclassifiedEntities });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl text-primary font-light">Movimientos Corporativos</h1>
          <p className="text-text-secondary text-sm font-light mt-1">
            {movimientos.length} movimientos
          </p>
        </div>
        <button
          onClick={startCreate}
          className="px-5 py-2.5 bg-primary text-white rounded-full text-[12px] font-medium tracking-[0.06em] uppercase hover:bg-primary-light transition-colors"
        >
          + Nuevo movimiento
        </button>
      </div>

      {!editing && error && (
        <div className="mb-6">
          <AdminAlert message={error} onDismiss={clearError} />
        </div>
      )}

      {editing && (
        <form
          onSubmit={handleSave}
          className="bg-white border border-border rounded-2xl p-6 mb-8 space-y-4"
        >
          <h2 className="font-serif text-xl text-primary font-light mb-4">
            {editing.id ? "Editar movimiento" : "Nuevo movimiento"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted mb-1.5">
                Título *
              </label>
              <input
                required
                value={editing.title ?? ""}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="w-full px-3 py-2.5 rounded-full text-sm border border-border bg-surface-alt focus:border-accent outline-none"
              />
            </div>
            <ImageUpload
              value={editing.coverImage ?? ""}
              originalValue={editing.coverImageOriginal ?? ""}
              heroValue={editing.coverImageHero ?? ""}
              cardValue={editing.coverImageCard ?? ""}
              multiContext
              onChange={(url, originalUrl) => setEditing((current) => current ? { ...current, coverImage: url, coverImageOriginal: originalUrl ?? "" } : current)}
              onChangeMulti={(urls) => setEditing((current) => current ? { ...current, ...urls } : current)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted mb-1.5">
              Descripción
            </label>
            <RichTextEditor
              value={editing.description ?? ""}
              onChange={(val) => setEditing({ ...editing, description: val })}
              placeholder="Breve descripción del movimiento..."
              variant="compact"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted mb-1.5">
              Contenido detallado
            </label>
            <RichTextEditor
              value={editing.content ?? ""}
              onChange={(val) => setEditing({ ...editing, content: val })}
              placeholder="Contenido detallado del movimiento..."
              variant="full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MultiSelectCheckbox
              label="Actividades"
              items={actividadesItems}
              selectedIds={selectedActividadIds}
              onChange={setSelectedActividadIds}
            />
            {participantGroups.map((group) => {
              const groupIds = new Set(group.entities.map((entity) => entity.id));
              return (
                <MultiSelectCheckbox
                  key={group.id}
                  label={group.label}
                  items={group.entities.map((entity) => ({
                    id: entity.id,
                    label: `${entity.name}${entity.active ? "" : " (inactiva)"}`,
                  }))}
                  selectedIds={selectedEmbajadorIds.filter((id) => groupIds.has(id))}
                  onChange={(ids) => setSelectedEmbajadorIds((current) => [
                    ...current.filter((id) => !groupIds.has(id)),
                    ...ids,
                  ])}
                />
              );
            })}
          </div>
          {unclassifiedEntities.length > 0 && (
            <p className="text-sm text-text-secondary">
              Las entidades sin sección válida no se muestran en público. Revisa su clasificación en Ecosistema.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted mb-1.5">
                Tags (separadas por coma)
              </label>
              <input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-3 py-2.5 rounded-full text-sm border border-border bg-surface-alt focus:border-accent outline-none"
                placeholder="Liderazgo, Impacto Social"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted mb-1.5">
                Estado
              </label>
              <select
                value={editing.status ?? "draft"}
                onChange={(e) => setEditing({ ...editing, status: e.target.value as Movement["status"] })}
                className="w-full px-3 py-2.5 rounded-full text-sm border border-border bg-surface-alt focus:border-accent outline-none"
              >
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
              </select>
            </div>
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 pb-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={editing.featured ?? false}
                onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                className="accent-accent w-4 h-4"
              />
              <span className="text-sm text-text-body">Destacado</span>
            </label>
          </div>

          <FormActions
            isEditing={!!editing.id}
            saving={saving}
            onCancel={() => setEditing(null)}
            error={error}
            onDismissError={clearError}
          />
        </form>
      )}

      <div className="space-y-2">
        {movimientos.map((mov) => (
          <div
            key={mov.id}
            className="bg-white border border-border rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-border-light transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-normal text-primary truncate">
                  {mov.title}
                </h3>
                <span
                  className={`shrink-0 text-[10px] font-medium tracking-[0.08em] uppercase px-2 py-0.5 ${
                    mov.status === "published"
                      ? "bg-accent/10 text-secondary"
                      : "bg-surface-alt text-text-muted"
                  }`}
                >
                  {mov.status === "published" ? "Publicado" : "Borrador"}
                </span>
                {mov.featured && (
                  <span className="shrink-0 text-[10px] font-medium tracking-[0.08em] uppercase px-2 py-0.5 bg-secondary/10 text-secondary">
                    Destacado
                  </span>
                )}
              </div>
              <p className="text-xs text-text-muted mt-0.5 truncate">
                {stripHtml(mov.description)}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => startEdit(mov)}
                className="px-3 py-1.5 rounded-full text-[11px] text-text-secondary rounded-full border border-border hover:border-accent hover:text-accent transition-colors"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(mov.id)}
                className="px-3 py-1.5 rounded-full text-[11px] text-red-400 border border-border hover:border-red-300 hover:text-red-600 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
