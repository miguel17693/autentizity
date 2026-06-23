"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";

interface CropModalProps {
  imageSrc: string;
  aspect?: number;
  onConfirm: (croppedFile: File) => void;
  onCancel: () => void;
}

export default function CropModal({
  imageSrc,
  aspect = 16 / 10,
  onConfirm,
  onCancel,
}: CropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [cropping, setCropping] = useState(false);

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setCropping(true);
    try {
      const { getCroppedImg } = await import("@/lib/crop");
      const file = await getCroppedImg(imageSrc, croppedAreaPixels);
      onConfirm(file);
    } catch {
      setCropping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-4 py-3 rounded-full border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-medium text-primary">Recortar imagen</h3>
          <button
            type="button"
            onClick={onCancel}
            className="text-text-muted hover:text-text-body text-lg leading-none"
          >
            ×
          </button>
        </div>

        {/* Cropper */}
        <div className="relative w-full h-72 bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Zoom control */}
        <div className="px-4 py-3 rounded-full border-b border-border flex items-center gap-3">
          <span className="text-xs text-text-muted shrink-0">Zoom</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-accent"
          />
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
            disabled={cropping}
            className="px-4 py-2 text-xs bg-secondary text-white hover:bg-secondary-light transition-colors disabled:opacity-50"
          >
            {cropping ? "Recortando..." : "Aceptar"}
          </button>
        </div>
      </div>
    </div>
  );
}
