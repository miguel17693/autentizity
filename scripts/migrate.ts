import { runMigrations } from "@/lib/data/migrate";
import { rehostExternalImages } from "@/lib/data/rehost-images";

async function main() {
  try {
    await runMigrations();
  } catch (error) {
    console.error("[migrate] FAILED, the deploy is aborted and the current version stays live:", error);
    process.exit(1);
  }

  // Non-fatal: if it fails, the images simply stay on their external host.
  try {
    await rehostExternalImages();
  } catch (error) {
    console.warn("[rehost-images] warning: unexpected failure, the build continues:", error);
  }
  process.exit(0);
}

void main();
