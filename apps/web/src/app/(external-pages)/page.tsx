import { Separator } from '@/components/ui/separator';
import { HomeBento } from './home-bento';
import { HomeCTA } from './home-cta';
import { HomeFeatures } from './home-features';
import { HomeHero } from './home-hero';

export default function HomePage() {
  return (
    <div>
      <HomeHero />
      <Separator />
      <HomeBento />
      <Separator />
      <HomeFeatures />
      <div className="border-t bg-muted/10">
        <HomeCTA />
      </div>
    </div>
  );
}
