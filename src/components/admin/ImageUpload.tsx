"use client";

import { useState, useRef, useCallback } from "react";

interface ImageUploadProps {
  value: string; // current URL
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label = "Imagen de portada",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      setUploading(true);
      setError("");

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Error al subir");
        }

        const { url } = await res.json();

        // If there's an old image, it will be cleaned up when the form saves
        onChange(url);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al subir la imagen"
        );
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        setError("Solo se permiten imágenes");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("La imagen no puede superar 5MB");
        return;
      }
      uploadFile(file);
    },
    [uploadFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFile(e.dataTransfer.files[0]);
    },
    [handleFile]
  );

  const handleRemove = () => {
    onChange("");
    setShowUrlInput(false);
  };

  return (
    <div>
      <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted mb-1.5">
        {label}
      </label>

      {value ? (
        /* Has image → show preview */
        <div className="relative group">
          <img
            src={value}
            alt="Preview"
            className="w-full max-h-48 object-cover border border-border"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-text-body text-xs border border-border hover:bg-surface-alt transition-colors"
            >
              Cambiar
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 bg-red-500 text-white text-xs hover:bg-red-600 transition-colors"
            >
              Quitar
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      ) : (
        /* No image → show upload zone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
            dragOver
              ? "border-accent bg-accent/5"
              : "border-border hover:border-accent/50 hover:bg-surface-alt"
          } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />

          {uploading ? (
            <div className="text-sm text-text-muted">
              <div className="animate-pulse mb-1">Subiendo...</div>
            </div>
          ) : (
            <>
              <svg
                className="w-8 h-8 mx-auto mb-2 text-text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              <p className="text-sm text-text-muted font-light">
                Arrastra una imagen aquí o haz clic para seleccionar
              </p>
              <p className="text-xs text-text-muted/60 mt-1">
                PNG, JPG o WebP · Máx. 5MB
              </p>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}

      {/* Fallback: paste URL manually */}
      <div className="mt-2">
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-text-muted hover:text-text-secondary underline underline-offset-2"
        >
          {showUrlInput ? "Ocultar" : "O pegar URL manualmente"}
        </button>
        {showUrlInput && (
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://..."
            className="w-full mt-1 px-3 py-2 text-sm border border-border bg-surface-alt focus:border-accent outline-none"
          />
        )}
      </div>
    </div>
  );
}
