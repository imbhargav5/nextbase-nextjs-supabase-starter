import type { KitPrompt } from '@/lib/kits/prompts/types';
import {
  AI_EXECUTION_BRIEF,
  PLACEHOLDERS_PORTFOLIO,
  SHIP_APP_ROUTING_PORTFOLIO,
  SMITH_REFERENCE,
} from '@/lib/kits/prompts/prompt-fragments';

const PREAMBLE = `${AI_EXECUTION_BRIEF}

${SHIP_APP_ROUTING_PORTFOLIO}

${SMITH_REFERENCE}

${PLACEHOLDERS_PORTFOLIO}`;

export const portfolioLaunchKitPrompts: KitPrompt[] = [
  {
    id: 'master-portfolio-home',
    section: 'Home',
    title: 'Full portfolio home (orchestration)',
    body: `## Goal
Build [BRAND]'s portfolio home at the site root (/) — same section order, motion, and hash nav as the Smith reference (not the demo path /templates/smith).

${PREAMBLE}

## Step 1 — \`smith-template.tsx\` (client)
\`\`\`tsx
'use client';
// useSearchParams for ?frame=1
// useState isLoading — skip loader when frame=1
\`\`\`

Wrap in \`SmithThemeProvider\`. Render order:

1. \`SmithLoadingScreen\` when \`isLoading\` (unless frame preview)
2. \`SmithHero\` (includes \`SmithHeader\` + video — section \`#home\`)
3. \`<main>\`:
   - \`SmithWorks\` (\`#work\`)
   - \`SmithJournal\`
   - \`SmithExplorations\`
   - \`SmithStats\` (\`#resume\`)
4. \`SmithContact\` (\`#contact\`)

## Step 2 — \`app/page.tsx\`
\`\`\`tsx
import { Suspense } from 'react';
import { SmithTemplate } from '@/components/templates/smith/smith-template';

export const metadata = { title: '[BRAND]', description: '...' };

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <SmithTemplate />
    </Suspense>
  );
}
\`\`\`

## Step 3 — Hash nav contract
\`smithNavLinks\` in constants must match DOM ids: \`#home\`, \`#work\`, \`#resume\`, \`#contact\`.

## Step 4 — Data
All copy/media in \`constants.ts\`; components stay presentational.

## Acceptance
- Home URL is the site root with no (demos) route segment.
- Loader respects \`prefers-reduced-motion\` (immediate \`onComplete\`).
- hls.js destroyed on unmount; ScrollTrigger contexts reverted.
- typecheck + build pass.`,
  },
  {
    id: 'design-system',
    section: 'Foundation',
    title: 'Scoped Smith design tokens',
    body: `## Goal
Port Smith's dark portfolio theme for [BRAND] — scoped to \`.smith-template\`, independent of other site pages.

${PREAMBLE}

## Files
| File | Role |
|------|------|
| \`smith-theme.css\` | HSL component variables under wrapper class |
| \`smith-theme-provider.tsx\` | \`next/font\` (Inter + display serif) + root wrapper |

## Required CSS variables
- \`--smith-bg\` — canvas (~4% lightness)
- \`--smith-surface\` — cards (~8%)
- \`--smith-text\` — primary copy (~96%)
- \`--smith-muted\` — secondary (~55%)
- \`--smith-stroke\` — borders (~18%)

## Utilities
- \`.smith-accent-gradient\` — linear #89AACC → #4E85BF (tune for [BRAND])
- \`smithDisplayClass()\` — Instrument Serif or [DISPLAY_FONT] for headlines
- Keyframes: \`smith-scroll-down\`, \`smith-role-fade-in\`

## Usage pattern
Components use \`bg-[hsl(var(--smith-bg))]\`, \`border-[hsl(var(--smith-stroke))]\` — avoid raw \`#000\` except video overlays.

## Import
\`smith-theme.css\` once in \`app/layout.tsx\`.

## Acceptance
- /kits or /sign-up unaffected if those routes exist elsewhere.
- Body text contrast ≥ 4.5:1; muted large type ≥ 3:1.`,
  },
  {
    id: 'loading-screen',
    section: 'Home',
    title: 'Loading ritual overlay',
    body: `## Goal
Recreate \`SmithLoadingScreen\` — full-viewport intro with progress counter and rotating words.

${PREAMBLE}

## File
\`smith-loading-screen.tsx\` — \`'use client'\`

## Visual structure
- \`fixed inset-0 z-[9999]\` on \`--smith-bg\`
- Center: large three-digit progress (\`000\` → \`100\`, \`padStart(3,'0')\`)
- Below: rotating word from \`smithLoadingWords\` ([WORD_A/B/C]) with \`AnimatePresence\` crossfade
- Bottom: full-width track; fill width = progress % using \`.smith-accent-gradient\`

## Timing (match reference)
| Phase | Duration |
|-------|----------|
| Progress 0→100 | 2700ms via \`requestAnimationFrame\` |
| Word rotation | every 900ms |
| Hold at 100 | 400ms then \`onComplete()\` |

## Reduced motion
On \`prefers-reduced-motion: reduce\`: call \`onComplete()\` once in \`useEffect\` — no rAF, no interval.

## Parent wiring
\`SmithTemplate\`: \`useState(!isFramePreview)\` where \`isFramePreview = searchParams.get('frame') === '1'\`.

## A11y
\`role="status"\` + \`aria-live="polite"\`. Cleanup rAF + interval on unmount.

## Acceptance
- No hero flash under loader.
- \`onComplete\` fires exactly once.`,
  },
  {
    id: 'hero-hls',
    section: 'Home',
    title: 'HLS hero, pill nav, GSAP reveals',
    body: `## Goal
Recreate \`SmithHero\`, \`SmithHeader\`, and \`SmithHlsVideo\` — fullscreen video, floating pill nav, name reveal.

${PREAMBLE}

## SmithHlsVideo
- Dynamic \`import('hls.js')\` in \`useEffect\`
- Attach to \`<video muted playsInline loop>\` with [MUX_URL] from constants
- \`hls.destroy()\` on unmount; fallback poster or solid bg if unsupported

## SmithHeader (inside hero)
- Fixed top pill: [INITIALS] monogram, \`smithNavLinks\` anchor links, primary "Say hi" → \`#contact\`
- Surface bg + stroke; \`z-50\`; focus rings on pills

## SmithHero layers (bottom → top)
1. Absolute inset-0 video
2. \`bg-black/20\` + bottom gradient \`h-48\` to \`--smith-bg\`
3. Header
4. Center stack: eyebrow, h1 [BRAND] with class \`smith-name-reveal\`, rotating \`smithRoles\` every 2s (\`smith-role-fade-in\`), subcopy, scroll cue with \`smith-scroll-down\`

## GSAP on mount
\`\`\`ts
gsap.context(() => {
  gsap.from('.smith-name-reveal', { opacity: 0, y: 50, duration: 1.2, ease: 'power3.out' });
  gsap.from('.smith-blur-in', { opacity: 0, y: 20, filter: 'blur(10px)', stagger: 0.1, delay: 0.3 });
}, scope);
\`\`\`
Return \`() => ctx.revert()\`.

## Acceptance
- Decorative video \`aria-hidden\`; meaning in h1.
- Nav readable on bright frames.
- No uncaught HLS errors.`,
  },
  {
    id: 'selected-works',
    section: 'Home',
    title: 'Selected work bento grid',
    body: `## Goal
Recreate \`SmithWorks\` — \`section#work\` with 12-column bento and halftone hover overlay.

${PREAMBLE}

## Data (\`smithProjects[]\`)
\`\`\`ts
{ title, image, span: 'md:col-span-7' | 'md:col-span-5', aspect: 'aspect-[16/10]' | 'aspect-[4/5]', slug? }
\`\`\`
Ship **4 projects** alternating 7+5 spans (see reference constants).

## Section chrome — \`SmithSectionHeader\`
- Eyebrow: "Selected Work"
- Heading: "Featured" + italic "projects" (display font on italic)
- Optional "View all work" link

## Grid
- Container: \`max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16\`
- \`grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6\`

## Each \`<article>\`
- \`rounded-3xl border\` surface token, \`group relative overflow-hidden\`
- \`next/image\` fill \`object-cover\`, hover \`scale-105\` 500ms
- Halftone overlay: \`radial-gradient(circle, #000 1px, transparent 1px)\`, \`backgroundSize: 4px 4px\`, \`opacity-20 mix-blend-multiply\`
- Hover center pill: \`View — {title}\` on \`bg-[hsl(var(--smith-bg))]/70 backdrop-blur-lg\`

## Case study links
Wrap article in \`Link\` to /work/[slug] when slug defined.

## Acceptance
- \`aspect-*\` prevents CLS; \`sizes="(max-width: 768px) 100vw, 50vw"\`.
- Meaningful \`alt\` or decorative + visible title on hover.`,
  },
  {
    id: 'journal',
    section: 'Home',
    title: 'Journal list (pill rows)',
    body: `## Goal
Recreate \`SmithJournal\` — "Recent thoughts" rows with thumbnail and metadata.

${PREAMBLE}

## Data (\`smithJournal[]\`)
\`{ title, readTime, date, image, href? }\`

## Header
\`SmithSectionHeader\`: eyebrow "Journal", heading "Recent" + italic "thoughts".

## Row anatomy
- Flex row, surface + stroke border, \`rounded-2xl\` or \`rounded-full\`, \`px-4 py-3\`
- Left: 48–56px rounded thumbnail
- Center: title + muted read time
- Right: date (hide on xs if cramped)
- Whole row = \`Link\` when \`href\` set; hover lightens surface

## Motion
Optional \`whileInView\` fade-up stagger 0.05s — subtle only.

## Acceptance
- Semantic list (ul and li, or articles); single section h2 via header.
- No horizontal scroll at 320px.`,
  },
  {
    id: 'explorations-parallax',
    section: 'Home',
    title: 'Explorations parallax pin',
    body: `## Goal
Recreate \`SmithExplorations\` — long scroll section with pinned headline and scrubbed parallax columns.

${PREAMBLE}

## Structure
- Outer \`section\` \`min-h-[300vh]\` (scroll runway)
- Pinned center block: eyebrow + H2
- Two columns, ~3 images each, opposing Y motion on scroll

## GSAP ScrollTrigger
1. \`gsap.registerPlugin(ScrollTrigger)\`
2. Pin text block for ~40% of section scroll
3. Per-image: \`gsap.to(ref, { yPercent, scrollTrigger: { scrub: true, trigger: section } })\` — different speeds per column (-15 vs +20)

## Images
From \`smithExplorations\` — portraits, \`rounded-2xl\`, stroke border.

## Cleanup
\`useLayoutEffect\` + \`gsap.context\`; \`return () => ctx.revert()\`.

## Reduced motion
Static 2-col grid, no pin/scrub.

## Acceptance
- Transform-only animations.
- Pin releases before \`SmithContact\` overlaps.`,
  },
  {
    id: 'stats-footer',
    section: 'Home',
    title: 'Stats band + contact footer',
    body: `## Goal
Recreate \`SmithStats\` (\`#resume\`) and \`SmithContact\` (\`#contact\`).

${PREAMBLE}

## SmithStats
- \`section#resume\`, vertical padding \`py-12 md:py-16\`
- Grid 2×2 or 4 cols from \`smithStats\`: label (uppercase muted) + large tabular numeral (display font)

## SmithContact
- \`section#contact\`: video band or gradient (reuse HLS or static)
- GSAP marquee: duplicate text track, \`gsap.to(el, { xPercent: -50, repeat: -1, duration: 20, ease: 'none' })\`
- \`mailto:[EMAIL]\`, social icons (\`rel="noopener"\` on external)
- Footer bar: © [BRAND], mini nav

## Reduced motion
Disable or hide marquee; keep static headline.

## Acceptance
- Stats stack on mobile.
- Contact links keyboard-focusable.`,
  },
  {
    id: 'about-page',
    section: 'About',
    title: 'About page scaffold',
    body: `## Goal
Ship /about using \`smith-about-page.tsx\` (not the demo path /templates/smith/about).

${PREAMBLE}

## Route
\`\`\`tsx
// app/about/page.tsx
import { SmithAboutPage } from '@/components/templates/smith/smith-about-page';

export const metadata = { title: 'About — [BRAND]', description: '...' };

export default function AboutPage() {
  return <SmithAboutPage />;
}
\`\`\`

## Recreate sections in \`SmithAboutPage\`
1. **Intro hero:** eyebrow "About", h1 studio name, 2–3 sentence bio
2. **Capabilities:** 3×2 grid — icon/number, title, one-line blurb (design, engineering, motion, etc.)
3. **Collaborators:** logo row or muted pills
4. **CTA:** button linking to homepage #contact or mailto:[EMAIL]

## Chrome
Reuse \`SmithHeader\` or minimal top bar; same \`max-w-[1200px]\` rhythm as home.

## Acceptance
- One h1 on about document.
- Theme tokens only; no home-only loader on this route.`,
  },
  {
    id: 'case-study-page',
    section: 'Work',
    title: 'Case study template',
    body: `## Goal
Ship /work/[slug] with \`smith-case-study-page.tsx\`.

${PREAMBLE}

## Data (\`smithCaseStudies\`)
\`\`\`ts
Record<string, {
  title, heroImage, roleTags: string[],
  challenge: string, approach: string[],
  outcomes: { label, value }[],
  gallery: string[],
  nextSlug?: string,
}>
\`\`\`
Seed \`automotive-motion\` aligned with first bento project.

## Page sections (top → bottom)
1. Hero image full-width + title + role tag pills
2. Challenge — 2 paragraphs
3. Approach — numbered steps
4. Gallery — 2–4 images, 2-col or masonry
5. Outcomes — 3 metric cards
6. Next project link

## Route
\`\`\`tsx
// app/work/[slug]/page.tsx
export function generateStaticParams() { return Object.keys(smithCaseStudies).map(slug => ({ slug })); }
\`\`\`
\`notFound()\` for unknown slugs.

## Acceptance
- Bento links resolve to correct slug.
- Hero image has descriptive \`alt\`.`,
  },
  {
    id: 'ship-routes',
    section: 'Ship',
    title: 'Wire production routes + sitemap',
    body: `## Goal
Map demo catalog paths to flat production routes.

${PREAMBLE}

## Route mapping
| Demo (reference) | Production |
|------------------|------------|
| /templates/smith | / (homepage) |
| /templates/smith/about | /about |
| /templates/smith/work/automotive-motion | /work/automotive-motion |

## Tasks
1. Implement \`app/page.tsx\`, \`app/about/page.tsx\`, \`app/work/[slug]/page.tsx\`.
2. Import \`smith-theme.css\` in root layout.
3. Sitemap: homepage, about, and each case study slug.
4. Document \`?frame=1\` for iframe preview (skips loader).

## Acceptance
- \`pnpm build\` includes all routes.
- No imports from \`(demos)\` in shipped app.`,
  },
  {
    id: 'motion-a11y',
    section: 'Quality',
    title: 'Motion, video, accessibility pass',
    body: `## Goal
Harden the Smith template for production on the homepage and subpages.

${PREAMBLE}

## Client boundaries
Only GSAP/hls/searchParams files need \`'use client'\`; keep \`app/*/page.tsx\` thin.

## Checklist
1. Dynamic import hls.js; destroy on unmount
2. One \`gsap.context\` per component; revert on unmount
3. Passive scroll listeners where used
4. Focus rings on nav pills and journal links
5. Video decorative → \`aria-hidden\`; meaning in headings
6. Reduced motion: loader skip, parallax static, marquee off

## Manual test
Tab: header → work cards → contact; narrow viewport bento stack; navigate away and back — no duplicate ScrollTriggers.

## Acceptance
- No console errors from GSAP/Hls on remount.
- Lint clean on touched files.`,
  },
];
