import { beforeEach, describe, expect, it, vi } from "vitest";
import { MIGRATIONS, ensureSchema, type SqlTag } from "@/lib/data/schema";

const sql = vi.fn<SqlTag>(async () => []);

async function runDataMigrations() {
  for (const migration of MIGRATIONS) await migration.up(sql);
}

function statements() {
  return (sql.mock.calls as unknown as [TemplateStringsArray, ...unknown[]][]).map(([parts, ...values]) => ({ text: parts.join("?").replace(/\s+/g, " ").trim(), values }));
}

describe("Ecosistema data migrations (SQL stub, no database)", () => {
  beforeEach(() => sql.mockClear());

  it.each([
    ["eco-empresas", "Empresas comprometidas con la construcción de culturas corporativas más auténticas, inclusivas y humanas. Organizaciones que entienden que el cambio real comienza dentro y que su impacto se proyecta mucho más allá del lugar de trabajo."],
    ["eco-entidades", "ONG y asociaciones con las que colaboramos y que aportan su conocimiento, experiencia y compromiso para promover el bienestar, la inclusión y la salud mental también en los lugares de trabajo."],
    ["eco-instituciones", "Entidades con las que generamos alianzas y espacios de colaboración entre el ámbito público, empresarial y social. Porque cuando avanzamos juntos, el impacto se multiplica."],
  ])("migrates known copy for %s without overwriting admin edits", async (id, description) => {
    await runDataMigrations();
    const insert = statements().find((q) => q.text.startsWith("INSERT INTO ecosistema_secciones") && q.values[0] === id);
    expect(insert?.values[3]).toBe(description);
    const updates = statements().filter((q) => q.text.startsWith("UPDATE ecosistema_secciones") && q.values[1] === id);
    expect(updates.length).toBeGreaterThanOrEqual(2);
    for (const q of updates) {
      expect(q.text).toBe("UPDATE ecosistema_secciones SET description = ? WHERE id = ? AND description = ?");
      expect(q.values[0]).toBe(description);
      const previous = q.values[2];
      expect(previous).not.toBe(description);
      expect(typeof previous).toBe("string");
      // Simulate the exact equality guard for repeated migration and admin edits.
      const apply = (current: unknown) => current === previous ? q.values[0] : current;
      expect(apply(previous)).toBe(description);
      expect(apply(apply(previous))).toBe(description);
      expect(apply("Texto editado por administración")).toBe("Texto editado por administración");
      expect(apply("")).toBe("");
    }
  });

  it.each([
    ["eco-entidades", "Organizaciones que promueven el bienestar, la inclusión y entornos de trabajo más humanos"],
    ["eco-instituciones", "Cuando lo público y lo privado dejan de ir en paralelo y empiezan a avanzar juntos, el impacto se multiplica"],
  ])("also migrates the exact published legacy copy for %s", async (id, previous) => {
    await runDataMigrations();
    expect(statements().some((q) => q.text.startsWith("UPDATE ecosistema_secciones") && q.values[1] === id && q.values[2] === previous)).toBe(true);
  });

  it("creates the manageable council section, without inventing members", async () => {
    await runDataMigrations();
    const inserts = statements().filter((q) => q.text.startsWith("INSERT INTO ecosistema_secciones"));
    expect(inserts.find((q) => q.values[0] === "eco-consejo-consultivo")?.values).toEqual([
      "eco-consejo-consultivo", "Consejo Consultivo de Impacto Social", "consejo-consultivo-impacto-social",
      "Representantes de instituciones públicas, universidades, empresas, asociaciones y entidades empresariales que aportan su conocimiento y experiencia para ayudarnos a definir nuestras prioridades y los movimientos corporativos con los que generar un impacto social positivo desde el ámbito empresarial.",
      5, true,
    ]);
    expect(inserts.every((q) => q.text.endsWith("ON CONFLICT DO NOTHING"))).toBe(true);
    expect(statements().some((q) => q.text.startsWith("INSERT INTO ecosistema_entidades"))).toBe(false);
  });

  it("renames only the legacy ranking intro label in the sections table", async () => {
    await runDataMigrations();
    expect(statements().filter((q) => q.text.startsWith("UPDATE sections"))).toEqual([
      { text: "UPDATE sections SET label = ? WHERE id = ? AND label = ?", values: ["Top 100", "rank-intro", "¿Qué es el Ranking?"] },
    ]);
  });

  it("keeps data changes out of the DDL that runs on every deploy", async () => {
    await ensureSchema(sql);
    expect(statements().length).toBeGreaterThan(0);
    expect(statements().every((q) => /^(CREATE TABLE IF NOT EXISTS|ALTER TABLE \w+ ADD COLUMN IF NOT EXISTS)/.test(q.text))).toBe(true);
  });
});
