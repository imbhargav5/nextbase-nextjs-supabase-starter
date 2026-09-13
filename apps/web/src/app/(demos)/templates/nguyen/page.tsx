import { Suspense } from 'react';

import { NguyenTemplate } from '@/components/templates/nguyen/nguyen-template';

export const metadata = {
  title: 'Nguyen: The unified workspace for AI-native teams',
  description:
    'Route tasks to the right AI, automate workflows, and keep your team in sync from idea to production.',
};

export default function NguyenTemplatePage() {
  return (
    <Suspense fallback={null}>
      <NguyenTemplate />
    </Suspense>
  );
}
