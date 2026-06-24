"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";

type ContextKey = "hero" | "card";

const CONTEXTS: { key: ContextKey; label: string; aspect: number }[] = [
  { key: "hero", label: "Hero", aspect: 16 / 10 },
  { key: "card", label: "Tarjeta", aspect: 2.5 },
];

interface CropState {
  x: number;
  y: number;
  zoom: number;
  area: Area | null;
}

type CropStates = Record<ContextKey, CropState>;

const defaultCrop = (): CropState => ({ x: 0, y: 0, zoom: 1, area: null });

interface MultiContextCropModalProps {
  imageSrc: string;
  originalFormat: string;
  onConfirm: (files: { hero: File; card: File }) => void;
  onCancel: () => void;
}

export default function MultiContextCropModal({
  imageSrc,
  originalFormat,
  onConfirm,
  onCancel,
}: MultiContextCropModalProps) {
  const [activeTab, setActiveTab] = useState<ContextKey | "preview">("hero");
  const [crops, setCrops] = useState<CropStates>({
    hero: defaultCrop(),
    card: defaultCrop(),
  });
  const [processing, setProcessing] = useState(false);

  const updateCrop = useCallback(
    (key: ContextKey, patch: Partial<CropState>) => {
      setCrops((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
    },
    []
  );

  const onCropComplete = useCallback(
    (key: ContextKey) =>
      (_: Area, area: Area) => {
        updateCrop(key, { area });
      },
    [updateCrop]
  );

  const activeContext = activeTab === "preview" ? null : CONTEXTS.find((c) => c.key === activeTab);

  const handleConfirm = async () => {
    const heroArea = crops.hero.area;
    const cardArea = crops.card.area;
    if (!heroArea || !cardArea) return;

    setProcessing(true);
    try {
      const { getCroppedImg } = await import("@/lib/crop");
      const [heroFile, cardFile] = await Promise.all([
        getCroppedImg(imageSrc, heroArea, originalFormat),
        getCroppedImg(imageSrc, cardArea, originalFormat),
      ]);
      onConfirm({ hero: heroFile, card: cardFile });
    } catch {
      setProcessing(false);
    }
  };

  const ctx = activeContext;

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
              onClick={() => setActiveTab(c.key)}
              className={`flex-1 py-2 text-xs font-medium transition-colors ${
                activeTab === c.key
                  ? "text-accent border-b-2 border-accent"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {c.label} ({c.aspect === 16 / 10 ? "16:10" : "2.5:1"})
            </button>
          ))}
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`flex-1 py-2 text-xs font-medium transition-colors ${
              activeTab === "preview"
                ? "text-accent border-b-2 border-accent"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            Vista previa
          </button>
        </div>

        {/* Cropper / Preview */}
        <div className="relative w-full h-64 bg-black">
          {ctx ? (
            <Cropper
              image={imageSrc}
              crop={{ x: crops[ctx.key].x, y: crops[ctx.key].y }}
              zoom={crops[ctx.key].zoom}
              aspect={ctx.aspect}
              onCropChange={(loc) => updateCrop(ctx.key, loc)}
              onZoomChange={(z) => updateCrop(ctx.key, { zoom: z })}
              onCropComplete={onCropComplete(ctx.key)}
            />
          ) : (
            <div className="relative w-full h-full">
              <img
                src={imageSrc}
                alt="Vista previa"
                className="w-full h-full object-contain opacity-40"
              />
              {/* Hero overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="border-2 border-dashed border-accent"
                  style={{
                    width: `${(16 / 10 / 2.5) * 100}%`,
                    aspectRatio: "16/10",
                  }}
                />
              </div>
              {/* Card overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="border-2 border-dashed border-secondary"
                  style={{
                    width: "88%",
                    aspectRatio: "2.5/1",
                  }}
                />
              </div>
              {/* Labels */}
              <div className="absolute bottom-2 left-4 flex gap-4 text-[10px] uppercase tracking-[0.1em]">
                <span className="text-accent">Hero 16:10</span>
                <span className="text-secondary">Tarjeta 2.5:1</span>
              </div>
            </div>
          )}
        </div>

        {/* Zoom control (only for crop tabs) */}
        {ctx && (
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
        )}

        {/* Hint */}
        <div className="px-4 py-2 text-[10px] text-text-muted/70 text-center bg-surface-alt border-t border-border">
          Recorta para cada contexto. La vista previa muestra cómo se verán
          ambas áreas superpuestas.
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
