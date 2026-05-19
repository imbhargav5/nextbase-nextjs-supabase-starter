import { Separator } from '@/components/ui/separator';
import { ArrowRight, Database, Lock, Palette, Shield, Zap } from 'lucide-react';
import { HomeCTA } from './home-cta';
import { HomeFeatures, type HomeFeature } from './home-features';
import { HomeHero } from './home-hero';

const features: HomeFeature[] = [
  {
    icon: Shield,
    title: 'Type-Safe',
    description: 'End-to-end TypeScript with auto-generated Supabase types. Catch errors at compile time.',
  },
  {
    icon: Zap,
    title: 'Modern Stack',
    description: 'Next.js 16, TypeScript, Supabase, and Tailwind CSS — the best tools for modern web development.',
  },
  {
    icon: Palette,
    title: 'UI Components',
    description: 'Beautiful components built with Radix UI and Tailwind. Accessible and customizable.',
  },
  {
    icon: Lock,
    title: 'Authentication',
    description: 'Magic links, OAuth providers, and email/password with protected routes — all pre-configured.',
  },
  {
    icon: Database,
    title: 'Database Ready',
    description: 'Supabase with Row Level Security, migrations, and seed data — ready for production.',
  },
  {
    icon: ArrowRight,
    title: 'Fast Deployment',
    description: 'Deploy to Vercel in minutes. CI/CD, preview deployments, and automatic type generation included.',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HomeHero />
      <Separator />
      <HomeFeatures features={features} />
      <Separator />
      <HomeCTA />
    </div>
  );
}
