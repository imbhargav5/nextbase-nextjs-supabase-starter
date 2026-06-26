import { expect, test } from 'vitest';

import { cn } from './lib/utils';

test('cn merges conditional class names', () => {
  const isHidden = false;

  expect(cn('flex', isHidden && 'hidden', ['items-center', 'gap-2'])).toBe(
    'flex items-center gap-2'
  );
});

test('cn resolves conflicting Tailwind classes', () => {
  expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
});
