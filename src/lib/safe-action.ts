import { createSupabaseClient } from '@/supabase-clients/server';
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
  const supabase = await createSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) {
    console.log('User error', { cause: userError });
    throw new Error('User error', { cause: userError });
  }
  if (!user) {
    console.log('User not logged in');
    throw new Error('User not logged in');
  }
  return await next({
    ctx: {
      userId: user.id,
    },
  });
});
