export const SMITH_MUX_HLS =
  'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8';

export const SMITH_TEMPLATE_BASE = '/templates/smith';

export const smithNavLinks = [
  { id: 'home', label: 'Home', href: `${SMITH_TEMPLATE_BASE}#home` },
  { id: 'work', label: 'Work', href: `${SMITH_TEMPLATE_BASE}#work` },
  {
    id: 'about',
    label: 'About',
    href: `${SMITH_TEMPLATE_BASE}/about`,
  },
  { id: 'resume', label: 'Resume', href: `${SMITH_TEMPLATE_BASE}#resume` },
] as const;

export function smithProjectSlug(title: string) {
  return title.toLowerCase().replace(/\s+/g, '-');
}

export const smithRoles = ['Creative', 'Fullstack', 'Founder', 'Scholar'] as const;

export const smithLoadingWords = ['Design', 'Create', 'Inspire'] as const;

export const smithProjects = [
  {
    title: 'Automotive Motion',
    image:
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=80',
    span: 'md:col-span-7',
    aspect: 'aspect-[16/10]',
  },
  {
    title: 'Urban Architecture',
    image:
      'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=80',
    span: 'md:col-span-5',
    aspect: 'aspect-[4/5]',
  },
  {
    title: 'Human Perspective',
    image:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80',
    span: 'md:col-span-5',
    aspect: 'aspect-[4/5]',
  },
  {
    title: 'Brand Identity',
    image:
      'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=80',
    span: 'md:col-span-7',
    aspect: 'aspect-[16/10]',
  },
] as const;

export const smithJournal = [
  {
    title: 'Designing for motion at scale',
    readTime: '6 min',
    date: 'Mar 2026',
    image:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80',
  },
  {
    title: 'Systems thinking in product teams',
    readTime: '4 min',
    date: 'Feb 2026',
    image:
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80',
  },
  {
    title: 'The craft of interface typography',
    readTime: '8 min',
    date: 'Jan 2026',
    image:
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80',
  },
  {
    title: 'Shipping without losing the soul',
    readTime: '5 min',
    date: 'Dec 2025',
    image:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80',
  },
] as const;

export const smithExplorations = [
  'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=600&q=80',
  'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&q=80',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80',
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  'https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&q=80',
] as const;

export const smithStats = [
  { value: '20+', label: 'Years Experience' },
  { value: '95+', label: 'Projects Done' },
  { value: '200%', label: 'Satisfied Clients' },
] as const;

export interface SmithCaseStudy {
  title: string;
  heroImage: string;
  aspect: string;
  roleTags: readonly string[];
  challenge: string;
  approach: readonly string[];
  outcomes: readonly { label: string; value: string }[];
  gallery: readonly string[];
}

export const smithCaseStudies: Record<string, SmithCaseStudy> = {
  'automotive-motion': {
    title: 'Automotive Motion',
    heroImage: smithProjects[0].image,
    aspect: smithProjects[0].aspect,
    roleTags: ['Art direction', 'Motion', 'Frontend'],
    challenge:
      'A legacy OEM site treated every vehicle like a static brochure. The launch campaign needed kinetic hero moments and configurators that still felt premium on mobile networks across global markets.',
    approach: [
      'Mapped scroll chapters to a modular scene graph so art could swap without redeploying code.',
      'Built a WebGL-free motion stack with CSS transforms and Lottie for dealer-grade performance.',
      'Shipped a tokenized theme layer so regional teams could recolor trims without touching layout.',
    ],
    outcomes: [
      { label: 'Largest contentful paint', value: '1.1s' },
      { label: 'Configurator completion', value: '+38%' },
      { label: 'Dealer adoption', value: '12 regions' },
    ],
    gallery: [
      smithProjects[0].image,
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&q=80',
      'https://images.unsplash.com/photo-1542362567-b07e54358753?w=900&q=80',
    ],
  },
  'urban-architecture': {
    title: 'Urban Architecture',
    heroImage: smithProjects[1].image,
    aspect: smithProjects[1].aspect,
    roleTags: ['Brand', 'WebGL', 'Design systems'],
    challenge:
      'An architecture studio needed a portfolio that communicated spatial scale online. Flat photography was underselling the work, but heavy WebGL would alienate procurement teams on corporate laptops.',
    approach: [
      'Prototyped parallax depth with layered stills before committing to selective WebGL accents.',
      'Authored a typographic system that mirrors blueprint grids at desktop and collapses cleanly on phones.',
      'Integrated a CMS-friendly case study schema so partners could publish without engineering.',
    ],
    outcomes: [
      { label: 'Qualified leads', value: '+52%' },
      { label: 'Session depth', value: '4.2 pages' },
      { label: 'CMS publish time', value: '15 min' },
    ],
    gallery: [
      smithProjects[1].image,
      'https://images.unsplash.com/photo-1511818966892-7c671f86f211?w=900&q=80',
      'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=900&q=80',
    ],
  },
  'human-perspective': {
    title: 'Human Perspective',
    heroImage: smithProjects[2].image,
    aspect: smithProjects[2].aspect,
    roleTags: ['Documentary', 'Editorial', 'Accessibility'],
    challenge:
      'A nonprofit documentary series wanted cinematic pacing on the web while meeting strict accessibility requirements for captions, contrast, and reduced motion preferences.',
    approach: [
      'Paired HLS streaming with a transcript-first layout so stories remain readable when video is paused.',
      'Designed motion presets that degrade to static frames when `prefers-reduced-motion` is set.',
      'Built donation flows that share components with the editorial template for consistent trust signals.',
    ],
    outcomes: [
      { label: 'Watch-through rate', value: '+29%' },
      { label: 'WCAG audit', value: 'AA pass' },
      { label: 'Donation uplift', value: '+18%' },
    ],
    gallery: [
      smithProjects[2].image,
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&q=80',
    ],
  },
  'brand-identity': {
    title: 'Brand Identity',
    heroImage: smithProjects[3].image,
    aspect: smithProjects[3].aspect,
    roleTags: ['Identity', 'Design ops', 'Launch'],
    challenge:
      'A consumer hardware startup was launching simultaneously in retail and DTC. The identity system had to feel cohesive from billboard to checkout without slowing the engineering roadmap.',
    approach: [
      'Codified logo, color, and type rules into Figma variables mirrored in Tailwind theme extensions.',
      'Delivered launch templates for email, social, and product detail pages with shared grid logic.',
      'Ran weekly design-engineering critiques until animation specs matched feasible ship dates.',
    ],
    outcomes: [
      { label: 'Time to first deploy', value: '11 days' },
      { label: 'Component reuse', value: '78%' },
      { label: 'Retail partner NPS', value: '64' },
    ],
    gallery: [
      smithProjects[3].image,
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=900&q=80',
      'https://images.unsplash.com/photo-1558655146-d09347e92766?w=900&q=80',
    ],
  },
};

export function getSmithCaseStudy(slug: string) {
  return smithCaseStudies[slug] ?? null;
}
