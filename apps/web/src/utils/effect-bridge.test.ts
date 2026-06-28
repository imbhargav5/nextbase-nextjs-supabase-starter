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

test('getErrorMessage includes validation field names', () => {
  expect(
    getErrorMessage(
      new ValidationError({ field: 'email', message: 'Email is required' })
    )
  ).toBe('email: Email is required');
});
