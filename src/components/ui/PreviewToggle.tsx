"use client";

import { useState, useEffect } from "react";

/**
 * Floating preview toggle — only visible when the user is logged in as admin.
 * When active, hidden sections will be shown with a visual indicator.
 * The state is shared via a CSS class on <html> that other components can read.
 */
export default function PreviewToggle() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [previewOn, setPreviewOn] = useState(false);

  useEffect(() => {
    // Check if admin session cookie exists
    const hasSession = document.cookie
      .split(";")
      .some((c) => c.trim().startsWith("admin_session="));
    setIsAdmin(hasSession);

    // Restore previous state
    if (hasSession) {
      const stored = localStorage.getItem("autentizity-preview");
      if (stored === "on") {
        setPreviewOn(true);
        document.documentElement.classList.add("preview-mode");
      }
    }
  }, []);

  if (!isAdmin) return null;

  const toggle = () => {
    const next = !previewOn;
    setPreviewOn(next);
    if (next) {
      document.documentElement.classList.add("preview-mode");
      localStorage.setItem("autentizity-preview", "on");
    } else {
      document.documentElement.classList.remove("preview-mode");
      localStorage.setItem("autentizity-preview", "off");
    }
  };

  return (
    <div className="fixed bottom-5 left-5 z-[9999] flex items-center gap-2 bg-primary text-white px-4 py-2.5 shadow-xl shadow-black/20 rounded-full text-xs font-medium tracking-wide">
      <span className="uppercase tracking-[0.1em]">Preview</span>
      <button
        onClick={toggle}
        className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
          previewOn ? "bg-accent" : "bg-white/20"
        }`}
        aria-label={previewOn ? "Desactivar preview" : "Activar preview"}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
            previewOn ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
      {previewOn && (
        <span className="text-accent text-[10px] uppercase tracking-wider">ON</span>
      )}
    </div>
  );
}
