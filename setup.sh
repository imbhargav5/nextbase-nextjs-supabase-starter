#!/usr/bin/env bash
set -euo pipefail

# Stop any stale Supabase containers from a previous run to avoid port-bind failures.
( cd apps/database && pnpm supabase stop --no-backup 2>/dev/null || true ) || true

# Copy .env*.example files to their .env counterparts if missing.
# Covers repo root, apps/*, and packages/*.
while IFS= read -r ex; do
  target="${ex%.example}"
  if [ ! -f "$target" ]; then
    cp "$ex" "$target"
    echo "Created $target"
  fi
done < <(find . \( -name ".env.local.example" -o -name ".env.development.local.example" \) -not -path "*/node_modules/*" -not -path "*/.git/*")

# Install dependencies.
pnpm i

# Bring up the local Supabase stack.
pnpm database#start

# Sync local Supabase keys into env files (non-fatal if it fails).
pnpm supabase:sync-env || true

# Generate local DB types (non-fatal).
pnpm gen-types-local || true

echo "Setup complete"
