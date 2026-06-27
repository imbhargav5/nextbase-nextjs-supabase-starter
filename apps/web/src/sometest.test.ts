import { expect, test } from 'vitest';
import {
  AuthenticationError,
  DatabaseError,
  NetworkError,
  NotFoundError,
  ValidationError,
} from './utils/effect-errors';
import { getErrorMessage } from './utils/effect-bridge';

test('getErrorMessage returns specific fallback messages', () => {
  expect(getErrorMessage(new DatabaseError({ message: '' }))).toBe(
    'A database error occurred'
  );
  expect(
    getErrorMessage(new NotFoundError({ message: '', resource: 'Project' }))
  ).toBe('Project not found');
  expect(getErrorMessage(new ValidationError({ message: '' }))).toBe(
    'Validation failed'
  );
  expect(getErrorMessage(new AuthenticationError({ message: '' }))).toBe(
    'Authentication failed'
  );
  expect(getErrorMessage(new NetworkError({ message: '' }))).toBe(
    'A network error occurred'
  );
});
