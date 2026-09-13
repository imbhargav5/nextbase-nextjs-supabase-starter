import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const envPath = path.join(repoRoot, ".env.local");

const requiredKeys = [
  "SUPABASE_PROJECT_REF",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
] as const;

function parseEnv(content: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const eq = trimmed.indexOf("=");
    if (eq === -1) {
      continue;
    }
    map.set(trimmed.slice(0, eq).trim(), trimmed.slice(eq + 1).trim());
  }
  return map;
}

function isRemoteSupabaseUrl(url: string): boolean {
  try {
    return new URL(url).hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

async function main(): Promise<void> {
  if (!existsSync(envPath)) {
    throw new Error("Missing .env.local at repo root.");
  }

  const env = parseEnv(await readFile(envPath, "utf8"));
  const missing = requiredKeys.filter((key) => !env.get(key));
  if (missing.length > 0) {
    throw new Error(`Missing in .env.local: ${missing.join(", ")}`);
  }

  const url = env.get("NEXT_PUBLIC_SUPABASE_URL")!;
  if (!isRemoteSupabaseUrl(url)) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL must be your hosted project URL (https://<ref>.supabase.co).",
    );
  }

  const ref = env.get("SUPABASE_PROJECT_REF")!;
  if (!url.includes(ref)) {
    throw new Error(
      "SUPABASE_PROJECT_REF does not match NEXT_PUBLIC_SUPABASE_URL.",
    );
  }

  process.stdout.write(
    `Remote Supabase env OK for project ${ref}.\n` +
      "Keys are managed in Dashboard → Project Settings → API (not local Docker).\n",
  );

  if (!env.get("SUPABASE_DB_URL")) {
    process.stdout.write(
      "Tip: add SUPABASE_DB_URL (Database → Connection string → URI) to run pnpm database#push:remote.\n",
    );
  }
}

main().catch((error: unknown) => {
  process.stderr.write(
    `Error: ${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
});
