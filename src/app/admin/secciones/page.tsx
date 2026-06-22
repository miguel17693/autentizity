"use client";

import { useEffect, useState } from "react";

interface SectionConfig {
  id: string;
  label: string;
  page: string;
  visible: boolean;
}

export default function AdminSecciones() {
  const [sections, setSections] = useState<SectionConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/sections")
      .then((r) => r.json())
      .then((data) => {
        setSections(data);
        setLoading(false);
      });
  }, []);

  async function toggle(id: string, visible: boolean) {
    setSaving(id);
    const res = await fetch("/api/sections", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, visible }),
    });
    if (res.ok) {
      setSections((prev) =>
        prev.map((s) => (s.id === id ? { ...s, visible } : s))
      );
    }
    setSaving(null);
  }

  // Group by page
  const grouped = sections.reduce<Record<string, SectionConfig[]>>((acc, s) => {
    if (!acc[s.page]) acc[s.page] = [];
    acc[s.page].push(s);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-surface-alt rounded w-48 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-surface-alt rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-primary font-light">
        Visibilidad de secciones
      </h1>
      <p className="mt-2 text-text-secondary text-sm font-light">
        Controla qué secciones son visibles en la web pública. Las secciones
        ocultas solo se ven con el modo Preview activado.
      </p>

      <div className="mt-8 space-y-8">
        {Object.entries(grouped).map(([page, items]) => (
          <div key={page}>
            <h2 className="font-serif text-lg text-primary font-normal mb-3">
              {page}
            </h2>
            <div className="bg-white border border-border rounded-2xl divide-y divide-border">
              {items.map((section) => (
                <div
                  key={section.id}
                  className="flex items-center justify-between px-5 py-3.5"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        section.visible ? "bg-accent" : "bg-text-muted"
                      }`}
                    />
                    <span className="text-sm text-text-body font-light">
                      {section.label}
                    </span>
                  </div>
                  <button
                    onClick={() => toggle(section.id, !section.visible)}
                    disabled={saving === section.id}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                      section.visible ? "bg-accent" : "bg-border"
                    } ${saving === section.id ? "opacity-50" : ""}`}
                    aria-label={
                      section.visible
                        ? `Ocultar ${section.label}`
                        : `Mostrar ${section.label}`
                    }
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                        section.visible ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
