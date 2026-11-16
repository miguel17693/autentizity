import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  deleteEcosistemaEntity,
  deleteNoticia,
  setActividadMovimientos,
  setMovimientoEmbajadores,
} from "@/lib/data/store";

interface Query {
  text: string;
  values: unknown[];
}

const { sql, queries, state } = vi.hoisted(() => {
  const queries: Query[] = [];
  const state = { rows: [] as unknown[] };
  const sql = Object.assign(
    (strings: TemplateStringsArray, ...values: unknown[]) => {
      const query = { text: strings.join("?"), values };
      queries.push(query);
      return Object.assign(Promise.resolve().then(() => state.rows), query);
    },
    { transaction: vi.fn(async (batch: unknown[]) => batch.map(() => [])) }
  );
  return { sql, queries, state };
});
vi.mock("@/lib/data/db", () => ({ getSQL: () => sql }));

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

beforeEach(() => {
  vi.stubEnv("DATABASE_URL", "postgres://test");
  queries.length = 0;
  state.rows = [];
  sql.transaction.mockClear();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("store deletes", () => {
  it("reports false when no row was deleted", async () => {
    state.rows = [];
    await expect(deleteNoticia("missing")).resolves.toBe(false);
    expect(queries[0].text).toContain("RETURNING id");
  });

  it("reports true when a row was deleted", async () => {
    state.rows = [{ id: "eco_1" }];
    await expect(deleteEcosistemaEntity("eco_1")).resolves.toBe(true);
  });
});

describe("store M:N relation saves", () => {
  it("replaces movimiento embajadores atomically with unique prefixed ids", async () => {
    await setMovimientoEmbajadores("mov-1", ["ent-a", "ent-b", "ent-a"]);

    expect(sql.transaction).toHaveBeenCalledTimes(1);
    const [batch] = sql.transaction.mock.calls[0] as unknown as [Query[]];
    expect(batch).toHaveLength(3);
    expect(batch[0].text).toContain("DELETE FROM movimiento_embajadores WHERE movimiento_id");
    expect(batch[0].values).toEqual(["mov-1"]);

    const inserts = batch.slice(1);
    expect(inserts.map((q) => q.values.slice(1))).toEqual([
      ["mov-1", "ent-a"],
      ["mov-1", "ent-b"],
    ]);
    const ids = inserts.map((q) => q.values[0] as string);
    for (const id of ids) {
      expect(id.startsWith("me_")).toBe(true);
      expect(id.slice(3)).toMatch(UUID);
    }
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("clears actividad movimientos inside the transaction when the list is empty", async () => {
    await setActividadMovimientos("act-1", []);

    const [batch] = sql.transaction.mock.calls[0] as unknown as [Query[]];
    expect(batch).toHaveLength(1);
    expect(batch[0].text).toContain("DELETE FROM movimiento_actividades WHERE actividad_id");
  });
});
