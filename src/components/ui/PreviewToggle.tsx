"use client";

import { useEffect, useState } from "react";

const ADMIN_HINT_COOKIE = "admin_ui";

/**
 * Floating preview toggle for admins. Preview relies on Next.js draft mode,
 * enabled through /api/preview, which validates the admin session server-side.
 */
export default function PreviewToggle({ enabled }: { enabled: boolean }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(
      document.cookie.split(";").some((c) => c.trim().startsWith(`${ADMIN_HINT_COOKIE}=`))
    );
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("preview-mode", enabled);
  }, [enabled]);

  if (!isAdmin && !enabled) return null;

  const toggle = () => {
    const target = `${window.location.pathname}${window.location.search}`;
    const params = new URLSearchParams({ enable: enabled ? "0" : "1", redirect: target });
    window.location.href = `/api/preview?${params.toString()}`;
  };

  return (
    <div className="fixed bottom-5 left-5 z-[9999] flex items-center gap-2 bg-primary text-white px-4 py-2.5 shadow-xl shadow-black/20 rounded-full text-xs font-medium tracking-wide">
      <span className="uppercase tracking-[0.1em]">Preview</span>
      <button
        onClick={toggle}
        className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
          enabled ? "bg-accent" : "bg-white/20"
        }`}
        aria-label={enabled ? "Desactivar preview" : "Activar preview"}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
      {enabled && (
        <span className="text-accent text-[10px] uppercase tracking-wider">ON</span>
      )}
    </div>
  );
}
