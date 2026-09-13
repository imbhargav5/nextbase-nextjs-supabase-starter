import type { KitPrompt } from '@/lib/kits/prompts/types';
import {
  AI_EXECUTION_BRIEF,
  NGUYEN_REFERENCE,
  PLACEHOLDERS_SAAS,
  SHIP_APP_ROUTING_SAAS,
} from '@/lib/kits/prompts/prompt-fragments';

const PREAMBLE = `${AI_EXECUTION_BRIEF}

${SHIP_APP_ROUTING_SAAS}

${NGUYEN_REFERENCE}

${PLACEHOLDERS_SAAS}`;

export const saasLaunchKitPrompts: KitPrompt[] = [
  {
    id: 'master-saas-landing',
    section: 'Landing',
    title: 'Full SaaS marketing landing',
    body: `## Goal
Build [BRAND]'s complete B2B marketing homepage at the site root path (/) — not under /templates — matching the Nguyen reference section order and visual hierarchy.

${PREAMBLE}

## Step 1 — Orchestrator (\`nguyen-template.tsx\`)
Create a server-friendly shell that composes every section in this exact order inside \`NguyenThemeProvider\`:

1. \`NguyenBackground\` — fixed ambient beams (z-0, pointer-events-none)
2. \`NguyenHeader\` — sticky morphing nav (z-50)
3. main wrapper (className relative z-10):
   - \`NguyenHero\`
   - \`NguyenFeatures\`
   - \`NguyenSolution\`
   - \`NguyenTestimonials\`
   - \`NguyenPricing\`
   - \`NguyenFaq\` (must expose \`id="faq"\`)
4. \`NguyenFooter\` in \`relative z-10\` wrapper (sits above background)

## Step 2 — Wire \`app/page.tsx\`
\`\`\`tsx
import { NguyenTemplate } from '@/components/templates/nguyen/nguyen-template';

export const metadata = { title: '[BRAND] — [TAGLINE]', description: '...' };

export default function HomePage() {
  return <NguyenTemplate />;
}
\`\`\`

## Step 3 — Data-first content
Before styling tweaks, fill \`data.ts\`: \`nguyenHero\`, \`nguyenNavLinks\`, \`nguyenFeatureCards\`, solution copy, testimonials, pricing plans, FAQ items. Header/footer read nav and logo from data/assets.

## Step 4 — Footer & internal links
Footer columns: product links (anchors #features, #pricing, #faq), legal placeholders, optional link to the changelog route. All "Get started" paths → [PRIMARY_HREF] or the sign-up route.

## Acceptance
- Visiting the homepage shows full landing; no dependency on (demos) layout segments.
- Light/dark toggle in header still scopes to \`.nguyen-template\`.
- No user-visible "Nguyen" strings after brand pass.
- \`pnpm typecheck\` + \`pnpm build\` pass.`,
  },
  {
    id: 'design-system',
    section: 'Foundation',
    title: 'Nguyen scoped theme tokens',
    body: `## Goal
Port the Nguyen design system so shadcn primitives (\`Button\`, \`Accordion\`, cards) inherit [BRAND] colors inside \`.nguyen-template\` only.

${PREAMBLE}

## Files to create (mirror reference)
| File | Responsibility |
|------|----------------|
| \`nguyen-theme.css\` | CSS variables on \`.nguyen-template\` |
| \`nguyen-theme-provider.tsx\` | Wrapper div + \`next/font\` + theme context |

## Token mapping (match reference semantics)
Map Nguyen palette → shadcn tokens:
- \`--background\` and \`--foreground\` — page canvas and body text
- \`--primary\` and \`--primary-foreground\` — CTAs, beam accents
- \`--muted\` and \`--muted-foreground\` — hero second line, subcopy
- \`--card\`, \`--border\`, \`--ring\` — feature cards and nav pill

Document [BRAND] primary as OKLCH/HSL in a comment block for handoff.

## Theme provider behavior
- Export \`useNguyenTheme()\` with \`isDark\` + \`toggleTheme\` (class \`.dark\` on wrapper).
- Load Inter (or your body font) via \`next/font\`; assign CSS variables on the provider root.

## Beam / atmosphere
\`NguyenBackground\` reads beam color from CSS vars — keep gradients soft (low opacity, large blur). Shift hue toward [BRAND] without banding.

## Import rule
Import \`nguyen-theme.css\` **only** in \`app/layout.tsx\` (or a CSS file imported there). Never in unrelated admin/auth layouts.

## Acceptance
- Primary button contrast ≥ 4.5:1 on background.
- Toggling theme does not affect routes outside the provider tree.
- Cards and accordion use semantic tokens, not one-off hex in each component.`,
  },
  {
    id: 'hero-cta',
    section: 'Landing',
    title: 'Hero + navigation + video modal',
    body: `## Goal
Recreate \`NguyenHeader\` + \`NguyenHero\` exactly: morphing sticky nav, dual CTAs, optional demo video modal, scroll-linked nav compaction.

${PREAMBLE}

## NguyenHeader — recreation checklist
**Structure:** fixed top center pill that animates width/padding with scroll (\`useScroll\` + \`useSpring\` on \`scrollY\`, compact between 0–240px scroll).

**Left:** logo image from \`nguyenAssets\` + [BRAND] text; mobile menu toggle (Lucide Menu and X icons).

**Center (desktop):** \`SlidingHighlightProvider\` + \`SlidingHighlightTarget\` per \`nguyenNavLinks\` — Features, Pricing, FAQ (\`href: '#faq'\`).

**Right:** theme toggle (Sun and Moon icon crossfade), ghost + primary CTA → [PRIMARY_HREF].

**Mobile sheet:** full-width panel below pill; same links + CTAs; close on navigate.

## NguyenHero — recreation checklist
**Layout:** \`mt-28 sm:mt-48\`, centered column, \`max-w-4xl\`, horizontal padding responsive.

**Typography:** \`motion.h1\` — line 1 \`nguyenHero.title\`, line 2 in \`text-muted-foreground block\` (\`titleMuted\`).

**Subcopy:** \`max-w-lg text-center\`, \`motion.p\` staggered after h1.

**Buttons:** primary \`Button asChild\` + \`Link\` (\`shadow-lg\`), outline secondary; hrefs from \`nguyenHero.primaryCta\` and \`secondaryCta\`.

**Watch demo:** tertiary control opens video modal (\`Play\` icon).

## Motion timings (match reference)
| Element | Initial | Animate | Delay |
|---------|---------|---------|-------|
| h1 | opacity 0, y 20 | opacity 1, y 0 | 0 |
| p | opacity 0, y 16 | opacity 1, y 0 | 0.08s |
| buttons | opacity 0, y 12 | opacity 1, y 0 | 0.16s |
| easing | — | duration 0.5, ease [0.16, 1, 0.3, 1] | — |

## Video modal
- \`useState(videoOpen)\`; fullscreen overlay \`fixed inset-0 z-[100]\`
- \`AnimatePresence\` + backdrop click to close
- Embedded iframe or HTML5 video element from \`nguyenHero.videoUrl\`
- \`useEffect\`: Escape key → close; \`document.body.style.overflow = 'hidden'\` while open
- Close button: \`aria-label="Close video"\`

## Acceptance
- Hash #faq from header reaches FAQ section on the homepage.
- Hero remains readable over \`NguyenBackground\` (stacking: background, then main, then header).
- All CTA URLs come from \`data.ts\` only.`,
  },
  {
    id: 'features-bento',
    section: 'Landing',
    title: 'Features grid + solution narrative',
    body: `## Goal
Recreate \`NguyenFeatures\` (bento + inline mockups) and \`NguyenSolution\` (story + composite UI) from the reference files.

${PREAMBLE}

## NguyenFeatures — recreation checklist
**Section header:** eyebrow + h2 from \`nguyenFeaturesSection\` in data.ts.

**Grid:** responsive bento — \`nguyenFeatureCards\` each with \`className\` for span (e.g. \`md:col-span-2\`), optional \`minHeight\`.

**FeatureCard pattern (copy from reference):**
- \`motion.div\` with \`whileInView\` once, \`fadeUpVariants\` staggered by index
- article element: border, \`rounded-md\`, \`bg-card\`, hover shadow
- Top: mockup slot — map card id to component: \`ChatMockup\`, \`KanbanMockup\`, \`WorkflowMockup\`, \`IntegrationsMockup\`, \`BenchmarkMockup\` in \`nguyen-feature-mockups.tsx\`
- Bottom: title + description padding

**Mockups:** presentational divs only (fake window chrome, charts, avatars). No API calls.

## NguyenSolution — recreation checklist
**Layout:** two columns on \`lg:\` — left prose, right tall mockup stack.

**Left:** problem statement, bullet list from data (\`nguyenSolution\`).

**Right:** layered screenshots/cards with subtle border and shadow; optional \`whileInView\` fade.

**Anchor:** optional \`id="solution"\` if nav includes it.

## Implementation order
1. Define all cards in \`data.ts\` with B2B copy for [BRAND].
2. Port mockup components verbatim structure, swap colors to tokens.
3. Wire Features before Solution in \`nguyen-template.tsx\`.

## Acceptance
- One h2 per section; no skipped heading levels.
- Mockups \`overflow-hidden\` — no horizontal scroll on 320px width.
- Feature grid matches reference rhythm (wide + narrow cells).`,
  },
  {
    id: 'social-proof',
    section: 'Landing',
    title: 'Testimonials social proof',
    body: `## Goal
Recreate \`NguyenTestimonials\` — credible B2B quotes in a responsive grid with motion.

${PREAMBLE}

## Data (\`nguyenTestimonials\`)
Each item: \`{ quote, name, role, company, avatar?: string }\`.

## Layout (match reference)
- Section label + h2 centered
- Grid: 1 col mobile → 2–3 cols \`lg:\`
- Card: border, rounded-xl, padding, quote typography with opening punctuation

**Card footer row:**
- \`next/image\` 40×40 \`rounded-full\` avatar (or initials fallback)
- Name \`font-medium\`, role @ company \`text-muted-foreground\`

## Motion
\`whileInView\` per card, stagger ~0.1s, \`viewport: { once: true }\`.
If \`prefers-reduced-motion\`: animate opacity only (no y translation).

## Content guidance
Titles: VP Engineering, Head of Product, etc. Quotes mention measurable outcomes (time saved, compliance, revenue). No fake celebrity names.

## Acceptance
- \`alt\` on avatars includes person name.
- Section sits between Solution and Pricing in template order.
- Keyboard: cards are not falsely focusable unless entire card is a link.`,
  },
  {
    id: 'pricing-faq',
    section: 'Landing',
    title: 'Pricing tiers + FAQ accordion',
    body: `## Goal
Recreate \`NguyenPricing\` and \`NguyenFaq\` — three-tier pricing and collapsible FAQ at \`#faq\`.

${PREAMBLE}

## NguyenPricing — recreation checklist
**Data:** \`nguyenPricingPlans[]\` — \`name, price, period, description, features: string[], highlighted: boolean, ctaLabel, ctaHref\`.

**Layout:**
- Section intro centered
- \`grid md:grid-cols-3 gap-6\` (or reference gap)
- Highlighted plan: \`ring-2 ring-primary\`, scale slightly, \`Popular\` badge (not color-only affordance)
- Each tier: price display, description, feature list with check icons (\`lucide-react\`)
- CTA \`Button\` full-width → [CHECKOUT_URL] or [PRIMARY_HREF]

## NguyenFaq — recreation checklist
**Required:** outer section \`id="faq"\` (header link target).

**Accordion:** shadcn \`Accordion type="single" collapsible\` from \`nguyenFaq[]\`.

Each item: \`AccordionItem\` → \`AccordionTrigger\` (question) → \`AccordionContent\` (answer; may include a bullet list).

## Copy seed
6+ entries covering SSO, security, billing, cancellation, data residency, support SLAs — tailored to [BRAND].

## Acceptance
- \`aria-expanded\` on triggers (shadcn default).
- Pricing CTAs use data hrefs only.
- FAQ accordion keyboard navigable.`,
  },
  {
    id: 'changelog-page',
    section: 'Changelog',
    title: 'Changelog page scaffold',
    body: `## Goal
Ship the changelog at /changelog (not the demo path /templates/nguyen/changelog) using \`nguyen-changelog-page.tsx\`.

${PREAMBLE}

## Route
\`\`\`tsx
// app/changelog/page.tsx
export const metadata = { title: '[BRAND] Changelog', description: '...' };
export default function ChangelogPage() {
  return <NguyenChangelogPage />;
}
\`\`\`

## Page structure (recreate reference)
1. Same chrome as landing: \`NguyenThemeProvider\` → \`NguyenBackground\` → \`NguyenHeader\` → content → \`NguyenFooter\`
2. Page header block: h1 "Changelog", muted subtext about product updates
3. Vertical feed: \`nguyenChangelog[]\` **newest first**

## Entry shape (\`data.ts\`)
\`{ date: string, title: string, tags: ('Feature'|'Fix'|'Improvement')[], body: string }\`

**Row layout:** date column (muted), title bold, tag pills (\`Badge\` variant by tag), body paragraphs below.

## Footer link
Add "Changelog" in \`NguyenFooter\` linking to /changelog.

## Acceptance
- Mobile: dates and tags wrap cleanly.
- Distinct \`metadata.description\` from homepage.
- At least 5 seeded entries for launch credibility.`,
  },
  {
    id: 'ship-routes',
    section: 'Ship',
    title: 'Wire production routes + kit parity',
    body: `## Goal
Map kit catalog pages to **your** flat routes and verify every link works.

${PREAMBLE}

## Route mapping
| Kit catalog (demo) | Your production path |
|--------------------|----------------------|
| /templates/nguyen | / (homepage) |
| /templates/nguyen/changelog | /changelog |

## Tasks
1. Implement \`app/page.tsx\` and \`app/changelog/page.tsx\` as above.
2. Remove any plan to nest marketing under (demos) or /templates in the shipped app.
3. \`app/layout.tsx\`: fonts + \`nguyen-theme.css\` + default \`metadata\` base.
4. Update sitemap generation to include homepage and changelog URLs (use \`NEXT_PUBLIC_SITE_URL\`).
5. Kit purchase remains under /kit/saas-launch-kit in Nextbase — your fork may omit kit routes.

## Env
Document \`NEXT_PUBLIC_SITE_URL\` for canonical URLs.

## Acceptance
- No 404 from footer or header links.
- \`generateMetadata\` / static \`metadata\` on both routes.
- \`pnpm build\` lists homepage and changelog as static or dynamic routes as intended.`,
  },
  {
    id: 'metadata-seo',
    section: 'Ship',
    title: 'Metadata, OG, sitemap',
    body: `## Goal
Production SEO for the homepage and changelog routes.

${PREAMBLE}

## Per-route metadata
\`\`\`ts
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '[BRAND] — [TAGLINE]',
  description: 'One sentence value prop for [BRAND].',
  openGraph: {
    title: '[BRAND]',
    description: '...',
    url: \`\${process.env.NEXT_PUBLIC_SITE_URL}\`,
    type: 'website',
  },
  alternates: { canonical: \`\${process.env.NEXT_PUBLIC_SITE_URL}\` },
};
\`\`\`

Changelog: title \`Changelog · [BRAND]\`, unique description.

## Keywords
Optional \`keywords\` from kit tags (SaaS, B2B).

## OG image
Static \`public/og.png\` or \`app/opengraph-image.tsx\` — brand mark + tagline.

## robots / sitemap
Include both URLs; set \`lastModified\` at build time if using \`app/sitemap.ts\`.

## Acceptance
- View-source shows unique titles.
- No \`localhost\` in committed canonical strings (env only).
- Social preview image resolves in production.`,
  },
  {
    id: 'auth-cta-wiring',
    section: 'Ship',
    title: 'CTAs and app auth routes',
    body: `## Goal
Connect marketing CTAs to auth/checkout **as sibling routes** (\`app/sign-up/\`), without protecting the public homepage.

${PREAMBLE}

## CTA map
| UI label (data.ts) | Target |
|--------------------|--------|
| Get started / Start free | [PRIMARY_HREF] or sign-up route |
| Secondary CTA | [SECONDARY_HREF] (docs, demo) |
| Pricing tier CTAs | [CHECKOUT_URL] or sign-up route |

## Do not
- Add middleware auth on the marketing homepage or changelog.
- Put template pages inside \`(auth)\` route groups.
- Expose service role or secret keys in client components.

## Starter integration
If using Nextbase auth: keep \`app/sign-up/page.tsx\` separate from marketing template; CTAs link out.

## Acceptance
- Anonymous users see full landing and changelog.
- Every \`Link\` href resolves in dev and production.`,
  },
  {
    id: 'brand-pass',
    section: 'Customize',
    title: 'Brand replacement checklist',
    body: `## Goal
Replace all demo copy with [BRAND] production content while keeping template code structure.

${PREAMBLE}

## Edit order
1. \`nguyen/data.ts\` — hero, nav, features, solution, testimonials, pricing, faq, changelog
2. \`nguyen-header.tsx\` and \`nguyen-footer.tsx\` — only if not driven by data
3. public assets — logo, favicon, OG image
4. \`app/page.tsx\` + \`app/changelog/page.tsx\` — metadata strings

## Checklist
- [ ] [BRAND] in header, footer, metadata
- [ ] [TAGLINE] in hero \`titleMuted\` or description
- [ ] 3 pricing tiers with real names and prices
- [ ] 6+ FAQ entries
- [ ] 3+ testimonials
- [ ] 5+ changelog entries
- [ ] CTAs → real [PRIMARY_HREF] / [CHECKOUT_URL]
- [ ] Grep user-visible "Nguyen" → zero matches

## Kit metadata (Nextbase repo only)
If maintaining catalog: set \`promptCount\` for saas-launch-kit to match the number of prompts in \`saasLaunchKitPrompts\` (currently 11).

## Acceptance
- Brand pass complete on homepage and changelog.
- Data.ts is single source of truth for marketing strings.`,
  },
];
