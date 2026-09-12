'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { PerlinNoiseShaderBackground } from '@/components/ui/perlin-noise-shader-background';

export function HomeHeroBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || resolvedTheme !== 'dark') {
    return null;
  }

  return <PerlinNoiseShaderBackground className="absolute inset-0 -z-10" />;
}
