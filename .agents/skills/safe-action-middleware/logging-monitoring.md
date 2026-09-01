# Logging & Monitoring Middleware

> **Note:** Action files require a `"use server"` directive — omitted from examples below for brevity.

## Request Timing

```ts
export const actionClient = createSafeActionClient().use(
  async ({ next, metadata, clientInput }) => {
    const start = performance.now();
    const result = await next();
    const duration = performance.now() - start;

    console.log(
      `[Action] ${metadata?.actionName ?? "unknown"} completed in ${duration.toFixed(0)}ms`
    );

    return result;
  }
);
```

## Result Inspection

After `await next()`, the result contains the action outcome. Inspect it for logging:

```ts
.use(async ({ next, metadata }) => {
  const result = await next();

  // result is a discriminated union — exactly one of data / serverError / validationErrors is populated
  // (or none, for the idle branch). Checking any one narrows the other two to undefined.
  if (result.serverError) {
    console.error(`[Action Error] ${metadata?.actionName}:`, result.serverError);
  }
  if (result.validationErrors) {
    console.warn(`[Validation] ${metadata?.actionName}:`, result.validationErrors);
  }

  return result;
})
```

## Structured Logging

```ts
import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { logger } from "@/lib/logger"; // pino, winston, etc.

export const actionClient = createSafeActionClient({
  defineMetadataSchema: () =>
    z.object({
      actionName: z.string(),
    }),
}).use(async ({ next, metadata, clientInput }) => {
  const requestId = crypto.randomUUID();
  const start = performance.now();

  logger.info({
    event: "action_start",
    action: metadata.actionName,
    requestId,
  });

  const result = await next({ ctx: { requestId } });
  const duration = performance.now() - start;

  logger.info({
    event: "action_complete",
    action: metadata.actionName,
    requestId,
    durationMs: Math.round(duration),
    success: !result.serverError && !result.validationErrors,
  });

  return result;
});
```

## Logging Validated Input

Use `useValidated()` to log the typed, post-validation input — especially useful when schema transforms modify the data:

```ts
// Using actionClient and logger from Structured Logging section above
export const createUser = actionClient
  .inputSchema(z.object({ email: z.string().email().transform((e) => e.toLowerCase()) }))
  .useValidated(async ({ parsedInput, next, metadata }) => {
    logger.info({
      event: "validated_input",
      action: metadata.actionName,
      email: parsedInput.email, // Typed and transformed (lowercased)
    });
    return next();
  })
  .action(async ({ parsedInput }) => {
    // parsedInput.email is lowercased
  });
```

## Error Reporting

Send errors to external monitoring (Sentry, Datadog, etc.):

```ts
import * as Sentry from "@sentry/nextjs";

export const actionClient = createSafeActionClient({
  handleServerError: (error) => {
    // Report to Sentry
    Sentry.captureException(error);

    if (error instanceof AppError) {
      return error.message;
    }
    return "An unexpected error occurred.";
  },
}).use(async ({ next, metadata }) => {
  return Sentry.withScope(async (scope) => {
    scope.setTag("action", metadata?.actionName ?? "unknown");
    return next();
  });
});
```

## Rate Limiting Middleware

```ts
import { headers } from "next/headers";

// Demo only — in-memory maps reset per serverless invocation. Use Redis/Upstash for production.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

.use(async ({ next }) => {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") ?? "unknown";
  const now = Date.now();
  const limit = rateLimitMap.get(ip);

  if (limit && limit.resetAt > now && limit.count >= 10) {
    throw new Error("Too many requests. Please try again later.");
  }

  if (!limit || limit.resetAt <= now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
  } else {
    limit.count++;
  }

  return next();
})
```
