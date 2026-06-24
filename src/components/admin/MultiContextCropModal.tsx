"use client";

import { useState, useRef, useCallback, useEffect } from "react";
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
}

type CropCoords = { x: number; y: number; zoom: number };

type CropStates = Record<ContextKey, CropState>;

const defaultCrop = (): CropState => ({ x: 0, y: 0, zoom: 1 });

function makeCrop(initial?: Partial<CropCoords>): CropState {
  if (initial && (initial.x !== 0 || initial.y !== 0 || (initial.zoom && initial.zoom !== 1))) {
    return { x: initial.x ?? 0, y: initial.y ?? 0, zoom: initial.zoom ?? 1 };
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
  const [missingTabs, setMissingTabs] = useState<ContextKey[]>([]);

  // Live previews — updated instantly on crop complete
  const [previews, setPreviews] = useState<Partial<Record<ContextKey, string>>>({});
  const previewGenRef = useRef<Record<ContextKey, number>>({ hero: 0, heroDesktop: 0, card: 0 });

  // Synchronous area refs — avoids React state async race condition
  const areaRefs = useRef<Record<ContextKey, Area | null>>({
    hero: null,
    heroDesktop: null,
    card: null,
  });

  const updateCrop = useCallback(
    (key: ContextKey, patch: Partial<CropState>) => {
      setCrops((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
    },
    []
  );

  const generatePreview = useCallback(
    (key: ContextKey, area: Area) => {
      const id = ++previewGenRef.current[key];
      // Debounce: if another preview is queued for same key, skip
      if (id !== previewGenRef.current[key] + 1) return;

      import("@/lib/crop").then(({ getCroppedPreview }) => {
        // Only use if this is still the latest request
        if (id !== previewGenRef.current[key]) return;
        getCroppedPreview(imageSrc, area, originalFormat)
          .then((dataUrl) => {
            if (id !== previewGenRef.current[key]) return;
            setPreviews((prev) => ({ ...prev, [key]: dataUrl }));
          })
          .catch(() => {});
      });
    },
    [imageSrc, originalFormat]
  );

  const makeAreaHandler = useCallback(
    (key: ContextKey) =>
      (_: Area, area: Area) => {
        areaRefs.current[key] = area;
        generatePreview(key, area);
      },
    [generatePreview]
  );

  // Stable refs for cropper callbacks so react-easy-crop doesn't re-register
  const heroHandler = useRef(makeAreaHandler("hero")).current;
  const heroDesktopHandler = useRef(makeAreaHandler("heroDesktop")).current;
  const cardHandler = useRef(makeAreaHandler("card")).current;

  const onCropCompleteMap: Record<ContextKey, (_: Area, area: Area) => void> = {
    hero: heroHandler,
    heroDesktop: heroDesktopHandler,
    card: cardHandler,
  };

  const handleTabChange = (newTab: ContextKey) => {
    const current = crops[activeTab];
    const target = crops[newTab];
    if (target.x === 0 && target.y === 0 && (current.x !== 0 || current.y !== 0)) {
      updateCrop(newTab, { x: current.x, y: current.y });
    }
    setMissingTabs([]);
    setActiveTab(newTab);
  };

  const ctx = CONTEXTS.find((c) => c.key === activeTab)!;

  const handleConfirm = useCallback(async () => {
    const hero = areaRefs.current.hero;
    const heroDesktop = areaRefs.current.heroDesktop;
    const card = areaRefs.current.card;

    // Check which tabs are missing
    const missing: ContextKey[] = [];
    if (!hero) missing.push("hero");
    if (!heroDesktop) missing.push("heroDesktop");
    if (!card) missing.push("card");

    if (missing.length > 0) {
      setMissingTabs(missing);
      return;
    }

    console.log("[MultiContextCropModal] handleConfirm — areas:", {
      hero: { x: hero!.x, y: hero!.y, w: hero!.width, h: hero!.height },
      heroDesktop: { x: heroDesktop!.x, y: heroDesktop!.y, w: heroDesktop!.width, h: heroDesktop!.height },
      card: { x: card!.x, y: card!.y, w: card!.width, h: card!.height },
      imageSrc: imageSrc?.substring(0, 60) + "...",
    });

    setProcessing(true);
    try {
      const { getCroppedImg } = await import("@/lib/crop");
      const [heroFile, heroDesktopFile, cardFile] = await Promise.all([
        getCroppedImg(imageSrc, hero!, originalFormat),
        getCroppedImg(imageSrc, heroDesktop!, originalFormat),
        getCroppedImg(imageSrc, card!, originalFormat),
      ]);

      console.log("[MultiContextCropModal] files generated:", {
        hero: { size: heroFile.size, name: heroFile.name },
        heroDesktop: { size: heroDesktopFile.size, name: heroDesktopFile.name },
        card: { size: cardFile.size, name: cardFile.name },
      });

      onConfirm({
        files: { hero: heroFile, heroDesktop: heroDesktopFile, card: cardFile },
        coords: {
          hero: { x: crops.hero.x, y: crops.hero.y, zoom: crops.hero.zoom },
          heroDesktop: { x: crops.heroDesktop.x, y: crops.heroDesktop.y, zoom: crops.heroDesktop.zoom },
          card: { x: crops.card.x, y: crops.card.y, zoom: crops.card.zoom },
        },
      });
    } catch (err) {
      console.error("[MultiContextCropModal] crop error:", err);
      setProcessing(false);
    }
  }, [imageSrc, originalFormat, onConfirm, crops]);

  // Reset previews when image source changes
  useEffect(() => {
    setPreviews({});
    setMissingTabs([]);
    areaRefs.current = { hero: null, heroDesktop: null, card: null };
    previewGenRef.current = { hero: 0, heroDesktop: 0, card: 0 };
  }, [imageSrc]);

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
          {CONTEXTS.map((c) => {
            const hasPreview = previews[c.key] || existingUrls?.[c.key];
            const isMissing = missingTabs.includes(c.key);
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => handleTabChange(c.key)}
                className={`flex-1 py-2 text-xs font-medium transition-colors relative ${
                  activeTab === c.key
                    ? "text-accent border-b-2 border-accent"
                    : isMissing
                    ? "text-red-500"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                {c.label}
                <span className="block text-[9px] opacity-60">{aspectLabel(c.aspect)}</span>
                {hasPreview && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-accent" />
                )}
              </button>
            );
          })}
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

        {/* Live + existing previews */}
        <div className="px-4 py-2 border-t border-border bg-surface-alt">
          <p className="text-[10px] text-text-muted/70 mb-1.5">
            {existingUrls ? "Nuevo (arriba) / Anterior (abajo)" : "Vista previa en vivo"}
          </p>
          <div className="flex gap-3">
            {CONTEXTS.map((c) => {
              const live = previews[c.key];
              const saved = existingUrls?.[c.key];
              if (!live && !saved) return null;
              return (
                <div key={c.key} className="flex-1">
                  <p className="text-[9px] text-text-muted mb-0.5">{c.label}</p>
                  {live && (
                    <div
                      className="relative w-full bg-black/10 overflow-hidden border border-accent/30 mb-1"
                      style={{ aspectRatio: c.aspect }}
                    >
                      <img
                        src={live}
                        alt={`${c.label} live`}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {saved && (
                    <div
                      className="relative w-full bg-black/10 overflow-hidden border border-border"
                      style={{ aspectRatio: c.aspect }}
                    >
                      <img
                        src={saved}
                        alt={c.label}
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Missing tabs warning */}
        {missingTabs.length > 0 && (
          <div className="px-4 py-1.5 text-[10px] text-red-500 text-center bg-red-50 border-t border-red-200">
            Visita las pestañas en rojo para definir su encuadre antes de guardar
          </div>
        )}

        {/* Hint */}
        <div className="px-4 py-2 text-[10px] text-text-muted/70 text-center bg-surface-alt border-t border-border">
          Define el encuadre para cada contexto. El punto verde en la pestaña indica
          que ya tiene previsualización.
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
