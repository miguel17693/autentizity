"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";

type ContextKey = "hero" | "heroDesktop" | "card";

const CONTEXTS: { key: ContextKey; label: string; aspect: number }[] = [
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

interface CropState {
  x: number;
  y: number;
  zoom: number;
  area: Area | null;
}

type CropCoords = { x: number; y: number; zoom: number };

type CropStates = Record<ContextKey, CropState>;

const defaultCrop = (): CropState => ({ x: 0, y: 0, zoom: 1, area: null });

function makeCrop(initial?: Partial<CropCoords>): CropState {
  if (initial && (initial.x !== 0 || initial.y !== 0 || (initial.zoom && initial.zoom !== 1))) {
    return { x: initial.x ?? 0, y: initial.y ?? 0, zoom: initial.zoom ?? 1, area: null };
  }
  return defaultCrop();
}

export interface CropFiles {
  hero: File;
  heroDesktop: File;
  card: File;
}

export interface CropResult {
  files: CropFiles;
  coords: Record<ContextKey, CropCoords>;
}

interface MultiContextCropModalProps {
  imageSrc: string;
  originalFormat: string;
  existingUrls?: Partial<Record<ContextKey, string>>;
  initialCrops?: Partial<Record<ContextKey, CropCoords>>;
  onConfirm: (result: CropResult) => void;
  onCancel: () => void;
}

export default function MultiContextCropModal({
  imageSrc,
  originalFormat,
  existingUrls,
  initialCrops,
  onConfirm,
  onCancel,
}: MultiContextCropModalProps) {
  const [activeTab, setActiveTab] = useState<ContextKey>("hero");
  const [crops, setCrops] = useState<CropStates>({
    hero: makeCrop(initialCrops?.hero),
    heroDesktop: makeCrop(initialCrops?.heroDesktop),
    card: makeCrop(initialCrops?.card),
  });
  const [processing, setProcessing] = useState(false);

  const updateCrop = useCallback(
    (key: ContextKey, patch: Partial<CropState>) => {
      setCrops((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
    },
    []
  );

  const onHeroComplete = useCallback(
    (_: Area, area: Area) => updateCrop("hero", { area }),
    [updateCrop]
  );
  const onHeroDesktopComplete = useCallback(
    (_: Area, area: Area) => updateCrop("heroDesktop", { area }),
    [updateCrop]
  );
  const onCardComplete = useCallback(
    (_: Area, area: Area) => updateCrop("card", { area }),
    [updateCrop]
  );

  const onCropCompleteMap: Record<ContextKey, (_: Area, area: Area) => void> = {
    hero: onHeroComplete,
    heroDesktop: onHeroDesktopComplete,
    card: onCardComplete,
  };

  const handleTabChange = (newTab: ContextKey) => {
    const current = crops[activeTab];
    const target = crops[newTab];
    // Inherit position from current tab if target hasn't been moved yet
    if (target.x === 0 && target.y === 0 && (current.x !== 0 || current.y !== 0)) {
      updateCrop(newTab, { x: current.x, y: current.y });
    }
    setActiveTab(newTab);
  };

  const ctx = CONTEXTS.find((c) => c.key === activeTab)!;

  const handleConfirm = async () => {
    const hero = crops.hero.area;
    const heroDesktop = crops.heroDesktop.area;
    const card = crops.card.area;
    if (!hero || !heroDesktop || !card) return;

    setProcessing(true);
    try {
      const { getCroppedImg } = await import("@/lib/crop");
      const [heroFile, heroDesktopFile, cardFile] = await Promise.all([
        getCroppedImg(imageSrc, hero, originalFormat),
        getCroppedImg(imageSrc, heroDesktop, originalFormat),
        getCroppedImg(imageSrc, card, originalFormat),
      ]);
      onConfirm({
        files: { hero: heroFile, heroDesktop: heroDesktopFile, card: cardFile },
        coords: {
          hero: { x: crops.hero.x, y: crops.hero.y, zoom: crops.hero.zoom },
          heroDesktop: { x: crops.heroDesktop.x, y: crops.heroDesktop.y, zoom: crops.heroDesktop.zoom },
          card: { x: crops.card.x, y: crops.card.y, zoom: crops.card.zoom },
        },
      });
    } catch {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-medium text-primary">Recortar imagen por contexto</h3>
          <button
            type="button"
            onClick={onCancel}
            className="text-text-muted hover:text-text-body text-lg leading-none"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {CONTEXTS.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => handleTabChange(c.key)}
              className={`flex-1 py-2 text-xs font-medium transition-colors ${
                activeTab === c.key
                  ? "text-accent border-b-2 border-accent"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {c.label}
              <span className="block text-[9px] opacity-60">{aspectLabel(c.aspect)}</span>
            </button>
          ))}
        </div>

        {/* Cropper */}
        <div className="relative w-full h-64 bg-black">
          <Cropper
            image={imageSrc}
            crop={{ x: crops[ctx.key].x, y: crops[ctx.key].y }}
            zoom={crops[ctx.key].zoom}
            aspect={ctx.aspect}
            onCropChange={(loc) => updateCrop(ctx.key, loc)}
            onZoomChange={(z) => updateCrop(ctx.key, { zoom: z })}
            onCropComplete={onCropCompleteMap[ctx.key]}
          />
        </div>

        {/* Zoom control */}
        <div className="px-4 py-3 border-t border-border flex items-center gap-3">
          <span className="text-xs text-text-muted shrink-0">Zoom</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={crops[ctx.key].zoom}
            onChange={(e) => updateCrop(ctx.key, { zoom: Number(e.target.value) })}
            className="w-full accent-accent"
          />
        </div>

        {/* Existing crop previews (shown when re-cropping) */}
        {existingUrls && (
          <div className="px-4 py-2 border-t border-border bg-surface-alt">
            <p className="text-[10px] text-text-muted/70 mb-1.5">Recortes actuales:</p>
            <div className="flex gap-3">
              {CONTEXTS.map((c) => {
                const url = existingUrls[c.key];
                if (!url) return null;
                return (
                  <div key={c.key} className="flex-1">
                    <p className="text-[9px] text-text-muted mb-0.5">{c.label}</p>
                    <div
                      className="relative w-full bg-black/10 overflow-hidden border border-border"
                      style={{ aspectRatio: c.aspect }}
                    >
                      <img
                        src={url}
                        alt={c.label}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Hint */}
        <div className="px-4 py-2 text-[10px] text-text-muted/70 text-center bg-surface-alt border-t border-border">
          Define el encuadre para cada contexto. Al cambiar de pestaña se hereda la
          posición de la anterior si aún no la has movido.
        </div>

        {/* Actions */}
        <div className="px-4 py-3 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-full text-xs text-text-secondary border border-border hover:bg-surface-alt transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={processing}
            className="px-4 py-2 text-xs bg-secondary text-white hover:bg-secondary-light transition-colors disabled:opacity-50"
          >
            {processing ? "Procesando..." : "Aceptar"}
          </button>
        </div>
      </div>
    </div>
  );
}
