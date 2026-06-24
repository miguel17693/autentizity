"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useCallback, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export type FilterVariant = "eventos" | "movimientos" | "actividades";

export interface FilterBarProps {
  variant: FilterVariant;
  availableTags: string[];
}

const DATE_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "proximos", label: "Próximos" },
  { value: "pasados", label: "Pasados" },
  { value: "este-mes", label: "Este mes" },
] as const;

const TYPE_OPTIONS = [
  { value: "", label: "Todas" },
  { value: "presencial", label: "Presencial" },
  { value: "virtual", label: "Virtual" },
  { value: "hibrido", label: "Híbrido" },
] as const;

export default function FilterBar({ variant, availableTags }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentQ = searchParams.get("q") || "";
  const currentTags = searchParams.get("tags")?.split(",").filter(Boolean) || [];
  const currentFecha = searchParams.get("fecha") || "";
  const currentTipo = searchParams.get("tipo") || "";
  const currentDesde = searchParams.get("desde") || "";
  const currentHasta = searchParams.get("hasta") || "";

  const [searchInput, setSearchInput] = useState(currentQ);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setSearchInput(currentQ);
  }, [currentQ]);

  const buildParams = useCallback(() => {
    return new URLSearchParams(searchParams.toString());
  }, [searchParams]);

  const navigate = useCallback(
    (newParams: URLSearchParams) => {
      const qs = newParams.toString();
      router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router, pathname]
  );

  const handleSearch = useCallback(
    (value: string) => {
      setSearchInput(value);
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(() => {
        const params = buildParams();
        if (value) {
          params.set("q", value);
        } else {
          params.delete("q");
        }
        navigate(params);
      }, 300);
    },
    [buildParams, navigate]
  );

  const handleTagToggle = useCallback(
    (tag: string) => {
      const params = buildParams();
      const tags = currentTags.includes(tag)
        ? currentTags.filter((t) => t !== tag)
        : [...currentTags, tag];
      if (tags.length > 0) {
        params.set("tags", tags.join(","));
      } else {
        params.delete("tags");
      }
      navigate(params);
    },
    [buildParams, currentTags, navigate]
  );

  const handleFechaChange = useCallback(
    (value: string) => {
      const params = buildParams();
      if (value) {
        params.set("fecha", value);
      } else {
        params.delete("fecha");
      }
      navigate(params);
    },
    [buildParams, navigate]
  );

  const handleTipoChange = useCallback(
    (value: string) => {
      const params = buildParams();
      if (value) {
        params.set("tipo", value);
      } else {
        params.delete("tipo");
      }
      navigate(params);
    },
    [buildParams, navigate]
  );

  const handleDateFrom = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const params = buildParams();
      if (e.target.value) {
        params.set("desde", e.target.value);
      } else {
        params.delete("desde");
      }
      navigate(params);
    },
    [buildParams, navigate]
  );

  const handleDateTo = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const params = buildParams();
      if (e.target.value) {
        params.set("hasta", e.target.value);
      } else {
        params.delete("hasta");
      }
      navigate(params);
    },
    [buildParams, navigate]
  );

  const handleClearAll = useCallback(() => {
    setSearchInput("");
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  const hasFilters =
    currentQ || currentTags.length > 0 || currentFecha || currentTipo || currentDesde || currentHasta;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder={
              variant === "eventos"
                ? "Buscar eventos..."
                : variant === "movimientos"
                ? "Buscar movimientos..."
                : "Buscar actividades..."
            }
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-border-light rounded-xl text-sm font-light text-text-body placeholder:text-text-muted focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/10 transition-all"
          />
        </div>
        {hasFilters && (
          <button
            onClick={handleClearAll}
            className="text-text-muted text-sm font-medium hover:text-secondary transition-colors shrink-0 flex items-center gap-1"
          >
            Limpiar filtros
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {variant === "eventos" && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium tracking-[0.08em] uppercase text-text-muted mr-1">
              Fecha:
            </span>
            {DATE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleFechaChange(opt.value)}
                className={cn(
                  "text-xs font-medium tracking-[0.04em] px-3 py-1.5 rounded-full border transition-colors",
                  currentFecha === opt.value
                    ? "bg-primary text-white border-primary"
                    : "text-text-body border-border hover:border-primary/30 hover:text-primary"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span className="text-xs font-medium tracking-[0.08em] uppercase text-text-muted">
              Rango:
            </span>
            <label className="flex items-center gap-2 text-sm text-text-body font-light">
              Desde
              <input
                type="date"
                value={currentDesde}
                onChange={handleDateFrom}
                className="border border-border-light rounded-xl px-3 py-1.5 text-sm font-light text-text-body focus:outline-none focus:border-primary/30"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-text-body font-light">
              Hasta
              <input
                type="date"
                value={currentHasta}
                onChange={handleDateTo}
                className="border border-border-light rounded-xl px-3 py-1.5 text-sm font-light text-text-body focus:outline-none focus:border-primary/30"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium tracking-[0.08em] uppercase text-text-muted mr-2">
              Tipo:
            </span>
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleTipoChange(opt.value)}
                className={cn(
                  "text-xs font-medium tracking-[0.04em] px-3 py-1.5 rounded-full border transition-colors",
                  currentTipo === opt.value
                    ? "bg-primary text-white border-primary"
                    : "text-text-body border-border hover:border-primary/30 hover:text-primary"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}

      {availableTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium tracking-[0.08em] uppercase text-text-muted mr-1">
            Tags:
          </span>
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={cn(
                "text-[10px] font-medium tracking-[0.08em] uppercase px-2.5 py-1 rounded-full border transition-colors",
                currentTags.includes(tag)
                  ? "bg-secondary/10 text-secondary border-secondary/30"
                  : "text-text-muted border-border hover:border-primary/30 hover:text-primary"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
