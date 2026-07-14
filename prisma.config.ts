import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Next.js reads `.env.local` on its own; loading the same file here means
// the Prisma CLI (migrate/generate/studio) shares one source of truth
// instead of needing a separate `.env`.
config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Migrate always needs the direct (non-pooled) connection — DDL and
    // advisory locks don't work reliably through Supabase's pgbouncer pool.
    url: process.env["DIRECT_URL"],
  },
});
