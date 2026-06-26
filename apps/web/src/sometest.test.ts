import { expect, test } from 'vitest';

import { classNames } from './utils/classNames';

test('classNames joins truthy class names and omits undefined values', () => {
  expect(classNames('flex', undefined, 'items-center')).toBe(
    'flex items-center'
  );
});
