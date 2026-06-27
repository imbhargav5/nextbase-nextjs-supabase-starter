import { expect, test } from 'vitest';
import { classNames } from './utils/classNames';

test('classNames joins truthy class names', () => {
  expect(classNames('flex', undefined, 'items-center')).toBe(
    'flex items-center',
  );
});
