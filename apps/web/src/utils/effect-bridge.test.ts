import { describe, expect, test } from 'vitest';
import {
  AuthenticationError,
  DatabaseError,
  NetworkError,
  NotFoundError,
  ValidationError,
} from './effect-errors';
import { getErrorMessage } from './effect-bridge';

describe('getErrorMessage', () => {
  test('returns specific messages for application errors', () => {
    expect(getErrorMessage(new DatabaseError({ message: 'Query failed' }))).toBe(
      'Query failed'
    );
    expect(
      getErrorMessage(new AuthenticationError({ message: 'Session expired' }))
    ).toBe('Session expired');
    expect(getErrorMessage(new NetworkError({ message: 'Request timed out' }))).toBe(
      'Request timed out'
    );
  });

  test('includes validation field context when available', () => {
    expect(
      getErrorMessage(
        new ValidationError({ field: 'email', message: 'Invalid format' })
      )
    ).toBe('email: Invalid format');
  });

  test('falls back to resource context for missing not-found messages', () => {
    expect(getErrorMessage(new NotFoundError({ message: '', resource: 'Item' }))).toBe(
      'Item not found'
    );
  });
});
