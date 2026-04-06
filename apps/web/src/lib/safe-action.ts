import { getLoggedInUserId } from '@/data/user/user';
import { createSafeActionClient } from 'next-safe-action';
import 'server-only';

export const actionClient = createSafeActionClient().use(
  async ({ next, clientInput, metadata }) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('LOGGING MIDDLEWARE');

      const startTime = performance.now();

      // Here we await the action execution.
      const result = await next();

      const endTime = performance.now();

      console.log('Result ->', result);
      console.log('Client input ->', clientInput);
      console.log('Metadata ->', metadata);
      console.log('Action execution took', endTime - startTime, 'ms');

      return result;
    } else {
      // In production, just execute the action without logging
      return await next();
    }
  }
);

export const authActionClient = actionClient.use(async ({ next }) => {
  const userId = await getLoggedInUserId();
  return await next({
    ctx: {
      userId,
    },
  });
});
