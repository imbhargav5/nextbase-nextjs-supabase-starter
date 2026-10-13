import { describe, expect, test } from 'vitest';
import { createSuspenseResource } from './createSuspenseResource';

describe('createSuspenseResource', () => {
  test('throws the pending suspender before returning resolved data', async () => {
    const resource = createSuspenseResource(Promise.resolve('ready'));

    expect(() => resource.read()).toThrow(Promise);

    await expect(async () => resource.read()).rejects.toBeInstanceOf(Promise);
    await Promise.resolve();

    expect(resource.read()).toBe('ready');
  });

  test('throws the rejection reason after the promise rejects', async () => {
    const error = new Error('load failed');
    const resource = createSuspenseResource(Promise.reject(error));

    await expect(async () => resource.read()).rejects.toBeInstanceOf(Promise);
    await Promise.resolve();

    expect(() => resource.read()).toThrow(error);
  });
});
