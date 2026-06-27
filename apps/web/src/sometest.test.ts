import { expect, test } from 'vitest';

import { classNames } from './utils/classNames';

test('classNames joins class names in order', () => {
  expect(classNames('flex', 'items-center', 'gap-2')).toBe(
    'flex items-center gap-2'
  );
});

test('classNames omits undefined entries', () => {
  expect(classNames('text-sm', undefined, 'font-medium')).toBe(
    'text-sm font-medium'
  );
});
