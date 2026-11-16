"use client";

import { useCallback, useEffect, useState } from "react";
import { errorMessage, requestJson } from "@/lib/request-json";

export function useList<T>(url: string) {
  const [items, setItems] = useState<T[]>([]);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setItems(await requestJson<T[]>(url));
      setError(null);
    } catch (err) {
      setError(`No se pudo cargar el listado: ${errorMessage(err)}`);
    }
  }, [url]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { items, reload, error, clearError: () => setError(null) };
}

type Payload = { id?: string; [field: string]: unknown };

export function saveItem(endpoint: string, payload: Payload) {
  return requestJson(payload.id ? `${endpoint}/${payload.id}` : endpoint, {
    method: payload.id ? "PUT" : "POST",
    body: payload,
  });
}

export function deleteItem(endpoint: string, id: string) {
  return requestJson(`${endpoint}/${id}`, { method: "DELETE" });
}

/**
 * List + create/update/delete against a REST collection (`endpoint` and `endpoint/:id`).
 * `save` and `remove` resolve to false and expose a Spanish `error` when the request fails,
 * so callers can keep the form open.
 */
export function useCrud<T extends { id: string }>(endpoint: string) {
  const { items, reload, error: loadError, clearError: clearLoadError } = useList<T>(endpoint);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  async function save(payload: Payload): Promise<boolean> {
    setSaving(true);
    setActionError(null);
    try {
      await saveItem(endpoint, payload);
      void reload();
      return true;
    } catch (err) {
      setActionError(`No se pudo guardar: ${errorMessage(err)}`);
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string): Promise<boolean> {
    setActionError(null);
    try {
      await deleteItem(endpoint, id);
      void reload();
      return true;
    } catch (err) {
      setActionError(`No se pudo eliminar: ${errorMessage(err)}`);
      return false;
    }
  }

  return {
    items,
    reload,
    save,
    remove,
    saving,
    error: actionError ?? loadError,
    clearError: () => {
      setActionError(null);
      clearLoadError();
    },
  };
}
