import { expect, test } from 'vitest';
import {
  DatabaseError,
  NotFoundError,
  ValidationError,
} from './utils/effect-errors';
import { getErrorMessage } from './utils/effect-bridge';

test('formats validation errors with a field prefix', () => {
  const message = getErrorMessage(
    new ValidationError({
      field: 'email',
      message: 'Must be a valid email address',
    })
  );

  expect(message).toBe('email: Must be a valid email address');
});

test('uses resource names for not found errors without a message', () => {
  const message = getErrorMessage(
    new NotFoundError({
      message: '',
      resource: 'Private item',
    })
  );

  expect(message).toBe('Private item not found');
});

test('falls back for database errors without a message', () => {
  const message = getErrorMessage(new DatabaseError({ message: '' }));

  expect(message).toBe('A database error occurred');
});
