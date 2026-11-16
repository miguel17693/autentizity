import { Client, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { MIGRATIONS, ensureSchema, type Migration, type SqlTag } from "./schema";

type Env = Record<string, string | undefined>;

export interface MigrationSession {
  sql: SqlTag;
  close: () => Promise<void>;
}

export interface RunMigrationsOptions {
  env?: Env;
  connect?: (databaseUrl: string) => Promise<MigrationSession>;
  migrations?: Migration[];
  log?: (message: string) => void;
}

export type RunMigrationsResult = { status: "skipped" } | { status: "migrated"; applied: string[] };

/** Preview deployments may share the production database, so only production builds migrate. */
export function shouldRunMigrations(env: Env): boolean {
  return env.VERCEL_ENV === "production" || env.RUN_MIGRATIONS === "1";
}

/**
 * Opens a WebSocket session (HTTP queries are stateless) so the whole run is one
 * interactive transaction, which also works through Neon's transaction-mode pooler.
 */
export async function connectNeon(databaseUrl: string): Promise<MigrationSession> {
  neonConfig.webSocketConstructor = ws;
  const client = new Client(databaseUrl);
  try {
    await client.connect();
  } catch (error) {
    // The WebSocket layer rejects with an ErrorEvent rather than an Error.
    const reason = error instanceof Error ? error.message : (error as { message?: string } | null)?.message;
    throw new Error(`Could not connect to the database: ${reason || String(error)}`);
  }
  return {
    sql: async (strings, ...values) => {
      const text = strings.reduce((query, part, index) => `${query}$${index}${part}`);
      return (await client.query(text, values)).rows;
    },
    close: () => client.end(),
  };
}

export async function runMigrations({
  env = process.env,
  connect = connectNeon,
  migrations = MIGRATIONS,
  log = console.log,
}: RunMigrationsOptions = {}): Promise<RunMigrationsResult> {
  if (!shouldRunMigrations(env)) {
    log(`[migrate] skipping migrations (VERCEL_ENV=${env.VERCEL_ENV || "unset"}; they only run on production deploys or with RUN_MIGRATIONS=1)`);
    return { status: "skipped" };
  }

  const ids = migrations.map((migration) => migration.id);
  const duplicate = ids.find((id, index) => ids.indexOf(id) !== index);
  if (duplicate) throw new Error(`Duplicate migration id "${duplicate}"`);

  const databaseUrl = env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set: cannot run production migrations, aborting the deploy");
  }

  log(`[migrate] running migrations (VERCEL_ENV=${env.VERCEL_ENV || "unset"})`);
  const session = await connect(databaseUrl);
  const { sql } = session;
  try {
    // One transaction: a failure leaves the database untouched, and the advisory
    // lock makes concurrent deploys wait for each other until COMMIT/ROLLBACK.
    await sql`BEGIN`;
    await sql`SET LOCAL lock_timeout = '60s'`;
    await sql`SELECT pg_advisory_xact_lock(hashtext('autentizity.schema_migrations'))`;
    await ensureSchema(sql);
    log("[migrate] schema ensured (tables and columns)");

    const rows = await sql`SELECT id FROM schema_migrations`;
    const applied = new Set(rows.map((row) => String(row.id)));
    const pending = migrations.filter((migration) => !applied.has(migration.id));
    for (const migration of pending) {
      log(`[migrate] applying ${migration.id}`);
      await migration.up(sql);
      await sql`INSERT INTO schema_migrations (id) VALUES (${migration.id})`;
    }
    await sql`COMMIT`;

    log(pending.length > 0
      ? `[migrate] done, applied ${pending.length}: ${pending.map((migration) => migration.id).join(", ")}`
      : "[migrate] done, no pending migrations");
    return { status: "migrated", applied: pending.map((migration) => migration.id) };
  } catch (error) {
    await sql`ROLLBACK`.catch(() => {});
    throw error;
  } finally {
    await session.close().catch((error: unknown) => log(`[migrate] warning: could not close the connection: ${String(error)}`));
  }
}
