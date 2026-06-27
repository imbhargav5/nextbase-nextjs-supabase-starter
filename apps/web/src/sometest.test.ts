import { expect, test } from 'vitest';

import { classNames } from './utils/classNames';

test('classNames joins provided class names', () => {
  expect(classNames('flex', 'items-center', 'gap-2')).toBe(
    'flex items-center gap-2'
  );
});

test('classNames skips undefined values', () => {
  expect(classNames('flex', undefined, 'gap-2')).toBe('flex gap-2');
});
