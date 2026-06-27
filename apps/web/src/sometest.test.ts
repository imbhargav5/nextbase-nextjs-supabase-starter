import { expect, test } from 'vitest';

import { cn } from './utils/cn';

test('cn combines conditional class names', () => {
  const isHidden = false;

  expect(cn('flex', isHidden && 'hidden', ['items-center'])).toBe(
    'flex items-center',
  );
});

test('cn resolves conflicting tailwind classes', () => {
  expect(cn('p-2 text-sm', 'p-4')).toBe('text-sm p-4');
});
