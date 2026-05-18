# Agent Rules

## Do not commit `.oneignore`

Never create a `.oneignore` file. Never `git add` or `git commit` a `.oneignore` file. It is a legacy artifact from the deprecated `one` CLI and must stay out of the repo.

# Setup

Follow these steps to get the repo running locally end-to-end. This is a pnpm + Turborepo monorepo with a Next.js app (`apps/web`) and a Supabase local stack (`apps/database`).

1. From the repo root, install dependencies: `pnpm i`.
2. Check whether `.env.local` already exists at the repo root before creating it.
3. If `.env.local` does not exist, copy `.env.local.example` to `.env.local`. Never overwrite an existing `.env.local`.
4. Do the same for `.env.development.local` — if it does not exist, copy `.env.development.local.example` to `.env.development.local`. Never overwrite an existing file.
5. Env example files in this repo live at the repo root (not alongside `apps/web` or `apps/database`), so create the matching files at the repo root only.
6. Start the local Supabase stack: from the repo root run `pnpm database#start` (which proxies to `supabase start` inside `apps/database`). Alternatively, `cd apps/database && pnpm start`. If neither is available in your environment, run `pnpm supabase start` from `apps/database`.
7. Wait for Supabase to finish starting (the CLI prints `API URL`, `DB URL`, and keys) before moving on.
8. Return to the repo root and run `pnpm supabase:sync-env` to sync the local Supabase keys into your env files.
9. Start the dev server with `pnpm dev` (runs all apps in parallel) or `pnpm web#dev` for just the web app.
