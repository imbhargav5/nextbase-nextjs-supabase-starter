import { expect, test } from 'vitest';
import { ValidationError } from './utils/effect-errors';
import { getErrorMessage } from './utils/effect-bridge';

test('formats validation errors with field context', () => {
  const error = new ValidationError({
    field: 'email',
    message: 'Invalid email address',
  });

  expect(getErrorMessage(error)).toBe('email: Invalid email address');
});
