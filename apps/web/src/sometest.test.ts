import { expect, test } from 'vitest';

import { classNames } from './utils/classNames';

test('classNames joins provided class names', () => {
  expect(classNames('flex', 'items-center', 'gap-2')).toBe(
    'flex items-center gap-2',
  );
});

test('classNames omits undefined class names', () => {
  expect(classNames('px-4', undefined, 'text-sm')).toBe('px-4 text-sm');
});
