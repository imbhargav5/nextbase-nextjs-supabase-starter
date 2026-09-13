import { Suspense } from 'react';

import { SmithTemplate } from '@/components/templates/smith';

export const metadata = {
  title: 'Smith — Dark portfolio landing',
  description:
    'Cinematic portfolio template with HLS video hero, GSAP scroll motion, and Motion-driven micro-interactions — Next.js App Router.',
};

export default function SmithTemplatePage() {
  return (
    <Suspense fallback={null}>
      <SmithTemplate />
    </Suspense>
  );
}
