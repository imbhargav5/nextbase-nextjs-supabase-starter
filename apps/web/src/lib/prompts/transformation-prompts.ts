import type { KitPrompt } from '@/lib/kits/prompts/types';
import {
  CONTEXT7_WORKFLOW,
  NGUYEN_REFERENCE,
  SMITH_REFERENCE,
} from '@/lib/kits/prompts/prompt-fragments';

const SAAS_KIT = 'saas-launch-kit';
const PORTFOLIO_KIT = 'portfolio-launch-kit';

function saasShipBlock(): string {
  return `## Ship with the SaaS Launch Kit
- Kit: \`${SAAS_KIT}\` · Template: Nguyen (\`components/templates/nguyen/\`)
- ${NGUYEN_REFERENCE}
- Homepage at \`app/page.tsx\` → \`<NguyenTemplate />\`; optional \`/changelog\` for releases.
- Replace [BRAND], [TAGLINE], [PRIMARY_HREF], [CHECKOUT_URL] in \`nguyen/data.ts\`.

${CONTEXT7_WORKFLOW}

Run \`pnpm typecheck && pnpm build\` when done.`;
}

function portfolioShipBlock(): string {
  return `## Ship with the Portfolio Launch Kit
- Kit: \`${PORTFOLIO_KIT}\` · Template: Smith (\`components/templates/smith/\`)
- ${SMITH_REFERENCE}
- Home at \`/\`, \`/about\`, \`/work/[slug]\` for case studies; copy in \`smith/constants.ts\`.
- Replace [BRAND], [EMAIL], [MUX_URL], project slugs, and loading words.

${CONTEXT7_WORKFLOW}

Run \`pnpm typecheck && pnpm build\` when done.`;
}

/**
 * Product ideas buyers can ship after purchasing a kit, each prompt is a
 * complete repositioning brief, not a generic migration checklist.
 */
