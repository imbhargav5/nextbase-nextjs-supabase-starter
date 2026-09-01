# Server Error Handling

## How Errors Flow

1. An error is thrown inside server code or middleware
2. Framework errors (redirect, notFound, etc.) are detected and re-thrown — they bypass `handleServerError`
3. Errors produced by `returnServerError()` are caught by the builder and set `result.serverError` directly — they also bypass `handleServerError`
4. All other errors pass through `handleServerError`
5. The return value of `handleServerError` becomes `result.serverError` on the client

## handleServerError

```ts
import { createSafeActionClient } from "next-safe-action";

export const actionClient = createSafeActionClient({
  handleServerError: (error) => {
    // `error` is always an Error instance.
    // Non-Error throws are wrapped: new Error(DEFAULT_SERVER_ERROR_MESSAGE)

    if (error instanceof DatabaseError) {
      return "A database error occurred. Please try again.";
    }

    if (error instanceof AuthError) {
      return "Authentication failed. Please log in again.";
    }

    // Default: generic message (never leak internal details to client)
    return "Something went wrong. Please try again.";
  },
});
```

## Expected Server Errors with returnServerError

Not every server error is unexpected. For known business failures ("out of stock", "not found", "quota exceeded"), use `returnServerError()` to send a typed value to the client. It is set as `result.serverError` **as-is, bypassing `handleServerError`**:

```ts
import { returnServerError } from "next-safe-action";

export const buyProduct = actionClient
  .inputSchema(schema)
  .action(async ({ parsedInput }) => {
    const product = await db.product.find(parsedInput.id);

    if (!product.inStock) {
      // Throws internally — code after this line never runs
      returnServerError({ code: "OUT_OF_STOCK", message: "This product is sold out" });
    }

    // ...
  });
```

Key facts:

- Like `returnValidationErrors`, it **throws internally** (returns `never`), so the remaining server code doesn't execute. It also works from middleware.
- The payload must be **JSON-serializable** (no circular references, BigInts, functions, etc.). Non-serializable payloads fail loudly with a `TypeError` on the server (handled by `handleServerError` like any unexpected error). The payload is encoded onto the error `digest`, so it also works inside Next.js `"use cache"` scopes with `cacheComponents` enabled.
- The value should conform to the client's `ServerError` type (inferred from `handleServerError`'s return type) — but this is **not enforced automatically**, see below.

### Typing the Error Payload

`returnServerError<SE>(serverError: SE): never` infers `SE` from the argument, so there's no automatic type-level link to the client's `ServerError` type. Enforce it with:

```ts
// 1. Declare the error union on handleServerError — this types result.serverError on the client
type AppServerError =
  | { code: "INTERNAL"; message: string }
  | { code: "OUT_OF_STOCK"; message: string }
  | { code: "NOT_FOUND"; message: string };

const actionClient = createSafeActionClient({
  handleServerError: (e): AppServerError => ({ code: "INTERNAL", message: e.message }),
});

// 2. Enforce the payload at the call site
returnServerError<AppServerError>({ code: "OUT_OF_STOCK", message: "Sold out" });
// or
returnServerError({ code: "OUT_OF_STOCK", message: "Sold out" } satisfies AppServerError);

// 3. Recommended: export a typed alias next to your action client (lib/safe-action.ts)
export const returnAppError: (e: AppServerError) => never = returnServerError;
```

Without one of these, `returnServerError({ anything: true })` compiles even though `result.serverError` claims to be `AppServerError` on the client. Prefer the typed alias (technique 3) as the app-wide default.

On the client, `result.serverError` narrows as a normal discriminated union: `if (serverError?.code === "OUT_OF_STOCK") { ... }`.

## Custom Error Classes

For **unexpected/thrown** errors mapped through `handleServerError` (as opposed to expected errors returned via `returnServerError`), define domain-specific error classes to enable structured error handling:

```ts
// src/lib/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, "NOT_FOUND");
  }
}

export class PermissionError extends AppError {
  constructor() {
    super("You do not have permission", "FORBIDDEN");
  }
}
```

```ts
// src/lib/safe-action.ts
import { createSafeActionClient } from "next-safe-action";
import { AppError } from "@/lib/errors";

export const actionClient = createSafeActionClient({
  handleServerError: (error) => {
    if (error instanceof AppError) {
      return error.message; // Safe, controlled messages
    }
    console.error("Unexpected error:", error);
    return "An unexpected error occurred.";
  },
});
```

```ts
// src/app/actions.ts
"use server";

import { NotFoundError } from "@/lib/errors";
import { authActionClient } from "@/lib/safe-action";
import { z } from "zod";

export const getPost = authActionClient
  .inputSchema(z.object({ postId: z.string().uuid() }))
  .action(async ({ parsedInput }) => {
    const post = await db.post.findById(parsedInput.postId);
    if (!post) {
      throw new NotFoundError("Post");
      // result.serverError = "Post not found"
    }
    return post;
  });
```

## Structured Server Errors

Return objects instead of strings for richer client-side handling:

```ts
const actionClient = createSafeActionClient({
  handleServerError: (error) => {
    if (error instanceof AppError) {
      return { message: error.message, code: error.code };
    }
    return { message: "An unexpected error occurred", code: "INTERNAL" };
  },
});

// On the client:
const { result } = useAction(myAction);
if (result.serverError) {
  // result.serverError is typed as { message: string; code: string }
  showToast(result.serverError.message);
}
```

## Error Classes Provided by next-safe-action

| Class | Thrown When | Holds |
|---|---|---|
| `ActionValidationError` | `throwValidationErrors` is enabled and input fails validation | `.validationErrors` |
| `ActionBindArgsValidationError` | Bind args fail validation | `.validationErrors` |
| `ActionMetadataValidationError` | Metadata fails schema validation | `.validationErrors` |
| `ActionOutputDataValidationError` | Output fails schema validation | `.validationErrors` |

These are all importable from `next-safe-action`:

```ts
import {
  ActionValidationError,
  ActionBindArgsValidationError,
  ActionMetadataValidationError,
  ActionOutputDataValidationError,
} from "next-safe-action";
```

> **Note:** `ActionServerValidationError` (used by `returnValidationErrors()`) and `ActionServerError` (used by `returnServerError()`) are internal — not exported from the package. The helper functions are the entire public API.

## throwValidationErrors

When enabled, input validation errors throw `ActionValidationError` instead of returning `result.validationErrors`. This is useful for catching errors in middleware or try/catch blocks.

```ts
// Enable globally
const actionClient = createSafeActionClient({
  throwValidationErrors: true,
});

// Or per-action
export const myAction = actionClient
  .inputSchema(z.object({ name: z.string() }))
  .action(async ({ parsedInput }) => {
    return { name: parsedInput.name };
  }, {
    throwValidationErrors: true,
  });
```

With custom error message:

```ts
.action(serverCodeFn, {
  throwValidationErrors: {
    overrideErrorMessage: async (validationErrors) => {
      return "Invalid input: check your form fields";
    },
  },
});
```
