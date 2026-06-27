import { expect, test } from 'vitest';
import { NotFoundError, ValidationError } from './utils/effect-errors';
import { getErrorMessage } from './utils/effect-bridge';

test('formats validation errors with field context', () => {
  const error = new ValidationError({
    field: 'email',
    message: 'Must be valid',
  });

  expect(getErrorMessage(error)).toBe('email: Must be valid');
});

test('falls back to resource context for not found errors', () => {
  const error = new NotFoundError({
    message: '',
    resource: 'Private item',
  });

  expect(getErrorMessage(error)).toBe('Private item not found');
});