export const transformationPrompts: KitPrompt[] = [
  {
    id: 'idea-pick-direction',
    section: 'How to use this page',
    title: 'Pick a product idea, then run the matching prompt',
    body: `## What this is
You bought (or are evaluating) a **Prompt Market kit**: a real Next.js template plus section prompts. The ideas below are **different businesses** you can launch from the same starting point.

## Two kits, two shapes
| Kit | Template | Natural fit |
|-----|----------|-------------|
| **SaaS Launch Kit** | Nguyen landing | Software with pricing, features, FAQ, and a changelog story |
| **Portfolio Launch Kit** | Smith portfolio | Creative work, case studies, reel, about, and contact |

## Workflow
1. Choose an idea that matches how you want to make money (subscription, services, bookings, etc.).
2. Copy the prompt into your coding agent. It tells you what to say in each section and how to rename the product.
3. Swap placeholders and assets. Keep the template structure unless the prompt says otherwise.

You are not locked into the demo niche (generic SaaS or generic designer). Each prompt below is a **full repositioning** for a specific market.`,
  },
  {
    id: 'saas-ai-support-inbox',
    section: 'SaaS Launch Kit · product ideas',
    title: 'AI support inbox for ecommerce brands',
    body: `## The product
**[BRAND]** is a B2B tool that sits on top of Shopify (or similar) and drafts replies, tags urgency, and surfaces order context before a human sends. Buyers are lean support teams at $1M–$20M DTC brands paying per seat or per ticket volume.

## Who pays & why now
Support leads are drowning in repetitive "where is my order?" mail. You sell **time back** and **consistent tone**, not "AI magic."

## Map the Nguyen sections
| Section | Your version |
|---------|----------------|
| Hero | "Resolve tickets in half the time" + integration strip (Shopify, Gmail, Zendesk logos) |
| Features | Order sidebar, suggested reply, macros, QA review queue |
| Solution | 3 steps: Connect store → Train on past tickets → Agent approves sends |
| Testimonials | Support manager quotes mentioning CSAT or first-response time |
| Pricing | Starter (1 store), Growth (3 stores + analytics), Scale (SSO) |
| FAQ | Data retention, PII, human-in-the-loop, refund policy |

## Copy angles (use in data.ts)
- Tagline: "Support that knows every order."
- Primary CTA: Start free trial → [PRIMARY_HREF]
- Pricing CTA: [CHECKOUT_URL] or /sign-up

${saasShipBlock()}`,
  },
  {
    id: 'saas-clinic-booking',
    section: 'SaaS Launch Kit · product ideas',
    title: 'Online booking for clinics and salons',
    body: `## The product
**[BRAND]** lets independent clinics, med spas, and salons take bookings, deposits, and reminder texts without enterprise scheduling software. Monetize per location or per practitioner.

## Who pays
Owners who currently use phone + spreadsheet. They want **fewer no-shows** and **online payments**, not another EHR.

## Map the Nguyen sections
| Section | Your version |
|---------|----------------|
| Hero | "Fill your calendar without the front-desk chaos" + mobile booking mock |
| Features | Calendar sync, SMS reminders, intake forms, deposit at booking |
| Solution | Patient books → pays deposit → staff gets digest |
| Testimonials | Salon owner / clinic manager in a specific city |
| Pricing | Solo chair, Studio (up to 5 staff), Multi-location |
| FAQ | Cancellation policy, HIPAA-ish language placeholder, SMS compliance |

## Visual tone
Warm, trustworthy, soften Nguyen's default tech-blue if needed via \`nguyen-theme.css\` tokens (still scoped to \`.nguyen-template\`).

${saasShipBlock()}`,
  },
  {
    id: 'saas-creator-sponsorship-crm',
    section: 'SaaS Launch Kit · product ideas',
    title: 'Sponsorship CRM for creators and podcasters',
    body: `## The product
**[BRAND]** helps creators track inbound brand deals, deliverables, rates, and payment status, a lightweight CRM built for sponsorships, not Salesforce.

## Who pays
Creators with 50k–500k audience doing 2–10 deals per quarter; small podcast networks.

## Map the Nguyen sections
| Section | Your version |
|---------|----------------|
| Hero | "Know exactly what's due to every brand partner" |
| Features | Deal pipeline, asset checklist, rate card, payment reminders |
| Solution | Inbound lead → contract template → delivered → paid |
| Testimonials | Creator + podcast producer quotes |
| Pricing | Solo creator, Team (manager seat), Network (shared roster) |
| FAQ | Contracts disclaimer, export data, integrate with Stripe invoicing |

## Differentiation line
You are **not** a media kit host, you are **operations** after the brand says yes.

${saasShipBlock()}`,
  },
  {
    id: 'saas-inventory-dtc',
    section: 'SaaS Launch Kit · product ideas',
    title: 'Inventory forecasting for small consumer brands',
    body: `## The product
**[BRAND]** connects Shopify + warehouse CSVs to forecast stockouts and suggest reorder quantities for SKU-heavy DTC labels.

## Who pays
Ops/finance person at a brand doing $500k–$5M revenue tired of Excel nightmares before peak season.

## Map the Nguyen sections
| Section | Your version |
|---------|----------------|
| Hero | "Stop guessing reorder dates" + chart snippet |
| Features | SKU health, lead time modeling, PO drafts, Slack alerts |
| Solution | Connect channels → baseline forecast → weekly action list |
| Testimonials | "Saved our Black Friday" style quotes |
| Pricing | By connected SKU count or order volume tiers |
| FAQ | Data refresh cadence, multi-warehouse, accuracy disclaimer |

## Pricing page tip
Show a **calculator row** in data (e.g. "Up to 200 SKUs"), fits Nguyen pricing cards without new components.

${saasShipBlock()}`,
  },
  {
    id: 'saas-compliance-vault',
    section: 'SaaS Launch Kit · product ideas',
    title: 'Compliance document vault for early-stage fintech',
    body: `## The product
**[BRAND]** is a secure workspace for policies, vendor reviews, and audit evidence aimed at seed–Series B fintechs preparing for SOC2 or partner bank reviews.

## Who pays
Founder or first ops hire who cannot afford a six-figure GRC platform yet.

## Map the Nguyen sections
| Section | Your version |
|---------|----------------|
| Hero | "Investor-ready compliance without the enterprise tax" |
| Features | Policy templates, evidence requests, vendor questionnaire tracker |
| Solution | Import policies → assign owners → export audit packet |
| Testimonials | Fintech COO / fractional CISO quotes (placeholder names OK) |
| Pricing | Startup, Growth (SSO), Custom audit support |
| FAQ | Encryption, retention, not legal advice disclaimer |

## Trust design
Lean on testimonials + FAQ; avoid flashy motion on security claims.

${saasShipBlock()}`,
  },
  {
    id: 'saas-agency-client-portal',
    section: 'SaaS Launch Kit · product ideas',
    title: 'White-label client portal for marketing agencies',
    body: `## The product
**[BRAND]** gives agencies a branded hub where clients see campaign results, approvals, and invoices, agencies resell it as "our platform."

## Who pays
10–40 person performance marketing or SEO shops losing threads in email.

## Map the Nguyen sections
| Section | Your version |
|---------|----------------|
| Hero | "Your clients log in here, not your inbox" |
| Features | Dashboard embeds, approval workflows, file drop, MRR reporting |
| Solution | Agency connects ad accounts → clients get read-only views |
| Testimonials | Agency founder quotes on churn reduction |
| Pricing | Per client seat or per agency workspace tiers |
| FAQ | White-label domain, data sources, cancellation |

## Positioning
Sell **retention** and **perceived sophistication**, not features.

${saasShipBlock()}`,
  },
  {
    id: 'saas-cohort-course',
    section: 'SaaS Launch Kit · product ideas',
    title: 'Cohort-based course platform (marketing site)',
    body: `## The product
**[BRAND]** runs live cohort courses (design, engineering career, founder skills). This landing is the **marketing layer**; checkout might be Stripe, Lemon Squeezy, or an external LMS link.

## Who pays
Students buying a $500–$2k cohort; secondary audience is employers sponsoring seats.

## Map the Nguyen sections
| Section | Your version |
|---------|----------------|
| Hero | Cohort name + start date + "Applications open" |
| Features | Curriculum weeks, mentor access, community, certificate |
| Solution | Apply → interview → onboard → alumni network |
| Testimonials | Alumni outcomes (role change, salary band, use responsible placeholders) |
| Pricing | Single cohort price or payment plan; FAQ on refunds |
| FAQ | Time commitment, prerequisites, scholarship line |

## Changelog route
Use \`/changelog\` for **curriculum updates** or past cohort launches.

${saasShipBlock()}`,
  },
  {
    id: 'saas-open-source-observability',
    section: 'SaaS Launch Kit · product ideas',
    title: 'Open-source observability tool + hosted cloud',
    body: `## The product
**[BRAND]** is an OSS library or agent (traces, logs, or RUM) with a **hosted** tier for storage, alerting, and team features, classic devtool monetization.

## Who pays
Engineering teams who self-host until they want managed retention and SSO.

## Map the Nguyen sections
| Section | Your version |
|---------|----------------|
| Hero | GitHub stars social proof + "Deploy in 5 minutes" |
| Features | Self-host vs cloud comparison table in Solution |
| Testimonials | Staff engineer quotes |
| Pricing | Free self-hosted, Pro cloud, Enterprise |
| FAQ | License, data residency, export |
| Nav | GitHub external link + Docs + Changelog |

## Changelog
Ship \`app/changelog/page.tsx\` with real semver entries, critical for dev buyers.

${saasShipBlock()}`,
  },
  {
    id: 'portfolio-wedding-photo',
    section: 'Portfolio Launch Kit · product ideas',
    title: 'Wedding and event photography studio',
    body: `## The product
**[BRAND]** is a photography studio site that sells **trust and taste**, couples book $3k–$15k packages from the portfolio and testimonials, not from feature lists.

## Who pays
Engaged couples; secondary: planners referring vendors.

## Map the Smith sections
| Section | Your version |
|---------|----------------|
| Hero | Reel or hero still from a real wedding; soft serif display font |
| Works | 6–9 weddings as case studies with venue + season |
| About | Photographer story, second shooter, travel policy |
| Journal | "A day in the life" or venue guides (SEO-friendly) |
| Contact | Inquiry form tone; [EMAIL]; response time promise |
| Stats | Years shooting, countries, weddings delivered |

## Case studies (\`/work/[slug]\`)
Each slug: couple names (or anonymized), venue, film vs digital, gallery highlights.

${portfolioShipBlock()}`,
  },
  {
    id: 'portfolio-architecture',
    section: 'Portfolio Launch Kit · product ideas',
    title: 'Boutique architecture practice',
    body: `## The product
**[BRAND]** presents residential or civic architecture work, process-heavy case studies matter more than motion flair.

## Who pays
Homeowners and small commercial clients researching firms; competition is other local studios.

## Map the Smith sections
| Section | Your version |
|---------|----------------|
| Hero | Signature project exterior; restrained typography |
| Works | Project type tags: Residential, Cultural, Interior |
| About | Principals, sustainability statement, awards |
| Stats | Built sq ft, years practice, continents |
| Contact | RFP-friendly [EMAIL]; office city |

## Case study content
Problem (brief, zoning, site), drawings/photos, materials palette, outcome.

${portfolioShipBlock()}`,
  },
  {
    id: 'portfolio-documentary-film',
    section: 'Portfolio Launch Kit · product ideas',
    title: 'Independent documentary filmmaker',
    body: `## The product
**[BRAND]** showcases films, trailers, festivals, and grant support, video-forward Smith layout with [MUX_URL] on hero and case studies.

## Who pays
Festivals, grants, streaming buyers, and commission clients (brands, nonprofits).

## Map the Smith sections
| Section | Your version |
|---------|----------------|
| Hero | Trailer autoplay muted; festival laurels row |
| Works | One slug per film: logline, runtime, director statement |
| Journal | Production notes, behind-the-scenes stills |
| About | Bio, collaborators, representation [EMAIL] |
| Contact | Press kit download link optional |

## Technical note
Context7 \`query-docs\` for \`next/image\` remote patterns if stills live on a CDN.

${portfolioShipBlock()}`,
  },
  {
    id: 'portfolio-brand-identity',
    section: 'Portfolio Launch Kit · product ideas',
    title: 'Brand identity and visual systems designer',
    body: `## The product
**[BRAND]** is a solo or duo studio selling logos, identity systems, and brand guidelines to startups and culture brands.

## Who pays
Founders post-raise and marketing leads refreshing a stale brand.

## Map the Smith sections
| Section | Your version |
|---------|----------------|
| Hero | Montage of mark animations or identity boards |
| Works | Case studies: challenge → system → applications (packaging, web, social) |
| Explorations | Personal experiments (Smith section), shows range |
| About | Studio ethos, clients, tools |
| Contact | Project fit questions in form copy |

## Case study depth
Show **before/after**, color type stack, voice snippet, text in constants, images in \`public/\`.

${portfolioShipBlock()}`,
  },
  {
    id: 'portfolio-executive-coach',
    section: 'Portfolio Launch Kit · product ideas',
    title: 'Executive leadership coach',
    body: `## The product
**[BRAND]** sells **1:1 and group coaching** to VPs and founders, the site is credibility: methodology, client types, booking.

## Who pays
Individuals (company reimburses) or HR/L&D buying cohort programs.

## Map the Smith sections
| Section | Your version |
|---------|----------------|
| Hero | Calm portrait; headline about clarity under pressure |
| Works | Rename mentally to **Programs**, "Founder transition", "New VP onboarding" |
| Stats | Years coaching, executives served, industries |
| About | Credentials, philosophy, boundaries (not therapy disclaimer) |
| Contact | Link to Calendly [PRIMARY_HREF] or [EMAIL] |

## Simplify
Consider hiding Journal or Explorations if empty, edit \`smith-template.tsx\` orchestrator.

${portfolioShipBlock()}`,
  },
  {
    id: 'portfolio-craft-maker',
    section: 'Portfolio Launch Kit · product ideas',
    title: 'Ceramicist / small-batch maker shop',
    body: `## The product
**[BRAND]** blends portfolio and **limited drops**, work gallery plus link to Etsy/Shopify for purchase.

## Who pays
Collectors and gift buyers; wholesale inquiries from boutiques.

## Map the Smith sections
| Section | Your version |
|---------|----------------|
| Hero | Studio process clip or kiln shot |
| Works | Collections by glaze series or season |
| Journal | Studio diary, restock announcements |
| About | Maker story, materials, sustainability |
| Contact | Wholesale [EMAIL]; link secondary CTA to shop URL |

## Commerce
Pricing section not needed, use header CTA "Shop" → external store.

${portfolioShipBlock()}`,
  },
  {
    id: 'portfolio-music-producer',
    section: 'Portfolio Launch Kit · product ideas',
    title: 'Music producer and mix engineer',
    body: `## The product
**[BRAND]** wins **artists and labels** with credits, audio reels, and services (production, mixing, mastering).

## Who pays
Independent artists, managers, small labels.

## Map the Smith sections
| Section | Your version |
|---------|----------------|
| Hero | Looping reel, [MUX_URL] or audio waveform visual |
| Works | Projects as slug pages: artist (with permission), role, streaming link |
| Stats | Streams aided, genres, years |
| Contact | Booking [EMAIL]; link to Discography Spotify |

## Case study pages
Embed Spotify or Bandcamp if allowed; otherwise stills + quote from artist.

${portfolioShipBlock()}`,
  },
  {
    id: 'portfolio-ux-research',
    section: 'Portfolio Launch Kit · product ideas',
    title: 'UX research consultancy',
    body: `## The product
**[BRAND]** sells moderated studies, diary studies, and insight workshops to product teams, case studies must show **impact**, not just screens.

## Who pays
Head of Product / Design at Series A–C startups.

## Map the Smith sections
| Section | Your version |
|---------|----------------|
| Hero | "Decisions your team can defend" + client logos |
| Works | Research question → method → insight → shipped change |
| About | Team, ethics, recruitment approach |
| Contact | Study scoping [EMAIL] |

## Case study template
Include methodology tags (usability, concept test, ethnography) in constants for filtering.

${portfolioShipBlock()}`,
  },
  {
    id: 'portfolio-motion-studio',
    section: 'Portfolio Launch Kit · product ideas',
    title: 'Motion design studio for product launches',
    body: `## The product
**[BRAND]** creates launch films, UI motion, and social cutdowns for tech companies, fast-paced Smith reel with tight case studies.

## Who pays
Product marketing and brand teams at startups preparing launches.

## Map the Smith sections
| Section | Your version |
|---------|----------------|
| Hero | High-energy reel; [MUX_URL] |
| Works | Client, deliverables list (hero film, 6 assets, toolkit) |
| Explorations | Personal loops, proves craft |
| Contact | RFP [EMAIL]; show availability quarter |

## Performance
Prefer poster images + lazy HLS; Context7 if tuning \`next/image\` sizes for LCP.

${portfolioShipBlock()}`,
  },
];

export function getTransformationPrompts(): KitPrompt[] {
  return transformationPrompts;
}
