import AdminAlert from "./AdminAlert";

export default function FormActions({
  isEditing,
  saving,
  onCancel,
  error,
  onDismissError,
}: {
  isEditing: boolean;
  saving: boolean;
  onCancel: () => void;
  error?: string | null;
  onDismissError?: () => void;
}) {
  return (
    <>
      <AdminAlert message={error ?? null} onDismiss={onDismissError} />
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-secondary text-white rounded-full text-[12px] font-medium tracking-[0.06em] uppercase hover:bg-secondary-light transition-colors disabled:opacity-50"
        >
          {saving ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 rounded-full text-text-secondary text-[12px] font-medium tracking-[0.06em] uppercase border border-border hover:bg-surface-alt transition-colors"
        >
          Cancelar
        </button>
      </div>
    </>
  );
}
