"use client";

import { useState, useRef, useCallback } from "react";
import { Cropper, CropperRef, CropperPreview, CropperPreviewRef } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import type { CropArea } from "./CropModal";

type ContextKey = "hero" | "heroDesktop" | "card";

interface ContextDef { key: ContextKey; label: string; aspect: number; }

const CONTEXTS: ContextDef[] = [
  { key: "hero", label: "Hero móvil", aspect: 16 / 10 },
  { key: "heroDesktop", label: "Hero escritorio", aspect: 3.5 },
  { key: "card", label: "Tarjeta", aspect: 2.5 },
];

function aspectLabel(aspect: number): string {
  if (aspect === 16 / 10) return "16:10";
  if (aspect === 3.5) return "3.5:1";
  if (aspect === 2.5) return "2.5:1";
  return `${aspect}:1`;
}

export interface CropResult { areas: Record<ContextKey, CropArea>; }

interface MultiContextCropModalProps {
  imageSrc: string;
  existingUrls?: Partial<Record<ContextKey, string>>;
  onConfirm: (result: CropResult) => void;
  onCancel: () => void;
}

export default function MultiContextCropModal({ imageSrc, existingUrls, onConfirm, onCancel }: MultiContextCropModalProps) {
  const [activeTab, setActiveTab] = useState<ContextKey>("hero");
  const [processing, setProcessing] = useState(false);
  const [missingTabs, setMissingTabs] = useState<ContextKey[]>([]);
  const cropperRefs = useRef<Record<ContextKey, CropperRef | null>>({ hero: null, heroDesktop: null, card: null });
  const previewRefs = useRef<Record<ContextKey, CropperPreviewRef | null>>({ hero: null, heroDesktop: null, card: null });

  const handleTabChange = (tab: ContextKey) => { setMissingTabs([]); setActiveTab(tab); };

  const handleConfirm = useCallback(() => {
    const areas: Record<string, CropArea> = {};
    const missing: ContextKey[] = [];
    for (const { key } of CONTEXTS) {
      const coords = cropperRefs.current[key]?.getCoordinates();
      if (!coords || Math.round(coords.width) === 0 || Math.round(coords.height) === 0) { missing.push(key); continue; }
      areas[key] = { x: coords.left, y: coords.top, width: coords.width, height: coords.height };
    }
    if (missing.length > 0) { setMissingTabs(missing); return; }
    setProcessing(true);
    onConfirm({ areas: areas as Record<ContextKey, CropArea> });
  }, [onConfirm]);

  const onUpdateFactory = useCallback((key: ContextKey) => (cropper: CropperRef) => { previewRefs.current[key]?.update(cropper); }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg flex flex-col max-h-[90vh]">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-medium text-primary">Recortar imagen por contexto</h3>
          <button type="button" onClick={onCancel} className="text-text-muted hover:text-text-body text-lg leading-none">×</button>
        </div>
        <div className="flex border-b border-border">
          {CONTEXTS.map((c) => {
            const isMissing = missingTabs.includes(c.key);
            return (
              <button key={c.key} type="button" onClick={() => handleTabChange(c.key)}
                className={`flex-1 py-2 text-xs font-medium transition-colors ${activeTab === c.key ? "text-accent border-b-2 border-accent" : isMissing ? "text-red-500" : "text-text-muted hover:text-text-secondary"}`}>
                {c.label}<span className="block text-[9px] opacity-60">{aspectLabel(c.aspect)}</span>
              </button>
            );
          })}
        </div>
        <div className="relative w-full h-64 bg-black">
          {CONTEXTS.map((c) => (
            <Cropper key={c.key} ref={(el) => { cropperRefs.current[c.key] = el; }} src={imageSrc}
              stencilProps={{ aspectRatio: c.aspect }} onUpdate={onUpdateFactory(c.key)}
              className={`!absolute inset-0 transition-opacity ${activeTab === c.key ? "opacity-100 pointer-events-auto z-10" : "opacity-0 pointer-events-none"}`} />
          ))}
        </div>
        <div className="px-4 py-1.5 text-[10px] text-text-muted/70 text-center bg-surface-alt border-t border-border">
          Rueda del ratón para zoom. Arrastra para mover la imagen.
        </div>
        <div className="px-4 py-2 border-t border-border bg-surface-alt">
          <p className="text-[10px] text-text-muted/70 mb-1.5">Vista previa en vivo</p>
          <div className="flex gap-3">
            {CONTEXTS.map((c) => (
              <div key={c.key} className="flex-1">
                <p className="text-[9px] text-text-muted mb-0.5">{c.label}</p>
                <div className="relative w-full bg-black/10 overflow-hidden border border-border" style={{ aspectRatio: c.aspect }}>
                  <CropperPreview ref={(el) => { previewRefs.current[c.key] = el; }} className="!absolute inset-0" />
                </div>
                {existingUrls?.[c.key] && (
                  <div className="relative w-full bg-black/10 overflow-hidden border border-border mt-1" style={{ aspectRatio: c.aspect }}>
                    <img src={existingUrls[c.key]} alt={`${c.label} actual`} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {missingTabs.length > 0 && (
          <div className="px-4 py-1.5 text-[10px] text-red-500 text-center bg-red-50 border-t border-red-200">
            Visita las pestañas en rojo para definir su encuadre antes de guardar
          </div>
        )}
        <div className="px-4 py-2 text-[10px] text-text-muted/70 text-center bg-surface-alt border-t border-border">
          Define el encuadre para cada contexto antes de guardar.
        </div>
        <div className="px-4 py-3 flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-full text-xs text-text-secondary border border-border hover:bg-surface-alt transition-colors">Cancelar</button>
          <button type="button" onClick={handleConfirm} disabled={processing} className="px-4 py-2 text-xs bg-secondary text-white hover:bg-secondary-light transition-colors disabled:opacity-50">
            {processing ? "Procesando..." : "Aceptar"}
          </button>
        </div>
      </div>
    </div>
  );
}
