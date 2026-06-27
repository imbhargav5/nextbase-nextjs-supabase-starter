import { expect, test } from 'vitest';
import { classNames } from './utils/classNames';

test('classNames joins defined class names with spaces', () => {
  expect(classNames('flex', undefined, 'items-center')).toBe(
    'flex items-center'
  );
});
