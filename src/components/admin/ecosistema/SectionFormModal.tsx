"use client";

import type { EcosistemaSection } from "@/lib/types";
import { slugify } from "@/lib/utils";
import AdminAlert from "../AdminAlert";

export default function SectionFormModal({
  editing,
  saving,
  onSave,
  onCancel,
  onChange,
  error,
}: {
  editing: Partial<EcosistemaSection>;
  saving: boolean;
  onSave: (e: React.FormEvent) => void;
  onCancel: () => void;
  onChange: (updates: Partial<EcosistemaSection>) => void;
  error?: string | null;
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
                onChange(editing.id ? { name } : { name, slug: slugify(name) });
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
          <AdminAlert message={error ?? null} />
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
