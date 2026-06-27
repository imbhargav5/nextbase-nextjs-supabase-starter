import { expect, test } from 'vitest';
import { Effect } from 'effect';
import { runEffectInAction } from './utils/effect-bridge';
import { ValidationError } from './utils/effect-errors';

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
