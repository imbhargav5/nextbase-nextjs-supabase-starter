import { expect, test } from 'vitest';
import { toDateTime } from './helpers';

test('helpers: toDateTime should return a date object', () => {
  const date = new Date();
  const dateObject = toDateTime(date.getTime());
  expect(dateObject).toBeInstanceOf(Date);
});
