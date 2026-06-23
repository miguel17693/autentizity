"use client";

import { useState } from "react";

interface Item {
  id: string;
  label: string;
}

interface MultiSelectCheckboxProps {
  label: string;
  items: Item[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export default function MultiSelectCheckbox({
  label,
  items,
  selectedIds,
  onChange,
}: MultiSelectCheckboxProps) {
  const [open, setOpen] = useState(false);

  function toggle(id: string) {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id];
    onChange(next);
  }

  const count = selectedIds.length;
  const selectedLabels = items
    .filter((i) => selectedIds.includes(i.id))
    .map((i) => i.label)
    .join(", ");

  return (
    <div className="relative">
      <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-text-muted mb-1.5">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-3 py-2.5 rounded-xl text-sm border border-border bg-surface-alt focus:border-accent outline-none text-left flex items-center justify-between gap-2"
      >
        <span className={count ? "text-text-body" : "text-text-muted"}>
          {count ? selectedLabels : "Seleccionar..."}
        </span>
        <span className="shrink-0 text-text-muted text-xs">
          {count > 0 && (
            <span className="mr-1.5 bg-accent/10 text-secondary rounded-full px-1.5 py-0.5 text-[10px]">
              {count}
            </span>
          )}
          <svg
            className={`w-3.5 h-3.5 inline transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </span>
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-border rounded-xl shadow-lg max-h-48 overflow-y-auto py-1">
          {items.length === 0 ? (
            <div className="px-3 py-2 text-xs text-text-muted">No hay opciones disponibles</div>
          ) : (
            items.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-2 px-3 py-2 hover:bg-surface-alt cursor-pointer text-sm text-text-body"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={() => toggle(item.id)}
                  className="accent-accent w-4 h-4 shrink-0"
                />
                <span className="truncate">{item.label}</span>
              </label>
            ))
          )}
        </div>
      )}
    </div>
  );
}
