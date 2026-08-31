import { AboutCTA } from './about-cta';
import { AboutFeaturesGrid } from './about-features-grid';
import { AboutHero } from './about-hero';
import { AboutTechStack } from './about-tech-stack';

const technologies = [
  'Next.js 16',
  'TypeScript',
  'Supabase',
  'Tailwind CSS 4',
  'shadcn/ui',
  'React Hook Form',
  'Zod',
  'Turborepo',
];

export default function About() {
  return (
    <div className="mx-auto max-w-7xl space-y-20 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <AboutHero />
      <AboutFeaturesGrid />
      <AboutTechStack technologies={technologies} />
      <AboutCTA />
    </div>
  );
}
