"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import CropModal, { type CropArea } from "./CropModal";
import MultiContextCropModal, { type CropResult } from "./MultiContextCropModal";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

interface ImageUploadProps {
  value: string;
  originalValue?: string;
  heroValue?: string;
  cardValue?: string;
  onChange: (url: string, originalUrl?: string) => void;
  onChangeMulti?: (urls: {
    coverImage: string;
    coverImageOriginal: string;
    coverImageHero: string;
    coverImageCard: string;
    coverImageHeroDesktop: string;
  }) => void;
  label?: string;
  aspect?: number;
  multiContext?: boolean;
}

export default function ImageUpload({
  value, originalValue = "", heroValue = "", cardValue = "",
  onChange, onChangeMulti, label = "Imagen de portada",
  aspect = 16 / 10, multiContext = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const originalUrlRef = useRef<string>("");

  useEffect(() => { if (originalValue) { originalUrlRef.current = originalValue; } }, [originalValue]);

  const uploadFile = useCallback(async (file: File): Promise<string> => {
    setUploading(true); setError("");
    try {
      const formData = new FormData(); formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Error al subir"); }
      const { url } = await res.json();
      setUploading(false); return url;
    } catch (err) { setError(err instanceof Error ? err.message : "Error al subir la imagen"); setUploading(false); return ""; }
  }, []);

  const readAndCrop = useCallback(async (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) { setError("Solo se permiten imágenes PNG, JPG o WebP"); return; }
    if (file.size > 5 * 1024 * 1024) { setError("La imagen no puede superar 5MB"); return; }
    setError("");
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const originalUrl = await uploadFile(file);
      if (originalUrl) { originalUrlRef.current = originalUrl; }
      setCropSrc(dataUrl);
    };
    reader.readAsDataURL(file);
  }, [uploadFile]);

  const callCropApi = useCallback(async (imageUrl: string, crops: Record<string, CropArea>): Promise<Record<string, string>> => {
    const res = await fetch("/api/crop", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ imageUrl, crops }) });
    if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Error al recortar"); }
    const { urls } = await res.json();
    return urls;
  }, []);

  const handleSingleCropConfirm = useCallback(async (area: CropArea) => {
    setCropSrc(null); setError("");
    const imageUrl = originalUrlRef.current;
    if (!imageUrl) { setError("Error: no se encontró la imagen original"); return; }
    try {
      const urls = await callCropApi(imageUrl, { default: area });
      onChange(urls.default, imageUrl);
    } catch (err) { setError(err instanceof Error ? err.message : "Error al recortar"); }
  }, [callCropApi, onChange]);

  const handleMultiCropConfirm = useCallback(async (result: CropResult) => {
    setCropSrc(null); setError("");
    const { areas } = result;
    const imageUrl = originalUrlRef.current;
    if (!imageUrl) { setError("Error: no se encontró la imagen original"); return; }
    try {
      const urls = await callCropApi(imageUrl, areas);
      const heroUrl = urls.hero, heroDesktopUrl = urls.heroDesktop, cardUrl = urls.card;
      if (!heroUrl || !heroDesktopUrl || !cardUrl) { setError("Error al procesar uno de los recortes. Inténtalo de nuevo."); return; }
      const payload = { coverImage: heroUrl, coverImageOriginal: imageUrl, coverImageHero: heroUrl, coverImageCard: cardUrl, coverImageHeroDesktop: heroDesktopUrl };
      if (onChangeMulti) { onChangeMulti(payload); onChange(heroUrl, imageUrl); }
    } catch (err) { setError(err instanceof Error ? err.message : "Error al recortar"); }
  }, [callCropApi, onChange, onChangeMulti]);

  const handleCropCancel = useCallback(() => { setCropSrc(null); if (fileInputRef.current) fileInputRef.current.value = ""; }, []);
  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragOver(false); const file = e.dataTransfer.files[0]; if (file) readAndCrop(file); }, [readAndCrop]);
  const handleRemove = () => { onChange("", ""); originalUrlRef.current = ""; setShowUrlInput(false); setPreviewSrc(null); };
  const handleRecrop = () => { const src = originalUrlRef.current || value; if (src) { setCropSrc(src); } };
  const handlePreview = () => { setPreviewSrc(value); };

  return (
    <>
      <div>
        <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted mb-1.5">{label}</label>
        {value ? (
          <div className="relative group">
            <img src={value} alt="Preview" className="w-full max-h-48 object-cover border border-border" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 bg-white text-text-body text-xs border border-border hover:bg-surface-alt transition-colors">Cambiar</button>
              <button type="button" onClick={handleRecrop} className="px-3 py-1.5 bg-white text-text-body text-xs border border-border hover:bg-surface-alt transition-colors">Recortar</button>
              <button type="button" onClick={handlePreview} className="px-3 py-1.5 bg-white text-text-body text-xs border border-border hover:bg-surface-alt transition-colors">Vista previa</button>
              <button type="button" onClick={handleRemove} className="px-3 py-1.5 bg-red-500 text-white text-xs hover:bg-red-600 transition-colors">Quitar</button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden"
              onChange={(e) => { const file = e.target.files?.[0]; if (file) readAndCrop(file); }} />
          </div>
        ) : (
          <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${dragOver ? "border-accent bg-accent/5" : "border-border hover:border-accent/50 hover:bg-surface-alt"} ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
            <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden"
              onChange={(e) => { const file = e.target.files?.[0]; if (file) readAndCrop(file); }} />
            {uploading ? (
              <div className="text-sm text-text-muted"><div className="animate-pulse mb-1">Subiendo...</div></div>
            ) : (
              <>
                <svg className="w-8 h-8 mx-auto mb-2 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <p className="text-sm text-text-muted font-light">Arrastra una imagen aquí o haz clic para seleccionar</p>
                <p className="text-xs text-text-muted/60 mt-1">PNG, JPG o WebP · Máx. 5MB</p>
                <p className="text-xs text-text-muted/50 mt-0.5">Resolución recomendada: 1920×1200 (16:10)</p>
              </>
            )}
          </div>
        )}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        <div className="mt-2">
          <button type="button" onClick={() => setShowUrlInput(!showUrlInput)} className="text-[11px] text-text-muted hover:text-text-secondary underline underline-offset-2">
            {showUrlInput ? "Ocultar" : "O pegar URL manualmente"}
          </button>
          {showUrlInput && (
            <input type="url" value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://..." className="w-full mt-1 px-3 py-2 rounded-full text-sm border border-border bg-surface-alt focus:border-accent outline-none" />
          )}
        </div>
      </div>
      {cropSrc && multiContext && (
        <MultiContextCropModal imageSrc={cropSrc} existingUrls={{ hero: heroValue || value, heroDesktop: heroValue || value, card: cardValue || value }}
          onConfirm={handleMultiCropConfirm} onCancel={handleCropCancel} />
      )}
      {cropSrc && !multiContext && (
        <CropModal imageSrc={cropSrc} aspect={aspect} onConfirm={handleSingleCropConfirm} onCancel={handleCropCancel} />
      )}
      {previewSrc && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setPreviewSrc(null)}>
          <div className="relative max-w-2xl w-full max-h-[80vh] bg-white p-2">
            <button type="button" onClick={() => setPreviewSrc(null)} className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-text-muted hover:text-text-body z-10">×</button>
            <img src={previewSrc} alt="Vista previa" className="w-full max-h-[75vh] object-contain" />
          </div>
        </div>
      )}
    </>
  );
}
