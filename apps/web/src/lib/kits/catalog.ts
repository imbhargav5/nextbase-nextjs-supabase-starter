export type KitProductStatus = 'available' | 'coming-soon';

export type KitTemplatePageStatus = 'live' | 'scaffold' | 'coming-soon';

export interface KitThemeSwatch {
  label: string;
  color: string;
}

export interface KitDesignTheme {
  mode: 'light' | 'dark';
  bodyFont: string;
  displayFont?: string;
  swatches: KitThemeSwatch[];
  accentNote: string;
}

export interface KitTemplateSection {
  title: string;
  /** Hash on the preview route, when the section is on that page */
  anchor?: string;
  /** Kit prompt id (`lib/kits/prompts`) for this section */
  promptId: string;
}

export interface KitTemplatePage {
  title: string;
  description: string;
  path: string;
  status: KitTemplatePageStatus;
  sections: KitTemplateSection[];
}

export interface KitProduct {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  priceDisplay: string;
  status: KitProductStatus;
  tags: string[];
  includes: string[];
  promptCount: number;
  demoSlug: string;
  designTheme: KitDesignTheme;
  templatePages: KitTemplatePage[];
  stack: string[];
}

/** Purchasable prompt + multi-page template bundles (`/kit/[slug]`). */
export const kitProductCatalog: KitProduct[] = [
  {
    slug: 'saas-launch-kit',
    name: 'SaaS Launch Kit',
    tagline: 'Ship a credible B2B landing site with pricing and FAQ.',
    description:
      'Nguyen is a full marketing site in Next.js: landing and changelog, with agent prompts for every page and section.',
    priceDisplay: '$49',
    status: 'available',
    tags: ['SaaS', 'B2B', 'Next.js'],
    promptCount: 11,
    demoSlug: 'nguyen',
    designTheme: {
      mode: 'light',
      bodyFont: 'Inter',
      displayFont: 'Inter',
      accentNote: 'Cool indigo beams on soft white surfaces',
      swatches: [
        { label: 'Background', color: 'oklch(0.99 0.005 260)' },
        { label: 'Primary', color: 'oklch(0.52 0.18 250)' },
        { label: 'Beam', color: 'oklch(0.58 0.18 250)' },
        { label: 'Muted', color: 'oklch(0.48 0.02 260)' },
        { label: 'Card', color: 'oklch(1 0 0)' },
      ],
    },
    templatePages: [
      {
        title: 'Marketing landing',
        description: 'Full homepage from hero through FAQ.',
        path: '/templates/nguyen',
        status: 'live',
        sections: [
          { title: 'Navigation', anchor: 'top', promptId: 'hero-cta' },
          { title: 'Hero', promptId: 'hero-cta' },
          { title: 'Features', promptId: 'features-bento' },
          { title: 'Solution narrative', promptId: 'features-bento' },
          { title: 'Testimonials', promptId: 'social-proof' },
          { title: 'Pricing', promptId: 'pricing-faq' },
          { title: 'FAQ', anchor: 'faq', promptId: 'pricing-faq' },
          { title: 'Footer', promptId: 'master-saas-landing' },
        ],
      },
      {
        title: 'Changelog',
        description: 'Dated releases with tags.',
        path: '/templates/nguyen/changelog',
        status: 'live',
        sections: [
          { title: 'Page header', promptId: 'changelog-page' },
          { title: 'Release feed', promptId: 'changelog-page' },
          { title: 'Tag pills', promptId: 'changelog-page' },
        ],
      },
    ],
    stack: ['Next.js App Router', 'Tailwind CSS v4', 'Motion', 'shadcn/ui'],
    includes: [
      'Section prompts: design system, hero, features, proof, pricing, FAQ, changelog',
      'Nguyen template: live marketing landing and changelog',
      'Ship checklist: routes, metadata, sitemap, and env wiring',
      'Brand placeholders: [BRAND], [TAGLINE], and tier copy',
    ],
  },
  {
    slug: 'portfolio-launch-kit',
    name: 'Portfolio Launch Kit',
    tagline: 'Cinematic portfolio site with motion and case studies.',
    description:
      'Smith is a dark portfolio: home, about, and case studies, with prompts for video hero, parallax, and production routes.',
    priceDisplay: '$49',
    status: 'available',
    tags: ['Portfolio', 'Motion', 'Creative'],
    promptCount: 12,
    demoSlug: 'smith',
    designTheme: {
      mode: 'dark',
      bodyFont: 'Inter',
      displayFont: 'Instrument Serif',
      accentNote: 'Steel-blue gradient accents on near-black canvas',
      swatches: [
        { label: 'Background', color: 'hsl(0 0% 4%)' },
        { label: 'Surface', color: 'hsl(0 0% 8%)' },
        { label: 'Text', color: 'hsl(0 0% 96%)' },
        { label: 'Accent A', color: '#89AACC' },
        { label: 'Accent B', color: '#4E85BF' },
      ],
    },
    templatePages: [
      {
        title: 'Portfolio home',
        description: 'Single-page flow with motion and video.',
        path: '/templates/smith',
        status: 'live',
        sections: [
          { title: 'Loading ritual', promptId: 'loading-screen' },
          { title: 'Hero + HLS video', anchor: 'home', promptId: 'hero-hls' },
          { title: 'Floating nav', promptId: 'hero-hls' },
          { title: 'Selected work', anchor: 'work', promptId: 'selected-works' },
          { title: 'Journal', promptId: 'journal' },
          { title: 'Explorations parallax', promptId: 'explorations-parallax' },
          { title: 'Stats', anchor: 'resume', promptId: 'stats-footer' },
          { title: 'Contact footer', anchor: 'contact', promptId: 'stats-footer' },
        ],
      },
      {
        title: 'About',
        description: 'Bio and capabilities.',
        path: '/templates/smith/about',
        status: 'live',
        sections: [
          { title: 'Intro', promptId: 'about-page' },
          { title: 'Capabilities grid', promptId: 'about-page' },
          { title: 'Availability CTA', promptId: 'about-page' },
        ],
      },
      {
        title: 'Case study',
        description: 'Long-form project story.',
        path: '/templates/smith/work/automotive-motion',
        status: 'live',
        sections: [
          { title: 'Project hero', promptId: 'case-study-page' },
          { title: 'Challenge & approach', promptId: 'case-study-page' },
          { title: 'Outcomes', promptId: 'case-study-page' },
        ],
      },
    ],
    stack: [
      'Next.js App Router',
      'Tailwind CSS v4',
      'Motion',
      'GSAP',
      'hls.js',
    ],
    includes: [
      'Section prompts: tokens, loading, HLS hero, work, journal, parallax, footer',
      'Smith template: live portfolio home, about, and case study pages',
      'Motion stack: Mux HLS, GSAP ScrollTrigger, and Motion micro-interactions',
      'Ship checklist: routes, performance, a11y, and brand placeholders',
    ],
  },
];

export function getKitProductBySlug(slug: string) {
  return kitProductCatalog.find((kit) => kit.slug === slug);
}

export function getAvailableKitProducts() {
  return kitProductCatalog.filter((kit) => kit.status === 'available');
}

export function getKitByDemoSlug(demoSlug: string) {
  return kitProductCatalog.find((kit) => kit.demoSlug === demoSlug);
}

export function getPrimaryTemplateDemoPath(kit: KitProduct): string {
  const live = kit.templatePages.find((page) => page.status === 'live');
  return live?.path ?? `/templates/${kit.demoSlug}`;
}
