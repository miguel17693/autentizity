"use client";

import { useEffect, useState, useCallback } from "react";
import type { EcosistemaSection, EcosistemaEntity } from "@/lib/types";
import ImageUpload from "@/components/admin/ImageUpload";

function generateId(): string {
  return "eco_" + Math.random().toString(36).slice(2, 10);
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
  sort_order: 0,
  active: true,
};

export default function AdminEcosistemaPage() {
  const [sections, setSections] = useState<EcosistemaSection[]>([]);
  const [loading, setLoading] = useState(true);

  // Section form state
  const [editingSection, setEditingSection] = useState<Partial<EcosistemaSection> | null>(null);
  const [savingSection, setSavingSection] = useState(false);

  // Entity form state
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [entities, setEntities] = useState<Record<string, EcosistemaEntity[]>>({});
  const [loadingEntities, setLoadingEntities] = useState(false);
  const [editingEntity, setEditingEntity] = useState<Partial<EcosistemaEntity> | null>(null);
  const [savingEntity, setSavingEntity] = useState(false);

  // Load sections
  const loadSections = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/ecosistema/secciones");
    const data = await res.json();
    setSections(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSections();
  }, [loadSections]);

  // Load entities for a section
  const loadEntities = useCallback(async (sectionId: string) => {
    setLoadingEntities(true);
    const res = await fetch(`/api/ecosistema/entidades?section_id=${sectionId}`);
    const data = await res.json();
    setEntities((prev) => ({ ...prev, [sectionId]: data }));
    setLoadingEntities(false);
  }, []);

  // Toggle section expansion
  function toggleSection(sectionId: string) {
    if (expandedSection === sectionId) {
      setExpandedSection(null);
    } else {
      setExpandedSection(sectionId);
      if (!entities[sectionId]) {
        loadEntities(sectionId);
      }
    }
  }

  // --- Section CRUD ---
  function startCreateSection() {
    const lastOrder = sections.length > 0 ? Math.max(...sections.map((s) => s.sort_order)) : 0;
    setEditingSection({ ...emptySection, sort_order: lastOrder + 1 });
  }

  function startEditSection(s: EcosistemaSection) {
    setEditingSection({ ...s });
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
    await fetch("/api/ecosistema/secciones", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setEditingSection(null);
    setSavingSection(false);
    loadSections();
  }

  async function deleteSection(id: string) {
    if (!confirm("¿Eliminar esta sección? También se eliminarán todas sus entidades.")) return;
    await fetch("/api/ecosistema/secciones", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadSections();
    setExpandedSection(null);
  }

  // --- Entity CRUD ---
  function startCreateEntity(sectionId: string) {
    const sectionEntities = entities[sectionId] || [];
    const lastOrder = sectionEntities.length > 0 ? Math.max(...sectionEntities.map((e) => e.sort_order)) : 0;
    setEditingEntity({ ...emptyEntity, section_id: sectionId, sort_order: lastOrder + 1 });
  }

  function startEditEntity(entity: EcosistemaEntity) {
    setEditingEntity({ ...entity });
  }

  async function saveEntity(e: React.FormEvent) {
    e.preventDefault();
    if (!editingEntity) return;
    setSavingEntity(true);

    const payload: EcosistemaEntity = {
      id: editingEntity.id || generateId(),
      section_id: editingEntity.section_id || "",
      name: editingEntity.name || "",
      logo_url: editingEntity.logo_url || "",
      description: editingEntity.description || "",
      sort_order: editingEntity.sort_order || 0,
      active: editingEntity.active ?? true,
    };

    const method = editingEntity.id ? "PUT" : "POST";
    await fetch("/api/ecosistema/entidades", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setEditingEntity(null);
    setSavingEntity(false);
    loadEntities(payload.section_id);
  }

  async function deleteEntity(id: string, sectionId: string) {
    if (!confirm("¿Eliminar esta entidad?")) return;
    await fetch("/api/ecosistema/entidades", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadEntities(sectionId);
  }

  // --- Auto slug from name ---
  function slugify(name: string): string {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-surface-alt rounded w-48 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-surface-alt rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl text-primary font-light">Ecosistema</h1>
          <p className="mt-2 text-text-secondary text-sm font-light">
            Gestiona las secciones y entidades de la página Ecosistema.
          </p>
        </div>
      </div>

      {/* Sections list */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-lg text-primary font-normal">Secciones</h2>
          <button
            onClick={startCreateSection}
            className="px-4 py-2 bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            + Nueva sección
          </button>
        </div>

        <div className="bg-white border border-border divide-y divide-border">
          {sections.length === 0 && (
            <div className="px-5 py-8 text-center text-text-muted text-sm">
              No hay secciones. Crea la primera.
            </div>
          )}
          {sections.map((section) => (
            <div key={section.id}>
              <div className="flex items-center justify-between px-5 py-3.5">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="flex items-center gap-3 text-left flex-1"
                >
                  <span className={`w-2 h-2 rounded-full ${section.active ? "bg-accent" : "bg-text-muted"}`} />
                  <span className="text-sm text-text-body font-light">{section.name}</span>
                  <span className="text-xs text-text-muted">{section.slug}</span>
                  {!section.active && (
                    <span className="text-[10px] px-2 py-0.5 bg-text-muted/10 text-text-muted uppercase">Inactiva</span>
                  )}
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEditSection(section)}
                    className="text-xs text-text-muted hover:text-primary transition-colors px-2 py-1"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteSection(section.id)}
                    className="text-xs text-red-500 hover:text-red-700 transition-colors px-2 py-1"
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              {/* Expanded: entities */}
              {expandedSection === section.id && (
                <div className="border-t border-border bg-surface-alt px-5 py-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-primary">Entidades — {section.name}</h3>
                    <button
                      onClick={() => startCreateEntity(section.id)}
                      className="px-3 py-1.5 bg-primary text-white text-[11px] font-medium hover:bg-primary/90 transition-colors"
                    >
                      + Nueva entidad
                    </button>
                  </div>

                  {loadingEntities ? (
                    <div className="text-sm text-text-muted animate-pulse">Cargando...</div>
                  ) : (
                    <div className="space-y-2">
                      {(entities[section.id] || []).length === 0 && (
                        <div className="text-sm text-text-muted py-3">No hay entidades en esta sección.</div>
                      )}
                      {(entities[section.id] || []).map((entity) => (
                        <div
                          key={entity.id}
                          className="flex items-center gap-3 bg-white border border-border px-3 py-2"
                        >
                          {entity.logo_url ? (
                            <img
                              src={entity.logo_url}
                              alt={entity.name}
                              className="w-10 h-6 object-contain"
                            />
                          ) : (
                            <div className="w-10 h-6 bg-surface-alt border border-border" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-text-body truncate">{entity.name}</p>
                            {entity.description && (
                              <p className="text-xs text-text-muted truncate">{entity.description}</p>
                            )}
                          </div>
                          {!entity.active && (
                            <span className="text-[10px] px-2 py-0.5 bg-text-muted/10 text-text-muted">Inactiva</span>
                          )}
                          <button
                            onClick={() => startEditEntity(entity)}
                            className="text-xs text-text-muted hover:text-primary px-2 py-1 shrink-0"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => deleteEntity(entity.id, section.id)}
                            className="text-xs text-red-500 hover:text-red-700 px-2 py-1 shrink-0"
                          >
                            Eliminar
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Section form */}
      {editingSection && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-serif text-lg text-primary font-normal">
                {editingSection.id ? "Editar sección" : "Nueva sección"}
              </h3>
              <button
                onClick={() => setEditingSection(null)}
                className="text-text-muted hover:text-primary"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={saveSection} className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted mb-1.5">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={editingSection.name || ""}
                  onChange={(e) => {
                    const name = e.target.value;
                    setEditingSection((prev) => ({
                      ...prev,
                      name,
                      slug: slugify(name),
                    }));
                  }}
                  className="w-full px-3 py-2 text-sm border border-border bg-surface-alt focus:border-accent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted mb-1.5">
                  Slug *
                </label>
                <input
                  type="text"
                  value={editingSection.slug || ""}
                  onChange={(e) =>
                    setEditingSection((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-sm border border-border bg-surface-alt focus:border-accent outline-none font-mono text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted mb-1.5">
                  Descripción
                </label>
                <textarea
                  value={editingSection.description || ""}
                  onChange={(e) =>
                    setEditingSection((prev) => ({ ...prev, description: e.target.value }))
                  }
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-border bg-surface-alt focus:border-accent outline-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-text-body cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingSection.active ?? true}
                    onChange={(e) =>
                      setEditingSection((prev) => ({ ...prev, active: e.target.checked }))
                    }
                    className="w-4 h-4"
                  />
                  Activa
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="px-4 py-2 text-sm text-text-secondary border border-border hover:bg-surface-alt transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingSection}
                  className="px-4 py-2 bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {savingSection ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Entity form */}
      {editingEntity && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-serif text-lg text-primary font-normal">
                {editingEntity.id ? "Editar entidad" : "Nueva entidad"}
              </h3>
              <button
                onClick={() => setEditingEntity(null)}
                className="text-text-muted hover:text-primary"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={saveEntity} className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted mb-1.5">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={editingEntity.name || ""}
                  onChange={(e) =>
                    setEditingEntity((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-sm border border-border bg-surface-alt focus:border-accent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted mb-1.5">
                  Descripción (metatexto)
                </label>
                <input
                  type="text"
                  value={editingEntity.description || ""}
                  onChange={(e) =>
                    setEditingEntity((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Opcional: texto que aparece al hacer hover o debajo"
                  className="w-full px-3 py-2 text-sm border border-border bg-surface-alt focus:border-accent outline-none"
                />
              </div>
              <ImageUpload
                label="Logo"
                value={editingEntity.logo_url || ""}
                onChange={(url) =>
                  setEditingEntity((prev) => ({ ...prev, logo_url: url }))
                }
                aspect={3 / 1}
              />
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-text-body cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingEntity.active ?? true}
                    onChange={(e) =>
                      setEditingEntity((prev) => ({ ...prev, active: e.target.checked }))
                    }
                    className="w-4 h-4"
                  />
                  Activa
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingEntity(null)}
                  className="px-4 py-2 text-sm text-text-secondary border border-border hover:bg-surface-alt transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingEntity}
                  className="px-4 py-2 bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {savingEntity ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
