"use client";

import { useState, useRef } from "react";
import { Cropper, CropperRef } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CropModalProps {
  imageSrc: string;
  aspect?: number;
  onConfirm: (area: CropArea) => void;
  onCancel: () => void;
}

export default function CropModal({
  imageSrc,
  aspect = 16 / 10,
  onConfirm,
  onCancel,
}: CropModalProps) {
  const cropperRef = useRef<CropperRef>(null);
  const [processing, setProcessing] = useState(false);

  const handleConfirm = () => {
    const coords = cropperRef.current?.getCoordinates();
    if (!coords) return;
    setProcessing(true);
    onConfirm({
      x: coords.left,
      y: coords.top,
      width: coords.width,
      height: coords.height,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg flex flex-col max-h-[90vh]">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-medium text-primary">Recortar imagen</h3>
          <button type="button" onClick={onCancel} className="text-text-muted hover:text-text-body text-lg leading-none">×</button>
        </div>
        <div className="relative w-full h-72 bg-black">
          <Cropper ref={cropperRef} src={imageSrc} stencilProps={{ aspectRatio: aspect }} className="!absolute inset-0" />
        </div>
        <div className="px-4 py-2 text-[10px] text-text-muted/70 text-center bg-surface-alt border-t border-border">
          Usa la rueda del ratón para zoom. Arrastra para mover la imagen.
        </div>
        <div className="px-4 py-3 flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-full text-xs text-text-secondary border border-border hover:bg-surface-alt transition-colors">Cancelar</button>
          <button type="button" onClick={handleConfirm} disabled={processing} className="px-4 py-2 text-xs bg-secondary text-white hover:bg-secondary-light transition-colors disabled:opacity-50">
            {processing ? "Recortando..." : "Aceptar"}
          </button>
        </div>
      </div>
    </div>
  );
}
