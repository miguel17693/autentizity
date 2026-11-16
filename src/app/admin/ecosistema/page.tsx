"use client";

import { useEffect, useState, useCallback } from "react";
import type { EcosistemaSection, EcosistemaEntity, Movement } from "@/lib/types";
import { isPortraitSection } from "@/lib/ecosistema-sections";
import { generateId } from "@/lib/ids";
import { errorMessage, requestJson } from "@/lib/request-json";
import { parseTags } from "@/lib/utils";
import { useList } from "@/hooks/useCrud";
import AdminAlert from "@/components/admin/AdminAlert";
import SortableSection from "@/components/admin/ecosistema/SortableSection";
import SectionFormModal from "@/components/admin/ecosistema/SectionFormModal";
import EntityFormModal from "@/components/admin/ecosistema/EntityFormModal";
import { getSectionLabels } from "@/components/admin/ecosistema/labels";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

const SECTIONS_API = "/api/ecosistema/secciones";
const ENTITIES_API = "/api/ecosistema/entidades";

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

export default function AdminEcosistemaPage() {
  const [sections, setSections] = useState<EcosistemaSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<Partial<EcosistemaSection> | null>(null);
  const [savingSection, setSavingSection] = useState(false);
  const [entities, setEntities] = useState<Record<string, EcosistemaEntity[]>>({});
  const [editingEntity, setEditingEntity] = useState<Partial<EcosistemaEntity> | null>(null);
  const [savingEntity, setSavingEntity] = useState(false);

  const { items: movimientosDisp } = useList<Movement>("/api/movimientos");
  const [selectedMovimientoIds, setSelectedMovimientoIds] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // --- Data loading ---
  const loadEntities = useCallback(async (sectionId: string) => {
    try {
      const data = await requestJson<EcosistemaEntity[]>(`${ENTITIES_API}?section_id=${sectionId}`);
      setEntities((prev) => ({ ...prev, [sectionId]: data }));
    } catch (err) {
      setError(`No se pudieron cargar los participantes: ${errorMessage(err)}`);
    }
  }, []);

  const loadSections = useCallback(async () => {
    setLoading(true);
    try {
      const data = await requestJson<EcosistemaSection[]>(SECTIONS_API);
      setSections(data);
      for (const s of data) {
        loadEntities(s.id);
      }
    } catch (err) {
      setError(`No se pudieron cargar las secciones: ${errorMessage(err)}`);
    } finally {
      setLoading(false);
    }
  }, [loadEntities]);

  useEffect(() => { loadSections(); }, [loadSections]);

  async function runAction(action: () => Promise<unknown>, failure: string): Promise<boolean> {
    setError(null);
    try {
      await action();
      return true;
    } catch (err) {
      setError(`${failure}: ${errorMessage(err)}`);
      return false;
    }
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

      const saved = await runAction(
        () => Promise.all(reordered.map((e) => requestJson(ENTITIES_API, { method: "PUT", body: e }))),
        "No se pudo guardar el nuevo orden"
      );
      if (!saved) loadEntities(sectionId);
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

    const saved = await runAction(
      () => Promise.all(updated.map((s) => requestJson(SECTIONS_API, { method: "PUT", body: s }))),
      "No se pudo guardar el nuevo orden"
    );
    if (!saved) loadSections();
  }

  // --- Section CRUD ---
  function startCreateSection() {
    const lastOrder = sections.length > 0 ? Math.max(...sections.map((s) => s.sort_order)) : 0;
    setModalError(null);
    setEditingSection({ ...emptySection, sort_order: lastOrder + 1 });
  }

  function startEditSection(section: EcosistemaSection) {
    setModalError(null);
    setEditingSection(section);
  }

  async function saveSection(e: React.FormEvent) {
    e.preventDefault();
    if (!editingSection) return;
    setSavingSection(true);
    setModalError(null);
    const payload: EcosistemaSection = {
      id: editingSection.id || generateId("eco"),
      name: editingSection.name || "",
      slug: editingSection.slug || "",
      description: editingSection.description || "",
      sort_order: editingSection.sort_order || 0,
      active: editingSection.active ?? true,
    };
    try {
      await requestJson(SECTIONS_API, { method: editingSection.id ? "PUT" : "POST", body: payload });
      setEditingSection(null);
      loadSections();
    } catch (err) {
      setModalError(`No se pudo guardar: ${errorMessage(err)}`);
    } finally {
      setSavingSection(false);
    }
  }

  async function deleteSection(id: string) {
    if (!confirm("¿Eliminar esta sección? También se eliminarán todas sus entidades.")) return;
    await runAction(
      () => requestJson(SECTIONS_API, { method: "DELETE", body: { id } }),
      "No se pudo eliminar la sección"
    );
    loadSections();
  }

  // --- Entity CRUD ---
  function startCreateEntity(sectionId: string) {
    const sectionEntities = entities[sectionId] || [];
    const lastOrder = sectionEntities.length > 0 ? Math.max(...sectionEntities.map((e) => e.sort_order)) : 0;
    setModalError(null);
    setEditingEntity({ ...emptyEntity, section_id: sectionId, sort_order: lastOrder + 1 });
    setSelectedMovimientoIds([]);
    setTagInput("");
  }

  async function startEditEntity(entity: EcosistemaEntity) {
    setModalError(null);
    setEditingEntity({ ...entity });
    setTagInput((entity.tags || []).join(", "));
    const res = await fetch(`${ENTITIES_API}?entity_id=${entity.id}&section_id=${entity.section_id}`);
    if (res.ok) {
      const data = await res.json();
      setSelectedMovimientoIds(data.movimientoIds || []);
    }
  }

  async function saveEntity(e: React.FormEvent) {
    e.preventDefault();
    if (!editingEntity) return;
    setSavingEntity(true);
    setModalError(null);
    const payload = {
      id: editingEntity.id || generateId("eco"),
      section_id: editingEntity.section_id || "",
      name: editingEntity.name || "",
      logo_url: editingEntity.logo_url || "",
      description: editingEntity.description || "",
      tags: parseTags(tagInput),
      sort_order: editingEntity.sort_order || 0,
      active: editingEntity.active ?? true,
      movimientoIds: selectedMovimientoIds,
    };
    try {
      const data = await requestJson<{ movimientoError?: string }>(ENTITIES_API, {
        method: editingEntity.id ? "PUT" : "POST",
        body: payload,
      });
      if (data?.movimientoError) {
        alert(data.movimientoError);
      }
      setEditingEntity(null);
      loadEntities(payload.section_id);
    } catch (err) {
      setModalError(`No se pudo guardar: ${errorMessage(err)}`);
    } finally {
      setSavingEntity(false);
    }
  }

  async function deleteEntity(id: string, sectionId: string) {
    const section = sections.find((s) => s.id === sectionId);
    const labels = getSectionLabels(section);
    const demonstrative = section && isPortraitSection(section) ? "este" : "esta";
    if (!confirm(`¿Eliminar ${demonstrative} ${labels.singular}?`)) return;
    await runAction(
      () => requestJson(ENTITIES_API, { method: "DELETE", body: { id } }),
      `No se pudo eliminar ${demonstrative} ${labels.singular}`
    );
    loadEntities(sectionId);
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
            Arrastra para reordenar secciones y participantes. Gestiona las secciones y participantes de la página Ecosistema.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6">
          <AdminAlert message={error} onDismiss={() => setError(null)} />
        </div>
      )}

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
                    onEdit={startEditSection}
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
          error={modalError}
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
          section={sections.find((s) => s.id === editingEntity.section_id)}
          tagInput={tagInput}
          onTagInputChange={setTagInput}
          error={modalError}
        />
      )}
    </div>
  );
}
