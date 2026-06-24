"use client";

import { useEffect, useState, useCallback } from "react";
import type { EcosistemaSection, EcosistemaEntity, Movement } from "@/lib/types";
import ImageUpload from "@/components/admin/ImageUpload";
import MultiSelectCheckbox from "@/components/admin/MultiSelectCheckbox";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function generateId(): string {
  return "eco_" + Math.random().toString(36).slice(2, 10);
}

function getSectionLabels(slug: string): { singular: string; plural: string } {
  const map: Record<string, { singular: string; plural: string }> = {
    embajadores: { singular: "embajador", plural: "Embajadores" },
    "empresas-impulsoras": { singular: "empresa", plural: "Empresas" },
    "entidades-colaboradoras": { singular: "entidad", plural: "Entidades" },
    instituciones: { singular: "institución", plural: "Instituciones" },
  };
  return map[slug] || { singular: "entidad", plural: "Entidades" };
}

const emptySection: Partial<EcosistemaSection> = {
  name: "",
  slug: "",
  description: "",
  sort_order: 0,
  active: true,
};

const emptyEntity: Partial<EcosistemaEntity> = {
  section_id: "",
  name: "",
  logo_url: "",
  description: "",
  tags: [],
  sort_order: 0,
  active: true,
};

/* ==========================================
 * Sortable Section Header
 * ========================================== */
