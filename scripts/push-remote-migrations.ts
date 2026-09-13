import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import pg from "pg";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const migrationsDir = path.join(
  repoRoot,
  "apps/database/supabase/migrations",
);

async function loadEnvLocal(): Promise<void> {
  const envPath = path.join(repoRoot, ".env.local");
  if (!existsSync(envPath)) {
    return;
  }

  const content = await readFile(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const eq = trimmed.indexOf("=");
    if (eq === -1) {
      continue;
    }
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function isRemoteSupabaseUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return host.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

async function ensureMigrationsTable(client: pg.Client): Promise<void> {
  await client.query(`
    CREATE SCHEMA IF NOT EXISTS supabase_migrations;
    CREATE TABLE IF NOT EXISTS supabase_migrations.schema_migrations (
      version text PRIMARY KEY,
      statements text[],
      name text
    );
  `);
}

async function getAppliedVersions(client: pg.Client): Promise<Set<string>> {
  const result = await client.query<{ version: string }>(
    `SELECT version FROM supabase_migrations.schema_migrations`,
  );
  return new Set(result.rows.map((row) => row.version));
}

async function main(): Promise<void> {
  await loadEnvLocal();

  const databaseUrl = process.env.SUPABASE_DB_URL;
  if (!databaseUrl) {
    throw new Error(
      "Set SUPABASE_DB_URL in .env.local (Supabase Dashboard → Project Settings → Database → Connection string → URI).",
    );
  }

  const apiUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  if (apiUrl && !isRemoteSupabaseUrl(apiUrl)) {
    throw new Error(
      "SUPABASE_DB_URL push is for remote Supabase only. Use local supabase migrations if NEXT_PUBLIC_SUPABASE_URL points to localhost.",
    );
  }

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  await ensureMigrationsTable(client);

  const applied = await getAppliedVersions(client);
  const files = (await readdir(migrationsDir))
    .filter((file) => file.endsWith(".sql"))
    .toSorted();

  let appliedCount = 0;

  for (const file of files) {
    const version = file.replace(/\.sql$/, "");
    if (applied.has(version)) {
      continue;
    }

    const sql = await readFile(path.join(migrationsDir, file), "utf8");
    process.stdout.write(`Applying ${file}…\n`);
    await client.query("BEGIN");
    try {
      await client.query(sql);
      await client.query(
        `INSERT INTO supabase_migrations.schema_migrations (version, name)
         VALUES ($1, $2)`,
        [version, file],
      );
      await client.query("COMMIT");
      appliedCount += 1;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  }

  await client.end();

  if (appliedCount === 0) {
    process.stdout.write("Remote database is up to date.\n");
  } else {
    process.stdout.write(`Applied ${appliedCount} migration(s) to remote Postgres.\n`);
  }
}

main().catch((error: unknown) => {
  process.stderr.write(
    `Error: ${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
});
