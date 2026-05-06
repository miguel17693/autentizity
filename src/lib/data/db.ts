import { neon } from "@neondatabase/serverless";

/**
 * Returns a SQL query function connected to the Neon database.
 * Requires DATABASE_URL environment variable (provided by Vercel when you link a Neon DB).
 */
export function getSQL() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Create a Neon database in Vercel Storage and link it to this project."
    );
  }
  return neon(url);
}
