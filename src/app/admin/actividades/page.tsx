"use client";

import { useEffect, useState } from "react";
import type { Activity } from "@/lib/types";
import ImageUpload from "@/components/admin/ImageUpload";

const emptyActividad: Partial<Activity> = {
  title: "",
  description: "",
  content: "",
  coverImage: "",
  tags: [],
  status: "draft",
  featured: false,
};

export default function AdminActividadesPage() {
  const [actividades, setActividades] = useState<Activity[]>([]);
  const [editing, setEditing] = useState<Partial<Activity> | null>(null);
  const [tagsInput, setTagsInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadActividades(); }, []);

  async function loadActividades() {
    const res = await fetch("/api/actividades");
    setActividades(await res.json());
  }

  function startCreate() {
    setEditing({ ...emptyActividad });
    setTagsInput("");
  }

  function startEdit(a: Activity) {
    setEditing({ ...a });
    setTagsInput(a.tags.join(", "));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    const payload = { ...editing, tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean) };
    try {
      if (editing.id) {
        const res = await fetch(`/api/actividades/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error("Error al actualizar");
      } else {
        const res = await fetch("/api/actividades", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error("Error al crear");
      }
      setEditing(null);
      loadActividades();
    } catch (err) {
      alert("Error al guardar: " + (err instanceof Error ? err.message : "desconocido"));
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta actividad?")) return;
    await fetch(`/api/actividades/${id}`, { method: "DELETE" });
    loadActividades();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl text-primary font-light">Actividades</h1>
          <p className="text-text-secondary text-sm font-light mt-1">{actividades.length} actividades</p>
        </div>
        <button onClick={startCreate} className="px-5 py-2.5 bg-primary text-white rounded-full text-[12px] font-medium tracking-[0.06em] uppercase hover:bg-primary-light transition-colors">
          + Nueva actividad
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSave} className="bg-white border border-border rounded-2xl p-6 mb-8 space-y-4">
          <h2 className="font-serif text-xl text-primary font-light mb-4">{editing.id ? "Editar actividad" : "Nueva actividad"}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted mb-1.5">Título *</label>
              <input required value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full px-3 py-2.5 rounded-xl text-sm border border-border bg-surface-alt focus:border-accent outline-none" />
            </div>
            <ImageUpload value={editing.coverImage ?? ""} onChange={(url) => setEditing({ ...editing, coverImage: url })} />
          </div>

          <div>
            <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted mb-1.5">Descripción</label>
            <textarea rows={2} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="w-full px-3 py-2.5 rounded-xl text-sm border border-border bg-surface-alt focus:border-accent outline-none resize-none" />
          </div>

          <div>
            <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted mb-1.5">Contenido detallado</label>
            <textarea rows={5} value={editing.content ?? ""} onChange={(e) => setEditing({ ...editing, content: e.target.value })} className="w-full px-3 py-2.5 rounded-xl text-sm border border-border bg-surface-alt focus:border-accent outline-none resize-y font-mono text-xs" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted mb-1.5">Tags (separadas por coma)</label>
              <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm border border-border bg-surface-alt focus:border-accent outline-none" placeholder="Formación, Impacto Social" />
            </div>
            <div>
              <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted mb-1.5">Estado</label>
              <select value={editing.status ?? "draft"} onChange={(e) => setEditing({ ...editing, status: e.target.value as Activity["status"] })} className="w-full px-3 py-2.5 rounded-xl text-sm border border-border bg-surface-alt focus:border-accent outline-none">
                <option value="draft">Borrador</option>
                <option value="published">Publicada</option>
              </select>
            </div>
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 pb-2.5 cursor-pointer">
              <input type="checkbox" checked={editing.featured ?? false} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} className="accent-accent w-4 h-4" />
              <span className="text-sm text-text-body">Destacada</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="px-6 py-2.5 bg-gold text-white rounded-full text-[12px] font-medium tracking-[0.06em] uppercase hover:bg-gold-light transition-colors disabled:opacity-50">
              {saving ? "Guardando..." : editing.id ? "Actualizar" : "Crear"}
            </button>
            <button type="button" onClick={() => setEditing(null)} className="px-6 py-2.5 rounded-full text-text-secondary text-[12px] font-medium tracking-[0.06em] uppercase border border-border hover:bg-surface-alt transition-colors rounded-full">
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {actividades.map((a) => (
          <div key={a.id} className="bg-white border border-border rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-border-light transition-colors">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-normal text-primary truncate">{a.title}</h3>
                <span className={`shrink-0 text-[10px] font-medium tracking-[0.08em] uppercase px-2 py-0.5 rounded-full ${a.status === "published" ? "bg-accent/10 text-gold" : "bg-surface-alt text-text-muted"}`}>
                  {a.status === "published" ? "Publicada" : "Borrador"}
                </span>
                {a.featured && <span className="shrink-0 text-[10px] font-medium tracking-[0.08em] uppercase px-2 py-0.5 bg-gold/10 text-secondary rounded-full">Destacada</span>}
              </div>
              <p className="text-xs text-text-muted mt-0.5 truncate">{a.description}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => startEdit(a)} className="px-3 py-1.5 rounded-full text-[11px] text-text-secondary rounded-full border border-border hover:border-accent hover:text-accent transition-colors">Editar</button>
              <button onClick={() => handleDelete(a.id)} className="px-3 py-1.5 rounded-full text-[11px] text-red-400 border border-border hover:border-red-300 hover:text-red-600 transition-colors rounded-full">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