function SortableSection({
  section,
  onEdit,
  onDelete,
  onAddEntity,
  entities,
  onEditEntity,
  onDeleteEntity,
}: {
  section: EcosistemaSection;
  onEdit: (s: EcosistemaSection) => void;
  onDelete: (id: string) => void;
  onAddEntity: (sectionId: string) => void;
  entities: EcosistemaEntity[];
  onEditEntity: (e: EcosistemaEntity) => void;
  onDeleteEntity: (id: string, sectionId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const entityIds = entities.map((e) => `ent-${e.id}`);

  return (
    <div ref={setNodeRef} style={style} className="bg-white border border-border rounded-2xl">
      {/* Section header */}
      <div className="flex items-center justify-between px-5 py-3.5 rounded-full bg-surface-alt border-b border-border">
        <div className="flex items-center gap-3">
          {/* Drag handle */}
          <button
            {...attributes}
            {...listeners}
            className="text-text-muted hover:text-primary cursor-grab active:cursor-grabbing touch-none"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 6h2v2H8V6zm6 0h2v2h-2V6zM8 11h2v2H8v-2zm6 0h2v2h-2v-2zm-6 5h2v2H8v-2zm6 0h2v2h-2v-2z" />
            </svg>
          </button>
          <span className={`w-2 h-2 rounded-full ${section.active ? "bg-accent" : "bg-text-muted"}`} />
          <span className="text-sm text-primary font-medium">{section.name}</span>
          <span className="text-[11px] text-text-muted font-mono">{section.slug}</span>
          {!section.active && (
            <span className="text-[10px] px-2 py-0.5 bg-text-muted/10 text-text-muted uppercase">Inactiva</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onEdit(section)} className="text-xs text-text-muted hover:text-primary transition-colors px-2 py-1">
            Editar
          </button>
          <button onClick={() => onDelete(section.id)} className="text-xs text-red-500 hover:text-red-700 transition-colors px-2 py-1">
            Eliminar
          </button>
        </div>
      </div>

      {/* Entities */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-medium tracking-[0.1em] text-text-muted">
            {getSectionLabels(section.slug).plural}
            {entities.length > 0 && (
              <span className="ml-2 text-text-muted/50">({entities.length})</span>
            )}
          </h3>
          <button
            onClick={() => onAddEntity(section.id)}
            className="px-3 py-1.5 bg-primary text-white rounded-full text-[11px] font-medium hover:bg-primary/90 transition-colors flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Añadir {getSectionLabels(section.slug).singular}
          </button>
        </div>

        {entities.length === 0 ? (
          <div className="text-sm text-text-muted py-3">No hay {getSectionLabels(section.slug).plural.toLowerCase()} en esta sección.</div>
        ) : (
          <SortableContext items={entityIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-1.5">
              {entities.map((entity) => (
                <SortableEntity
                  key={`ent-${entity.id}`}
                  entity={entity}
                  sectionId={section.id}
                  onEdit={onEditEntity}
                  onDelete={onDeleteEntity}
                />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  );
}

/* ==========================================
 * Sortable Entity Row
 * ========================================== */
function SortableEntity({
  entity,
  sectionId,
  onEdit,
  onDelete,
}: {
  entity: EcosistemaEntity;
  sectionId: string;
  onEdit: (e: EcosistemaEntity) => void;
  onDelete: (id: string, sectionId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `ent-${entity.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 border border-border/50 px-3 py-2 hover:bg-surface-alt/50 transition-colors"
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="text-text-muted hover:text-primary cursor-grab active:cursor-grabbing touch-none shrink-0"
      >
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 6h2v2H8V6zm6 0h2v2h-2V6zM8 11h2v2H8v-2zm6 0h2v2h-2v-2zm-6 5h2v2H8v-2zm6 0h2v2h-2v-2z" />
        </svg>
      </button>

      {entity.logo_url ? (
        <img src={entity.logo_url} alt={entity.name} className="w-12 h-7 object-contain border border-border" />
      ) : (
        <div className="w-12 h-7 bg-surface-alt border border-border flex items-center justify-center">
          <span className="text-[9px] text-text-muted">SIN LOGO</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-body">{entity.name}</p>
        {entity.description && (
          <p className="text-xs text-text-muted truncate">{entity.description}</p>
        )}
      </div>
      {!entity.active && (
        <span className="text-[10px] px-2 py-0.5 bg-text-muted/10 text-text-muted">Inactiva</span>
      )}
      <button onClick={() => onEdit(entity)} className="text-xs text-text-muted hover:text-primary px-2 py-1 shrink-0">
        Editar
      </button>
      <button onClick={() => onDelete(entity.id, sectionId)} className="text-xs text-red-500 hover:text-red-700 px-2 py-1 shrink-0">
        Eliminar
      </button>
    </div>
  );
}

/* ==========================================
 * Modal: Section Form
 * ========================================== */
function SectionFormModal({
  editing,
  saving,
  onSave,
  onCancel,
  onChange,
  slugify,
}: {
  editing: Partial<EcosistemaSection>;
  saving: boolean;
  onSave: (e: React.FormEvent) => void;
  onCancel: () => void;
  onChange: (updates: Partial<EcosistemaSection>) => void;
  slugify: (name: string) => string;
}) {
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 rounded-full border-b border-border flex items-center justify-between">
          <h3 className="font-serif text-lg text-primary font-normal">
            {editing.id ? "Editar sección" : "Nueva sección"}
          </h3>
          <button onClick={onCancel} className="text-text-muted hover:text-primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={onSave} className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted mb-1.5">Nombre *</label>
            <input
              type="text"
              value={editing.name || ""}
              onChange={(e) => {
                const name = e.target.value;
                onChange({ name, slug: slugify(name) });
              }}
              className="w-full px-3 py-2 rounded-full text-sm border border-border bg-surface-alt focus:border-accent outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted mb-1.5">Slug *</label>
            <input
              type="text"
              value={editing.slug || ""}
              onChange={(e) => onChange({ slug: e.target.value })}
              className="w-full px-3 py-2 rounded-full text-sm border border-border bg-surface-alt focus:border-accent outline-none font-mono text-xs"
              required
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted mb-1.5">Descripción</label>
            <textarea
              value={editing.description || ""}
              onChange={(e) => onChange({ description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-full text-sm border border-border bg-surface-alt focus:border-accent outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-text-body cursor-pointer">
              <input
                type="checkbox"
                checked={editing.active ?? true}
                onChange={(e) => onChange({ active: e.target.checked })}
                className="w-4 h-4"
              />
              Activa
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onCancel} className="px-4 py-2 rounded-full text-sm text-text-secondary border border-border hover:bg-surface-alt transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ==========================================
 * Modal: Entity Form
 * ========================================== */
function EntityFormModal({
  editing,
  saving,
  onSave,
  onCancel,
  onChange,
  movimientosItems,
  selectedMovimientoIds,
  onMovimientosChange,
  imageLabel,
  tagInput,
  onTagInputChange,
}: {
  editing: Partial<EcosistemaEntity>;
  saving: boolean;
  onSave: (e: React.FormEvent) => void;
  onCancel: () => void;
  onChange: (updates: Partial<EcosistemaEntity>) => void;
  movimientosItems: { id: string; label: string }[];
  selectedMovimientoIds: string[];
  onMovimientosChange: (ids: string[]) => void;
  imageLabel: string;
  tagInput: string;
  onTagInputChange: (value: string) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 rounded-full border-b border-border flex items-center justify-between">
          <h3 className="font-serif text-lg text-primary font-normal">
            {editing.id ? "Editar entidad" : "Nueva entidad"}
          </h3>
          <button onClick={onCancel} className="text-text-muted hover:text-primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={onSave} className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted mb-1.5">Nombre *</label>
            <input
              type="text"
              value={editing.name || ""}
              onChange={(e) => onChange({ name: e.target.value })}
              className="w-full px-3 py-2 rounded-full text-sm border border-border bg-surface-alt focus:border-accent outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted mb-1.5">Descripción (metatexto)</label>
            <input
              type="text"
              value={editing.description || ""}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Opcional: texto secundario"
              className="w-full px-3 py-2 rounded-full text-sm border border-border bg-surface-alt focus:border-accent outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted mb-1.5">Expertise / Tags (separadas por coma)</label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => onTagInputChange(e.target.value)}
              placeholder="Liderazgo, Diversidad, Tech"
              className="w-full px-3 py-2 rounded-full text-sm border border-border bg-surface-alt focus:border-accent outline-none"
            />
          </div>
          <div>
            <MultiSelectCheckbox
              label="Movimientos"
              items={movimientosItems}
              selectedIds={selectedMovimientoIds}
              onChange={onMovimientosChange}
            />
          </div>
          <ImageUpload
            label={imageLabel}
            value={editing.logo_url || ""}
            originalValue={editing.logo_url || ""}
            onChange={(url) => onChange({ logo_url: url })}
            aspect={imageLabel === "Foto" ? 1 / 1 : 3 / 1}
          />
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-text-body cursor-pointer">
              <input
                type="checkbox"
                checked={editing.active ?? true}
                onChange={(e) => onChange({ active: e.target.checked })}
                className="w-4 h-4"
              />
              Activa
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onCancel} className="px-4 py-2 rounded-full text-sm text-text-secondary border border-border hover:bg-surface-alt transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ==========================================
 * Main Page
 * ========================================== */
export default function AdminEcosistemaPage() {
  const [sections, setSections] = useState<EcosistemaSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<Partial<EcosistemaSection> | null>(null);
  const [savingSection, setSavingSection] = useState(false);
  const [entities, setEntities] = useState<Record<string, EcosistemaEntity[]>>({});
  const [editingEntity, setEditingEntity] = useState<Partial<EcosistemaEntity> | null>(null);
  const [savingEntity, setSavingEntity] = useState(false);

  const [movimientosDisp, setMovimientosDisp] = useState<Movement[]>([]);
  const [selectedMovimientoIds, setSelectedMovimientoIds] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // --- Data loading ---
  const loadEntities = useCallback(async (sectionId: string) => {
    const res = await fetch(`/api/ecosistema/entidades?section_id=${sectionId}`);
    const data = await res.json();
    setEntities((prev) => ({ ...prev, [sectionId]: data }));
  }, []);

  const loadSections = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/ecosistema/secciones");
    const data = await res.json();
    setSections(data);
    setLoading(false);
    for (const s of data) {
      loadEntities(s.id);
    }
  }, [loadEntities]);

  useEffect(() => { loadSections(); loadMovimientos(); }, [loadSections]);

  async function loadMovimientos() {
    const res = await fetch("/api/movimientos");
    setMovimientosDisp(await res.json());
  }

  // --- Drag & Drop ---
  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    // Entity drag
    if (activeId.startsWith("ent-")) {
      const entityId = activeId.replace("ent-", "");
      const targetEntityId = overId.replace("ent-", "");

      // Find which section these entities belong to
      let sectionId = "";
      for (const [sid, ents] of Object.entries(entities)) {
        if (ents.find((e) => e.id === entityId)) { sectionId = sid; break; }
      }
      if (!sectionId) return;

      // Reorder optimistically
      const oldList = [...(entities[sectionId] || [])];
      const oldIndex = oldList.findIndex((e) => e.id === entityId);
      const newIndex = oldList.findIndex((e) => e.id === targetEntityId);
      if (oldIndex === -1 || newIndex === -1) return;

      const [moved] = oldList.splice(oldIndex, 1);
      oldList.splice(newIndex, 0, moved);

      const reordered = oldList.map((e, i) => ({ ...e, sort_order: i + 1 }));
      setEntities((prev) => ({ ...prev, [sectionId]: reordered }));

      // Persist
      await Promise.all(reordered.map((e) =>
        fetch("/api/ecosistema/entidades", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(e),
        })
      ));
      return;
    }

    // Section drag
    const oldIndex = sections.findIndex((s) => s.id === activeId);
    const newIndex = sections.findIndex((s) => s.id === overId);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...sections];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    const updated = reordered.map((s, i) => ({ ...s, sort_order: i + 1 }));
    setSections(updated);

    await Promise.all(updated.map((s) =>
      fetch("/api/ecosistema/secciones", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s),
      })
    ));
  }

  // --- Section CRUD ---
  function startCreateSection() {
    const lastOrder = sections.length > 0 ? Math.max(...sections.map((s) => s.sort_order)) : 0;
    setEditingSection({ ...emptySection, sort_order: lastOrder + 1 });
  }

  async function saveSection(e: React.FormEvent) {
    e.preventDefault();
    if (!editingSection) return;
    setSavingSection(true);
    const payload: EcosistemaSection = {
      id: editingSection.id || generateId(),
      name: editingSection.name || "",
      slug: editingSection.slug || "",
      description: editingSection.description || "",
      sort_order: editingSection.sort_order || 0,
      active: editingSection.active ?? true,
    };
    const method = editingSection.id ? "PUT" : "POST";
    await fetch("/api/ecosistema/secciones", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setEditingSection(null);
    setSavingSection(false);
    loadSections();
  }

  async function deleteSection(id: string) {
    if (!confirm("¿Eliminar esta sección? También se eliminarán todas sus entidades.")) return;
    await fetch("/api/ecosistema/secciones", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    loadSections();
  }

  // --- Entity CRUD ---
  function startCreateEntity(sectionId: string) {
    const sectionEntities = entities[sectionId] || [];
    const lastOrder = sectionEntities.length > 0 ? Math.max(...sectionEntities.map((e) => e.sort_order)) : 0;
    setEditingEntity({ ...emptyEntity, section_id: sectionId, sort_order: lastOrder + 1 });
    setSelectedMovimientoIds([]);
    setTagInput("");
  }

  async function startEditEntity(entity: EcosistemaEntity) {
    setEditingEntity({ ...entity });
    setTagInput((entity.tags || []).join(", "));
    const res = await fetch(`/api/ecosistema/entidades?entity_id=${entity.id}&section_id=${entity.section_id}`);
    if (res.ok) {
      const data = await res.json();
      setSelectedMovimientoIds(data.movimientoIds || []);
    }
  }

  async function saveEntity(e: React.FormEvent) {
    e.preventDefault();
    if (!editingEntity) return;
    setSavingEntity(true);
    const payload = {
      id: editingEntity.id || generateId(),
      section_id: editingEntity.section_id || "",
      name: editingEntity.name || "",
      logo_url: editingEntity.logo_url || "",
      description: editingEntity.description || "",
      tags: tagInput.split(",").map((t: string) => t.trim()).filter(Boolean),
      sort_order: editingEntity.sort_order || 0,
      active: editingEntity.active ?? true,
      movimientoIds: selectedMovimientoIds,
    };
    const method = editingEntity.id ? "PUT" : "POST";
    const res = await fetch("/api/ecosistema/entidades", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Error desconocido" }));
      alert("Error al guardar: " + (err.error || res.statusText));
      setSavingEntity(false);
      return;
    }
    const data = await res.json();
    if (data.movimientoError) {
      alert(data.movimientoError);
    }
    setEditingEntity(null);
    setSavingEntity(false);
    loadEntities(payload.section_id);
  }

  async function deleteEntity(id: string, sectionId: string) {
    if (!confirm("¿Eliminar esta entidad?")) return;
    await fetch("/api/ecosistema/entidades", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    loadEntities(sectionId);
  }

  function slugify(name: string): string {
    return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  const sectionIds = sections.map((s) => s.id);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-surface-alt rounded w-48 mb-4" />
        {[1, 2, 3].map((i) => (<div key={i} className="h-16 bg-surface-alt rounded mb-3" />))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl text-primary font-light">Ecosistema</h1>
          <p className="mt-2 text-text-secondary text-sm font-light">
            Arrastra para reordenar secciones y logos. Gestiona las secciones y entidades de la página Ecosistema.
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-lg text-primary font-normal">Secciones</h2>
          <button onClick={startCreateSection} className="px-4 py-2 bg-primary text-white rounded-full text-xs font-medium hover:bg-primary/90 transition-colors">
            + Nueva sección
          </button>
        </div>

        {sections.length === 0 ? (
          <div className="bg-white border border-border rounded-2xl px-5 py-8 text-center text-text-muted text-sm">
            No hay secciones. Crea la primera.
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
              <div className="space-y-6">
                {sections.map((section) => (
                  <SortableSection
                    key={section.id}
                    section={section}
                    onEdit={setEditingSection}
                    onDelete={deleteSection}
                    onAddEntity={startCreateEntity}
                    entities={entities[section.id] || []}
                    onEditEntity={startEditEntity}
                    onDeleteEntity={deleteEntity}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Modals */}
      {editingSection && (
        <SectionFormModal
          editing={editingSection}
          saving={savingSection}
          onSave={saveSection}
          onCancel={() => setEditingSection(null)}
          onChange={(updates) => setEditingSection((prev) => ({ ...prev, ...updates }))}
          slugify={slugify}
        />
      )}

      {editingEntity && (
        <EntityFormModal
          editing={editingEntity}
          saving={savingEntity}
          onSave={saveEntity}
          onCancel={() => setEditingEntity(null)}
          onChange={(updates) => setEditingEntity((prev) => ({ ...prev, ...updates }))}
          movimientosItems={movimientosDisp
            .filter((m) => m.status === "published")
            .map((m) => ({ id: m.id, label: m.title }))}
          selectedMovimientoIds={selectedMovimientoIds}
          onMovimientosChange={setSelectedMovimientoIds}
          imageLabel={(() => {
            const section = sections.find((s) => s.id === editingEntity.section_id);
            return section?.slug === "embajadores" ? "Foto" : "Logo";
          })()}
          tagInput={tagInput}
          onTagInputChange={setTagInput}
        />
      )}
    </div>
  );
}
