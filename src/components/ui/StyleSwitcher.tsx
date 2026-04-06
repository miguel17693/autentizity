"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/lib/ThemeContext";
import type { ThemeDefinition } from "@/lib/themes";

/* ============================================
 * StyleSwitcher — Floating Bubble
 * ============================================
 * Burbuja flotante en la esquina inferior-izquierda
 * que despliega un panel para cambiar entre
 * los 3 estilos propuestos al cliente.
 * ============================================ */

export default function StyleSwitcher() {
  const { theme, themeId, setTheme, allThemes } = useTheme();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  /* Close on click outside */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={panelRef} className="fixed bottom-5 left-5 z-[9999]">
      {/* Expanded panel */}
      <div
        className={`absolute bottom-16 left-0 w-[280px] sm:w-[320px] transition-all duration-300 origin-bottom-left ${
          open
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-2 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl shadow-black/20 border border-black/5 overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-primary to-primary-light">
            <p className="text-white text-[13px] font-semibold tracking-wide uppercase">
              🎨 Probar estilos
            </p>
            <p className="text-white/60 text-[11px] font-light mt-0.5">
              Pulsa para cambiar el look de la web
            </p>
          </div>

          {/* Theme options */}
          <div className="p-3 flex flex-col gap-2">
            {allThemes.map((t: ThemeDefinition) => {
              const isActive = t.id === themeId;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setOpen(false);
                  }}
                  className={`group relative flex items-start gap-3 w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-primary/5 ring-2 ring-primary/20"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {/* Emoji */}
                  <span className="text-xl leading-none mt-0.5">{t.emoji}</span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {t.name}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-bold tracking-wider uppercase text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                          Activo
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 font-light mt-0.5 leading-snug">
                      {t.description}
                    </p>

                    {/* Color preview dots */}
                    <div className="flex gap-1.5 mt-2">
                      {[
                        t.vars["--color-primary"],
                        t.vars["--color-secondary"],
                        t.vars["--color-accent"],
                        t.vars["--color-surface"],
                        t.vars["--color-surface-warm"],
                      ].map((color, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full border border-black/10"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Check */}
                  {isActive && (
                    <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
            <p className="text-[10px] text-gray-400 font-light text-center">
              Menú temporal de prueba de estilos — solo visible durante el desarrollo
            </p>
          </div>
        </div>
      </div>

      {/* Floating bubble button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`group relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 ${
          open
            ? "bg-primary text-white shadow-primary/30 rotate-0"
            : "bg-white text-primary shadow-black/15 hover:shadow-black/25"
        }`}
        aria-label="Cambiar estilo visual"
      >
        {/* Pulsing ring when closed */}
        {!open && (
          <span className="absolute inset-0 rounded-full animate-ping bg-primary/10" />
        )}

        {open ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
