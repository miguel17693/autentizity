"use client";

import { useEffect, useState } from "react";
import type { Event, Movement } from "@/lib/types";
import ImageUpload from "@/components/admin/ImageUpload";

const emptyEvento: Partial<Event> = {
  title: "",
  description: "",
  content: "",
  coverImage: "",
  startDate: "",
  endDate: "",
  location: "",
  type: "presencial",
  tags: [],
  organizer: "AutentiZity",
  registrationUrl: "",
  featured: false,
  status: "draft",
  movimientoId: "",
};

export default function AdminEventosPage() {
  const [eventos, setEventos] = useState<Event[]>([]);
  const [movimientos, setMovimientos] = useState<Movement[]>([]);
  const [editing, setEditing] = useState<Partial<Event> | null>(null);
  const [tagsInput, setTagsInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadEventos();
    loadMovimientos();
  }, []);

  async function loadEventos() {
    const res = await fetch("/api/eventos");
    setEventos(await res.json());
  }

  async function loadMovimientos() {
    const res = await fetch("/api/movimientos");
    setMovimientos(await res.json());
  }

  function startCreate() {
    setEditing({ ...emptyEvento });
    setTagsInput("");
  }

  function startEdit(ev: Event) {
    setEditing({
      ...ev,
      startDate: ev.startDate?.slice(0, 16),
      endDate: ev.endDate?.slice(0, 16),
    });
    setTagsInput(ev.tags.join(", "));
  }

  function handleStartDateChange(value: string) {
    const updates: Partial<Event> = { startDate: value };
    if (value && !editing?.id) {
      const start = new Date(value);
      const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
      const pad = (n: number) => String(n).padStart(2, "0");
      updates.endDate = `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}T${pad(end.getHours())}:${pad(end.getMinutes())}`;
    }
    setEditing({ ...editing, ...updates });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);

    const payload = {
      ...editing,
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
    };

    if (editing.id) {
      await fetch(`/api/eventos/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/eventos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setEditing(null);
    setSaving(false);
    loadEventos();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este evento?")) return;
    await fetch(`/api/eventos/${id}`, { method: "DELETE" });
    loadEventos();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl text-primary font-light">Eventos</h1>
          <p className="text-text-secondary text-sm font-light mt-1">
            {eventos.length} eventos
          </p>
        </div>
        <button
          onClick={startCreate}
          className="px-5 py-2.5 bg-primary text-white rounded-full text-[12px] font-medium tracking-[0.06em] uppercase hover:bg-primary-light transition-colors"
        >
          + Nuevo evento
        </button>
      </div>

      {/* Edit / Create form */}
      {editing && (
        <form
          onSubmit={handleSave}
          className="bg-white border border-border rounded-2xl p-6 mb-8 space-y-4"
        >
          <h2 className="font-serif text-xl text-primary font-light mb-4">
            {editing.id ? "Editar evento" : "Nuevo evento"}
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
              onChange={(url) => setEditing({ ...editing, coverImage: url })}
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted mb-1.5">
              Descripción
            </label>
            <textarea
              rows={2}
              value={editing.description ?? ""}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              className="w-full px-3 py-2.5 rounded-full text-sm border border-border bg-surface-alt focus:border-accent outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted mb-1.5">
              Movimiento
            </label>
            <select
              value={editing.movimientoId ?? ""}
              onChange={(e) => setEditing({ ...editing, movimientoId: e.target.value })}
              className="w-full px-3 py-2.5 rounded-full text-sm border border-border bg-surface-alt focus:border-accent outline-none"
            >
              <option value="">Sin movimiento</option>
              {movimientos.map((mov) => (
                <option key={mov.id} value={mov.id}>
                  {mov.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted mb-1.5">
                Fecha inicio *
              </label>
              <input
                required
                type="datetime-local"
                value={editing.startDate ?? ""}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-full text-sm border border-border bg-surface-alt focus:border-accent outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted mb-1.5">
                Fecha fin
              </label>
              <input
                type="datetime-local"
                value={editing.endDate ?? ""}
                onChange={(e) => setEditing({ ...editing, endDate: e.target.value })}
                className="w-full px-3 py-2.5 rounded-full text-sm border border-border bg-surface-alt focus:border-accent outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted mb-1.5">
                Ubicación
              </label>
              <input
                value={editing.location ?? ""}
                onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                className="w-full px-3 py-2.5 rounded-full text-sm border border-border bg-surface-alt focus:border-accent outline-none"
                placeholder="Madrid / Online"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted mb-1.5">
                Tipo
              </label>
              <select
                value={editing.type ?? "presencial"}
                onChange={(e) => setEditing({ ...editing, type: e.target.value as Event["type"] })}
                className="w-full px-3 py-2.5 rounded-full text-sm border border-border bg-surface-alt focus:border-accent outline-none"
              >
                <option value="presencial">Presencial</option>
                <option value="virtual">Virtual</option>
                <option value="híbrido">Híbrido</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted mb-1.5">
                URL de registro
              </label>
              <input
                value={editing.registrationUrl ?? ""}
                onChange={(e) => setEditing({ ...editing, registrationUrl: e.target.value })}
                className="w-full px-3 py-2.5 rounded-full text-sm border border-border bg-surface-alt focus:border-accent outline-none"
                placeholder="https://eventbrite.es/..."
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted mb-1.5">
                Tags (separadas por coma)
              </label>
              <input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-3 py-2.5 rounded-full text-sm border border-border bg-surface-alt focus:border-accent outline-none"
                placeholder="Networking, Impacto Social"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted mb-1.5">
                Estado
              </label>
              <select
                value={editing.status ?? "draft"}
                onChange={(e) => setEditing({ ...editing, status: e.target.value as Event["status"] })}
                className="w-full px-3 py-2.5 rounded-full text-sm border border-border bg-surface-alt focus:border-accent outline-none"
              >
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
                <option value="cancelled">Cancelado</option>
              </select>
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
          </div>

          <div>
            <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted mb-1.5">
              Contenido detallado
            </label>
            <textarea
              rows={5}
              value={editing.content ?? ""}
              onChange={(e) => setEditing({ ...editing, content: e.target.value })}
              className="w-full px-3 py-2.5 rounded-full text-sm border border-border bg-surface-alt focus:border-accent outline-none resize-y font-mono text-xs"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-secondary text-white rounded-full text-[12px] font-medium tracking-[0.06em] uppercase hover:bg-secondary-light transition-colors disabled:opacity-50"
            >
              {saving ? "Guardando..." : editing.id ? "Actualizar" : "Crear"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="px-6 py-2.5 rounded-full text-text-secondary text-[12px] font-medium tracking-[0.06em] uppercase border border-border hover:bg-surface-alt transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="space-y-2">
        {eventos.map((ev) => (
          <div
            key={ev.id}
            className="bg-white border border-border rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-border-light transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-normal text-primary truncate">
                  {ev.title}
                </h3>
                <span className="shrink-0 text-[10px] font-medium tracking-[0.08em] uppercase px-2 py-0.5 bg-surface-warm text-text-secondary">
                  {ev.type}
                </span>
                <span
                  className={`shrink-0 text-[10px] font-medium tracking-[0.08em] uppercase px-2 py-0.5 ${
                    ev.status === "published"
                      ? "bg-accent/10 text-secondary"
                      : ev.status === "cancelled"
                        ? "bg-red-50 text-red-500"
                        : "bg-surface-alt text-text-muted"
                  }`}
                >
                  {ev.status === "published" ? "Publicado" : ev.status === "cancelled" ? "Cancelado" : "Borrador"}
                </span>
                {ev.featured && (
                  <span className="shrink-0 text-[10px] font-medium tracking-[0.08em] uppercase px-2 py-0.5 bg-secondary/10 text-secondary">
                    Destacado
                  </span>
                )}
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                {ev.location} · {new Date(ev.startDate).toLocaleDateString("es-ES")}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => startEdit(ev)}
                className="px-3 py-1.5 rounded-full text-[11px] text-text-secondary rounded-full border border-border hover:border-accent hover:text-accent transition-colors"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(ev.id)}
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
