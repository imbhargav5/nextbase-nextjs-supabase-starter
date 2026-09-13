/** Shared copy blocks for kit prompts — keep routing and AI workflow consistent. */

export const CONTEXT7_WORKFLOW = `## Documentation workflow (Context7)
Use Context7 MCP before guessing library APIs:

1. \`resolve-library-id\` — pass the library name and what you need (e.g. "Next.js generateMetadata", "shadcn/ui Button", "Supabase SSR").
2. \`query-docs\` — pass the selected \`/org/project\` ID and **one concept per call** (metadata, routing, RLS, etc.).
3. Implement using the fetched syntax; do not rely on outdated training snippets.

Reach for Context7 when touching: Next.js App Router, React 19, shadcn/ui, Radix, Tailwind CSS v4, Motion, Stripe, Supabase Auth, Zod, next-safe-action.`;

export const AI_EXECUTION_BRIEF = `## How to use this prompt (read first)
You are implementing a production marketing site in a **standalone Next.js App Router project**, not extending the Nextbase demo route tree.

1. **Study the reference** in the Nextbase monorepo (paths below). Match layout, spacing, motion, and data shapes — do not invent a different information architecture.
2. **Copy components** into your app (e.g. \`components/templates/...\`) and fix imports to your alias (\`@/components/...\`).
3. **Centralize copy** in \`data.ts\` / \`constants.ts\`. Section components read from data; avoid hardcoded marketing strings in JSX.
4. **Ship with a flat app directory** (see routing block). Homepage is app/page.tsx, not a /templates demo path.
5. After each section: run \`pnpm typecheck\` and \`pnpm build\`; fix errors before moving on.
6. Replace placeholders: [BRAND], [TAGLINE], [PRIMARY_HREF], [SECONDARY_HREF], [CHECKOUT_URL], [EMAIL], [MUX_URL], etc.`;

export const SHIP_APP_ROUTING_SAAS = `## Required app routing (SaaS / Nguyen kit)
**Do not** ship under \`(demos)\`, \`(marketing)\`, or \`/templates/nguyen\`. Those URLs are preview-only in Nextbase.

Use a normal App Router tree:

\`\`\`
app/
  layout.tsx              # <html>, fonts, import scoped nguyen-theme.css once
  page.tsx                # Marketing landing → <NguyenTemplate />
  changelog/page.tsx      # Changelog → <NguyenChangelogPage />
  sign-up/page.tsx        # (optional) auth from starter — sibling route, not nested in template groups
components/templates/nguyen/
  nguyen-template.tsx     # orchestrator
  data.ts                 # all marketing copy
  nguyen-*.tsx            # one file per section
\`\`\`

- \`app/page.tsx\`: export \`metadata\`; default export renders \`<NguyenTemplate />\` (server component page importing client sections as needed).
- \`app/changelog/page.tsx\`: same chrome as landing (header/background/footer) via changelog page component.
- **No route groups** like (site) unless you already use them for unrelated concerns; template pages must live at **top-level segments** (/, /changelog).
- Scoped theme: wrap template in \`NguyenThemeProvider\` and class \`.nguyen-template\` so global marketing CSS elsewhere is untouched.`;

export const SHIP_APP_ROUTING_PORTFOLIO = `## Required app routing (Portfolio / Smith kit)
**Do not** ship under \`(demos)\` or \`/templates/smith\`. Reference demos use those paths only.

Use a normal App Router tree:

\`\`\`
app/
  layout.tsx              # fonts + import smith-theme.css once
  page.tsx                # Portfolio home → <SmithTemplate /> inside <Suspense> (useSearchParams)
  about/page.tsx          # About → <SmithAboutPage />
  work/[slug]/page.tsx    # Case study → <SmithCaseStudyPage slug={...} />
components/templates/smith/
  smith-template.tsx
  constants.ts
  smith-*.tsx
\`\`\`

- Home is **/**\` — single-page scroll with hash nav (\`#home\`, \`#work\`, \`#resume\`, \`#contact\`).
- \`about\` and \`work/[slug]\` are **separate documents** with their own \`metadata\`.
- Optional: \`?frame=1\` on home skips loading screen (kit iframe preview); keep that query check in \`SmithTemplate\`.
- **No nested route groups** for the portfolio; avoid \`app/(portfolio)/page.tsx\` unless the rest of the app already uses groups for auth only.`;

export const NGUYEN_REFERENCE = `## Reference source (Nextbase monorepo — read, then port)
- Components: \`apps/web/src/components/templates/nguyen/\`
- Data: \`nguyen/data.ts\` (hero, nav, features, solution, testimonials, pricing, faq, changelog, assets)
- Orchestrator: \`nguyen-template.tsx\` (section order)
- Theme: \`nguyen-theme.css\`, \`nguyen-theme-provider.tsx\`
- Demo URLs (preview only): \`/templates/nguyen\`, \`/templates/nguyen/changelog\`
- Stack: React 19, Next.js App Router, \`motion/react\`, shadcn/ui inside \`.nguyen-template\``;

export const SMITH_REFERENCE = `## Reference source (Nextbase monorepo — read, then port)
- Components: \`apps/web/src/components/templates/smith/\`
- Data: \`smith/constants.ts\` (nav, projects, journal, stats, explorations, MUX URL, loading words)
- Orchestrator: \`smith-template.tsx\`
- Theme: \`smith-theme.css\`, \`smith-theme-provider.tsx\`
- Demo URLs (preview only): \`/templates/smith\`, \`/templates/smith/about\`, \`/templates/smith/work/[slug]\`
- Stack: React 19, App Router, Motion, GSAP + ScrollTrigger, hls.js, next/image`;

export const PLACEHOLDERS_SAAS = `## Brand placeholders
[BRAND] [TAGLINE] [PRIMARY_HREF] [SECONDARY_HREF] [CHECKOUT_URL] — plus tier names, FAQ, and testimonial copy in data.ts.`;

export const PLACEHOLDERS_PORTFOLIO = `## Brand placeholders
[BRAND] [INITIALS] [EMAIL] [MUX_URL] [WORD_A/B/C] in smithLoadingWords — update constants.ts before styling.`;
