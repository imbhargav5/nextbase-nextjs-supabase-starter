---
name: safe-action-middleware
description: Use when implementing middleware for next-safe-action -- authentication, authorization, logging, rate limiting, error interception, context extension, or creating standalone reusable middleware with createMiddleware() or createValidatedMiddleware(). Covers both use() (pre-validation) and useValidated() (post-validation) middleware.
---

# next-safe-action Middleware

## Quick Start

```ts
import { createSafeActionClient } from "next-safe-action";

const actionClient = createSafeActionClient();

// Add middleware with .use()
const authClient = actionClient.use(async ({ next }) => {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  // Pass context to the next middleware/action via next({ ctx })
  return next({
    ctx: { userId: session.user.id },
  });
});
```

## How Middleware Works

- `.use()` adds middleware to the chain — you can call it multiple times
- Each `.use()` returns a **new** client instance (immutable chain)
- Middleware executes **top-to-bottom** (in the order added)
- Results flow **bottom-to-top** (the deepest middleware/action resolves first)
- Context is accumulated via `next({ ctx })` — each level's ctx is **deep-merged** with the previous

```ts
const client = createSafeActionClient()
  .use(async ({ next }) => {
    console.log("1: before");             // Runs 1st
    const result = await next({ ctx: { a: 1 } });
    console.log("1: after");              // Runs 4th
    return result;
  })
  .use(async ({ next, ctx }) => {
    console.log("2: before", ctx.a);      // Runs 2nd, ctx.a = 1
    const result = await next({ ctx: { b: 2 } });
    console.log("2: after");              // Runs 3rd
    return result;
  });

// In .action(): ctx = { a: 1, b: 2 }
```

## use() Middleware Function Signature

```ts
async ({
  clientInput,           // Raw input from the client (unknown)
  bindArgsClientInputs,  // Raw bind args array
  ctx,                   // Accumulated context from previous middleware
  metadata,              // Metadata set via .metadata()
  next,                  // Call to proceed to next middleware/action
}) => {
  // Optionally extend context
  return next({ ctx: { /* new context properties */ } });
}
```

## useValidated() — Post-Validation Middleware

`.useValidated()` registers middleware that runs **after** input validation, giving access to typed `parsedInput`. **Default to `use()`** — only use `useValidated()` when middleware logic depends on validated input.

```ts
const action = authClient
  .inputSchema(z.object({ postId: z.string().uuid(), title: z.string() }))
  .useValidated(async ({ parsedInput, ctx, next }) => {
    // parsedInput is typed: { postId: string; title: string }
    const post = await db.post.findById(parsedInput.postId);
    if (!post || post.authorId !== ctx.userId) {
      throw new Error("Not authorized");
    }
    return next({ ctx: { post } });
  })
  .action(async ({ parsedInput, ctx }) => {
    // ctx.post is available and typed
    await db.post.update(ctx.post.id, { title: parsedInput.title });
  });
```

## Execution Order

```
1. use() middleware            — pre-validation, runs in order added
2. Input validation            — schema parsing
3. useValidated() middleware   — post-validation, runs in order added
4. Server code (.action())     — receives final ctx and parsedInput
```

Both middleware stacks follow the onion model: code before `next()` runs top-to-bottom, code after `next()` unwinds bottom-to-top.

## use() vs useValidated()

| Need | Method |
|---|---|
| Authentication, logging, rate limiting (no input needed) | `.use()` |
| Access to raw `clientInput` before validation | `.use()` |
| Authorization based on validated input (e.g., check user owns resource) | `.useValidated()` |
| Logging or auditing validated/transformed input | `.useValidated()` |
| Enriching context with data derived from parsed input | `.useValidated()` |

## useValidated() Middleware Function Signature

```ts
async ({
  parsedInput,             // Validated, typed input (from inputSchema)
  clientInput,             // Raw input from the client
  bindArgsParsedInputs,    // Validated bind args tuple
  bindArgsClientInputs,    // Raw bind args array
  ctx,                     // Accumulated context from all previous middleware
  metadata,                // Metadata set via .metadata()
  next,                    // Call to proceed to next middleware/action
}) => {
  return next({ ctx: { /* new context properties */ } });
}
```

### Chaining Rules

- Must call `.inputSchema()` or `.bindArgsSchemas()` **before** `.useValidated()`
- Cannot call `.inputSchema()` or `.bindArgsSchemas()` **after** `.useValidated()`
- Cannot call `.use()` **after** `.useValidated()`
- Can chain multiple `.useValidated()` calls

### Schema Transforms

`useValidated()` sees the **transformed** value in `parsedInput`, while `clientInput` retains the original:

```ts
authClient
  .inputSchema(z.string().transform((s) => s.toUpperCase()))
  .useValidated(async ({ clientInput, parsedInput, next }) => {
    console.log(clientInput);  // "hello" (original)
    console.log(parsedInput);  // "HELLO" (transformed)
    return next();
  })
```

### Context in Error Callbacks

- Context set by `use()` middleware is **always** available in `onError`/`onSettled` callbacks.
- Context set by `useValidated()` middleware is **optional** (may be `undefined`) — if validation fails, `useValidated()` never runs, so its context additions are missing.

## Supporting Docs

- [Authentication & authorization patterns](./auth-patterns.md)
- [Logging & monitoring middleware](./logging-monitoring.md)
- [Standalone reusable middleware with createMiddleware() and createValidatedMiddleware()](./standalone-middleware.md)

## Anti-Patterns

```ts
// BAD: Forgetting to return next() — action will hang
.use(async ({ next }) => {
  await doSomething();
  next({ ctx: {} }); // Missing return!
})

// GOOD: Always return the result of next()
.use(async ({ next }) => {
  await doSomething();
  return next({ ctx: {} });
})
```

```ts
// BAD: Catching all errors (swallows framework errors like redirect/notFound)
.use(async ({ next }) => {
  try {
    return await next({ ctx: {} });
  } catch (error) {
    return { serverError: "Something went wrong" }; // Swallows redirect!
  }
})

// GOOD: Re-throw framework errors
.use(async ({ next }) => {
  try {
    return await next({ ctx: {} });
  } catch (error) {
    if (error instanceof Error && "digest" in error) {
      throw error; // Let Next.js handle redirects, notFound, etc.
    }
    // Handle other errors
    console.error(error);
    return { serverError: "Something went wrong" };
  }
})
```

```ts
// BAD: useValidated() without an input schema — won't compile
const client = actionClient.useValidated(async ({ parsedInput, next }) => {
  return next();
});

// GOOD: Always define inputSchema or bindArgsSchemas before useValidated()
const client = actionClient
  .inputSchema(z.object({ id: z.string() }))
  .useValidated(async ({ parsedInput, next }) => {
    console.log(parsedInput.id); // Typed!
    return next();
  });
```
