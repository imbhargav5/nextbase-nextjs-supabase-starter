# App router layout

Route groups organize layouts and access patterns. **URLs ignore group names** in parentheses.

| Group | Purpose |
| --- | --- |
| `(marketing)` | Public site: navbar, footer, home, `/kits`, `/prompts`, `/kit/[slug]`, pricing (`/templates` redirects to `/prompts`) |
| `(demos)` | Full-bleed live demos at `/templates/*` (no site chrome; `?frame=1` for kit embeds) |
| `(auth-pages)` | Sign-in, sign-up, password flows |
| `(app-pages)` | Authenticated app shell (sidebar, auth guard) |

## Conventions

- **`page.tsx` / `layout.tsx` / `route.ts` only** under route segments when possible.
- **Route-local UI** lives in `_components/` next to the route (private folder; not a URL).
- **Shared UI** lives in `src/components/` (`marketing/`, `app/`, `Auth/`, `providers/`, etc.).
- **Data** stays in `src/data/*` and `src/rsc-data/*` per NextBase architecture.

## Stripe kits

- Checkout: `createKitCheckoutSessionAction` → Stripe Checkout (test price via `STRIPE_PRICE_SAAS_LAUNCH_KIT`).
- Webhook: `POST /api/stripe/webhook` (`checkout.session.completed`) → `kit_purchases` (service role).
- Success URL also fulfills purchases if the webhook is delayed (local dev).
- Local webhook forwarding: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
