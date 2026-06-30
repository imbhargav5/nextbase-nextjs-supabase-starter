import { Effect } from 'effect';
import { expect, test } from 'vitest';

import { getErrorMessage, runEffectInAction } from './effect-bridge';
import { ValidationError } from './effect-errors';

test('runEffectInAction resolves successful effects', async () => {
  await expect(runEffectInAction(Effect.succeed('ok'))).resolves.toBe('ok');
});

test('runEffectInAction throws app error messages', async () => {
  await expect(
    runEffectInAction(
      Effect.fail(new ValidationError({ message: 'Name is required' }))
    )
  ).rejects.toThrow('Name is required');
});

test('runEffectInAction falls back when an app error message is empty', async () => {
  await expect(
    runEffectInAction(Effect.fail(new ValidationError({ message: '' })))
  ).rejects.toThrow('An error occurred while processing the request');
});

test('getErrorMessage includes validation field names', () => {
  expect(
    getErrorMessage(
      new ValidationError({ field: 'email', message: 'Email is required' })
    )
  ).toBe('email: Email is required');
});

test('getErrorMessage falls back for fielded validation errors without a message', () => {
  expect(
    getErrorMessage(new ValidationError({ field: 'email', message: '' }))
  ).toBe('email: Validation failed');
});
