import { runMigrations } from "@/lib/data/migrate";

runMigrations().then(
  () => process.exit(0),
  (error: unknown) => {
    console.error("[migrate] FAILED, the deploy is aborted and the current version stays live:", error);
    process.exit(1);
  },
);
