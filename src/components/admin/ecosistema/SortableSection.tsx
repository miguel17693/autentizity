"use client";

import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { EcosistemaEntity, EcosistemaSection } from "@/lib/types";
import SortableEntity from "./SortableEntity";
import { getSectionLabels } from "./labels";

export default function SortableSection({
  section,
  onEdit,
  onDelete,
  onAddEntity,
  entities,
  onEditEntity,
  onDeleteEntity,
}: {
  section: EcosistemaSection;
  onEdit: (s: EcosistemaSection) => void;
  onDelete: (id: string) => void;
  onAddEntity: (sectionId: string) => void;
  entities: EcosistemaEntity[];
  onEditEntity: (e: EcosistemaEntity) => void;
  onDeleteEntity: (id: string, sectionId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const entityIds = entities.map((e) => `ent-${e.id}`);

  return (
    <div ref={setNodeRef} style={style} className="bg-white border border-border rounded-2xl">
      {/* Section header */}
      <div className="flex items-center justify-between px-5 py-3.5 rounded-full bg-surface-alt border-b border-border">
        <div className="flex items-center gap-3">
          {/* Drag handle */}
          <button
            {...attributes}
            {...listeners}
            className="text-text-muted hover:text-primary cursor-grab active:cursor-grabbing touch-none"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 6h2v2H8V6zm6 0h2v2h-2V6zM8 11h2v2H8v-2zm6 0h2v2h-2v-2zm-6 5h2v2H8v-2zm6 0h2v2h-2v-2z" />
            </svg>
          </button>
          <span className={`w-2 h-2 rounded-full ${section.active ? "bg-accent" : "bg-text-muted"}`} />
          <span className="text-sm text-primary font-medium">{section.name}</span>
          <span className="text-[11px] text-text-muted font-mono">{section.slug}</span>
          {!section.active && (
            <span className="text-[10px] px-2 py-0.5 bg-text-muted/10 text-text-muted uppercase">Inactiva</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onEdit(section)} className="text-xs text-text-muted hover:text-primary transition-colors px-2 py-1">
            Editar
          </button>
          <button onClick={() => onDelete(section.id)} className="text-xs text-red-500 hover:text-red-700 transition-colors px-2 py-1">
            Eliminar
          </button>
        </div>
      </div>

      {/* Entities */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-medium tracking-[0.1em] text-text-muted">
            {getSectionLabels(section).plural}
            {entities.length > 0 && (
              <span className="ml-2 text-text-muted/50">({entities.length})</span>
            )}
          </h3>
          <button
            onClick={() => onAddEntity(section.id)}
            className="px-3 py-1.5 bg-primary text-white rounded-full text-[11px] font-medium hover:bg-primary/90 transition-colors flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Añadir {getSectionLabels(section).singular}
          </button>
        </div>

        {entities.length === 0 ? (
          <div className="text-sm text-text-muted py-3">No hay {getSectionLabels(section).plural.toLowerCase()} en esta sección.</div>
        ) : (
          <SortableContext items={entityIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-1.5">
              {entities.map((entity) => (
                <SortableEntity
                  key={`ent-${entity.id}`}
                  entity={entity}
                  sectionId={section.id}
                  onEdit={onEditEntity}
                  onDelete={onDeleteEntity}
                />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  );
}
