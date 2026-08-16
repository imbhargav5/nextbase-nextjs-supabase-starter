---
name: Nextbase Frontend Smoke Testing
description: Quickly verify a Nextbase Next.js frontend build, dev server, and landing/login UI without a real Supabase backend.
---

# Nextbase Frontend Smoke Testing

Use this skill to run a fast end-to-end smoke test of `apps/web` when upgrading Next.js, Tailwind, shadcn/ui, or adding React Bits components.

## Devin Secrets Needed
- None for pure UI smoke testing. Use placeholder values for `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (see Setup).

## Setup
1. Activate Node and package manager:
   ```bash
   source ~/.nvm/nvm.sh
   nvm use 22
   corepack pnpm -v  # expect 11.1.2+
   ```
2. If `.env.${_repo_secret_imbhargav5/nextbase-website-new_INNGEST_EVENT_KEY}` is missing, create it from the example and add a dummy Supabase URL/key so the browser/client can initialize:
   ```bash
   cp .env.${_repo_secret_imbhargav5/nextbase-website-new_INNGEST_EVENT_KEY}.example .env.${_repo_secret_imbhargav5/nextbase-website-new_INNGEST_EVENT_KEY}
   cp .env.development.${_repo_secret_imbhargav5/nextbase-website-new_INNGEST_EVENT_KEY}.example .env.development.${_repo_secret_imbhargav5/nextbase-website-new_INNGEST_EVENT_KEY}
   ```
   Also create `apps/web/.env.${_repo_secret_imbhargav5/nextbase-website-new_INNGEST_EVENT_KEY}` (and/or `.env.development.${_repo_secret_imbhargav5/nextbase-website-new_INNGEST_EVENT_KEY}`) with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=http://${_repo_secret_imbhargav5/nextbase-website-new_INNGEST_EVENT_KEY}host:54321/
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=dummy_key
   NEXT_PUBLIC_SITE_URL=http://${_repo_secret_imbhargav5/nextbase-website-new_INNGEST_EVENT_KEY}host:3000/
   ```
3. Install dependencies: `corepack pnpm i`
4. Start the dev server: `corepack pnpm --filter=web dev` (runs `next dev --turbopack` on port 3000).
5. Maximize the browser window before recording: `wmctrl -r :ACTIVE: -b add,maximized_vert,maximized_horz`.

## Common Gotchas
- `package.json` engines currently request `node: ">=24.0.0"`, but the app starts on Node 22 with an `Unsupported engine` warning. If Node 22 is the target, lower the engines field; otherwise use Node 24.
- Next.js 16 may auto-generate `apps/web/AGENTS.md` and `apps/web/CLAUDE.md` (and rewrite `apps/web/next-env.d.ts`) on first dev start. Set `agentRules: false` in `next.config.ts` or `.gitignore` these files; restore tracked files with `git checkout --` after testing.
- The project uses `proxy.ts` as middleware; routing does not require a real Supabase instance unless you hit protected pages or submit auth forms.
- `pnpm web#build` is not a root script; use `corepack pnpm --filter=web build` or `turbo run build --filter=web`.

## Smoke Assertions
- Dev server logs show `▲ Next.js 16.x` and messages `Cache Components enabled` / `Partial Prefetching enabled` when the config flags are set.
- `GET /` and `GET /login` return HTTP 200.
- Home page visibly shows the hero `ShinyText` heading, `BlurText` description, and `SpotlightCard` CTA.
- Login page visibly shows the `ShinyText` `Login to NextBase` heading and `Password` / `Magic Link` / `Social Login` tabs.
- `pnpm --filter=web typecheck`, `pnpm --filter=web lint`, and `pnpm --filter=web build` exit 0.

## Navbar / Navigation Smoke Testing
- Maximize the browser before desktop tests; use `wmctrl -r :ACTIVE: -b remove,maximized_vert,maximized_horz && wmctrl -r :ACTIVE: -e 0,0,0,500,900` for a narrow mobile viewport.
- Desktop assertions: logo + "Nextbase" text, `Home`, `About`, `Features` links, theme toggle, `Sign in`, `Get Started`; active link uses `bg-accent text-foreground`; `Features` scrolls to `id="features"`.
- Mobile assertions: hamburger `Menu` button opens a right-side shadcn `Sheet` titled "Menu" with the same links, theme row, and auth buttons; navigating inside the sheet closes it.
- Theme toggle watch-out: `next-themes` 0.4 defaults to `attribute="data-theme"`, but Tailwind v4 in this repo uses `@custom-variant dark (&:is(.dark *))`. If `ThemeProvider` is not given `attribute="class"`, clicking `ModeToggle` updates `data-theme` and `localStorage` but the UI stays light. Verify by checking the `<html>` class and background color, not just `localStorage`.
