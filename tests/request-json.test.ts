import { afterEach, describe, expect, it, vi } from "vitest";
import { errorMessage, RequestError, requestJson } from "@/lib/request-json";
import { deleteItem, saveItem } from "@/hooks/useCrud";

function mockFetch(status: number, body: unknown) {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(body === undefined ? "" : JSON.stringify(body), { status })
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

async function failureOf(promise: Promise<unknown>): Promise<RequestError> {
  try {
    await promise;
  } catch (err) {
    return err as RequestError;
  }
  throw new Error("expected the request to fail");
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("requestJson", () => {
  it("sends JSON bodies and returns the parsed response", async () => {
    const fetchMock = mockFetch(200, { id: "1" });

    await expect(requestJson("/api/noticias", { method: "POST", body: { title: "Hola" } })).resolves.toEqual({ id: "1" });
    expect(fetchMock).toHaveBeenCalledWith("/api/noticias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Hola" }),
    });
  });

  it("surfaces the server error message on failure instead of resolving", async () => {
    mockFetch(409, { error: "Ya existe otro contenido con la misma URL (slug)." });

    const err = await failureOf(requestJson("/api/noticias", { method: "POST", body: {} }));
    expect(err).toBeInstanceOf(RequestError);
    expect(err.status).toBe(409);
    expect(errorMessage(err)).toBe("Ya existe otro contenido con la misma URL (slug).");
  });

  it("uses Spanish messages for expired sessions, missing items and empty error bodies", async () => {
    mockFetch(401, { error: "Unauthorized" });
    expect((await failureOf(requestJson("/api/x"))).message).toMatch(/sesión ha caducado/);

    mockFetch(404, { error: "Not found" });
    expect((await failureOf(requestJson("/api/x/1", { method: "DELETE" }))).message).toMatch(/No se ha encontrado/);

    mockFetch(500, undefined);
    expect((await failureOf(requestJson("/api/x"))).message).toBe("Error inesperado del servidor (500).");
  });

  it("reports network failures as a connection problem", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));

    const err = await failureOf(requestJson("/api/x"));
    expect(errorMessage(err)).toBe("No se pudo conectar con el servidor.");
  });
});

describe("admin CRUD requests", () => {
  it("creates with POST on the collection and updates with PUT on the item", async () => {
    const fetchMock = mockFetch(200, {});

    await saveItem("/api/eventos", { title: "Nuevo" });
    await saveItem("/api/eventos", { id: "ev1", title: "Editado" });
    await deleteItem("/api/eventos", "ev1");

    expect(fetchMock.mock.calls.map(([url, init]) => [url, init.method])).toEqual([
      ["/api/eventos", "POST"],
      ["/api/eventos/ev1", "PUT"],
      ["/api/eventos/ev1", "DELETE"],
    ]);
  });

  it("rejects when the server refuses the change so the form can stay open", async () => {
    mockFetch(400, { error: "El campo \"title\" es obligatorio." });

    await expect(saveItem("/api/eventos", { title: "" })).rejects.toThrow('El campo "title" es obligatorio.');
  });
});
