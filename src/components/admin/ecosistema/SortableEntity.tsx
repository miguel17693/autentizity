"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { EcosistemaEntity } from "@/lib/types";

export default function SortableEntity({
  entity,
  sectionId,
  onEdit,
  onDelete,
}: {
  entity: EcosistemaEntity;
  sectionId: string;
  onEdit: (e: EcosistemaEntity) => void;
  onDelete: (id: string, sectionId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `ent-${entity.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 border border-border/50 px-3 py-2 hover:bg-surface-alt/50 transition-colors"
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="text-text-muted hover:text-primary cursor-grab active:cursor-grabbing touch-none shrink-0"
      >
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 6h2v2H8V6zm6 0h2v2h-2V6zM8 11h2v2H8v-2zm6 0h2v2h-2v-2zm-6 5h2v2H8v-2zm6 0h2v2h-2v-2z" />
        </svg>
      </button>

      {entity.logo_url ? (
        <img src={entity.logo_url} alt={entity.name} className="w-12 h-7 object-contain border border-border" />
      ) : (
        <div className="w-12 h-7 bg-surface-alt border border-border flex items-center justify-center">
          <span className="text-[9px] text-text-muted">SIN LOGO</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-body">{entity.name}</p>
        {entity.description && (
          <p className="text-xs text-text-muted truncate">{entity.description}</p>
        )}
      </div>
      {!entity.active && (
        <span className="text-[10px] px-2 py-0.5 bg-text-muted/10 text-text-muted">Inactiva</span>
      )}
      <button onClick={() => onEdit(entity)} className="text-xs text-text-muted hover:text-primary px-2 py-1 shrink-0">
        Editar
      </button>
      <button onClick={() => onDelete(entity.id, sectionId)} className="text-xs text-red-500 hover:text-red-700 px-2 py-1 shrink-0">
        Eliminar
      </button>
    </div>
  );
}
