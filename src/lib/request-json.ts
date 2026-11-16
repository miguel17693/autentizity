export class RequestError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = "RequestError";
  }
}

export function describeRequestError(status: number, data: unknown): string {
  if (status === 401) return "Tu sesión ha caducado. Vuelve a iniciar sesión.";
  if (status === 404) return "No se ha encontrado el elemento. Puede que ya se haya eliminado; recarga la página.";
  const serverMessage = (data as { error?: unknown } | null)?.error;
  if (typeof serverMessage === "string" && serverMessage) return serverMessage;
  return `Error inesperado del servidor (${status}).`;
}

export function errorMessage(err: unknown): string {
  return err instanceof RequestError ? err.message : "No se pudo conectar con el servidor.";
}

/** fetch wrapper for the admin JSON API: throws a RequestError with a Spanish message on non-2xx responses. */
export async function requestJson<T = unknown>(
  url: string,
  { method = "GET", body }: { method?: string; body?: unknown } = {}
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) throw new RequestError(describeRequestError(res.status, data), res.status);
  return data as T;
}
