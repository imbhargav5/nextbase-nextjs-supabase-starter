'use client';

import SpotlightCard from '@/components/SpotlightCard';
import ShinyText from '@/components/ShinyText';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function HomeCTA() {
  return (
    <section className="py-20 px-4">
      <SpotlightCard
        className="max-w-2xl mx-auto bg-gradient-to-br from-neutral-900 to-neutral-950 border-neutral-800 text-white p-10 text-center"
        spotlightColor="rgba(255, 255, 255, 0.2)"
      >
        <div className="flex flex-col gap-4 items-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            <ShinyText
              text="Ready to build?"
              className="font-bold text-white"
              color="#ffffff"
              shineColor="#38bdf8"
            />
          </h2>
          <p className="text-white/80">
            Start with a solid foundation and ship faster.
          </p>
          <Button asChild size="lg">
            <Link href="/sign-up">
              Start for free <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </SpotlightCard>
    </section>
  );
}
