# Setup

1. From the repo root, run `pnpm i`.
2. Check whether `.env.local` already exists before creating it.
3. If `.env.local` does not exist, copy `.env.local.example` to `.env.local`.
4. Never overwrite an existing `.env.local`.
5. In this repo, the example env files currently live alongside the apps that use them, such as `apps/web/.env.local.example`, so create the matching `.env.local` file next to the example file only when it is missing.
6. Go to `apps/database` and run `pnpm start`. If that is unavailable in your environment, run `pnpm supabase start` instead.
7. Wait for Supabase to finish starting before moving on.
8. Return to the repo root and run `pnpm supabase:sync-env`.
