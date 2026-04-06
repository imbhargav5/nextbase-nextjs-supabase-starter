# Effect Integration Guide

This document explains how to use Effect for typed error handling in the utils layer of the Nextbase application.

## Overview

Effect provides typed error channels that make error handling more explicit and type-safe. This integration keeps Effect isolated to the utils layer while remaining compatible with existing patterns (next-safe-action, Zod, RSC).

## Core Components

### Error Types (`effect-errors.ts`)

Defines typed error classes for different failure scenarios:

```typescript
import {
  DatabaseError,
  NotFoundError,
  ValidationError,
} from '@/utils/effect-errors';
```

Available error types:

- **DatabaseError** - Supabase/Postgres errors
- **NotFoundError** - Missing resources
- **ValidationError** - Data validation failures
- **AuthenticationError** - Auth/authorization failures
- **NetworkError** - External API failures

### Query Utilities (`effect-supabase-queries.ts`)

Effect-wrapped versions of Supabase operations with typed errors:

```typescript
import {
  getAllItemsEffect,
  getItemEffect,
  deleteItemEffect,
  getAllPrivateItemsEffect,
  getPrivateItemEffect,
  deletePrivateItemEffect,
  insertPrivateItemEffect,
} from '@/utils/effect-supabase-queries';
```

Each function returns `Effect<SuccessType, ErrorType, never>` instead of `Promise<T>`.

### Bridge Utilities (`effect-bridge.ts`)

Helper functions to integrate Effect with existing Promise-based code:

```typescript
import {
  runEffectInAction,
  effectToPromise,
  catchEffectError,
  getErrorMessage,
} from '@/utils/effect-bridge';
```

## Usage Patterns

### 1. Using Effect in Server Actions

Effect utilities work seamlessly with next-safe-action:

```typescript
'use server';
import { authActionClient } from '@/lib/safe-action';
import { createSupabaseClient } from '@/supabase-clients/server';
import { runEffectInAction } from '@/utils/effect-bridge';
import { insertPrivateItemEffect } from '@/utils/effect-supabase-queries';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const insertPrivateItemSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const insertPrivateItemAction = authActionClient
  .schema(insertPrivateItemSchema)
  .action(async ({ parsedInput }) => {
    const supabaseClient = await createSupabaseClient();

    // Use Effect utility with typed error handling
    const data = await runEffectInAction(
      insertPrivateItemEffect(supabaseClient, parsedInput)
    );

    revalidatePath('/');
    return data.id;
  });
```

### 2. Using Effect in React Server Components

Convert Effect to Promise for RSC data fetching:

```typescript
import { createSupabaseClient } from '@/supabase-clients/server';
import { effectToPromise } from '@/utils/effect-bridge';
import { getAllItemsEffect } from '@/utils/effect-supabase-queries';

export default async function ItemsPage() {
  const supabase = await createSupabaseClient();

  // Convert Effect to Promise
  const items = await effectToPromise(getAllItemsEffect(supabase));

  return <div>{/* render items */}</div>;
}
```

### 3. Advanced Error Handling

Use Effect's composition operators for complex error handling:

```typescript
import { Effect } from 'effect';
import { getItemEffect } from '@/utils/effect-supabase-queries';
import { catchEffectError, getErrorMessage } from '@/utils/effect-bridge';

// Provide a fallback value on error
const itemOrNull = catchEffectError(
  getItemEffect(supabase, itemId),
  (error) => null
);

// Map errors to custom messages
const itemEffect = Effect.mapError(
  getItemEffect(supabase, itemId),
  (error) => ({
    userMessage: getErrorMessage(error),
    technicalDetails: error,
  })
);
```

### 4. Combining Multiple Effects

Use Effect composition for sequential or parallel operations:

```typescript
import { Effect } from 'effect';
import {
  getAllItemsEffect,
  getAllPrivateItemsEffect,
} from '@/utils/effect-supabase-queries';

// Sequential execution
const sequentialEffect = Effect.gen(function* () {
  const items = yield* getAllItemsEffect(supabase);
  const privateItems = yield* getAllPrivateItemsEffect(supabase);
  return { items, privateItems };
});

// Parallel execution
const parallelEffect = Effect.all([
  getAllItemsEffect(supabase),
  getAllPrivateItemsEffect(supabase),
]);

const [items, privateItems] = await runEffectInAction(parallelEffect);
```

## When to Use Effect vs Traditional Patterns

### Use Effect When:

- You need explicit typed error handling
- Working with complex error scenarios
- Composing multiple async operations
- You want better error recovery strategies
- Building new utility functions in the utils layer

### Use Traditional Patterns When:

- Simple CRUD operations with straightforward error handling
- Working with existing code that doesn't benefit from refactoring
- Quick prototypes or one-off operations
- RSC data fetching where errors can be handled by error boundaries

## Best Practices

1. **Keep Effect in Utils Layer**

   - Don't expose Effect types in component props
   - Convert to Promise at boundaries (actions, RSC)
   - Use bridge functions for compatibility

2. **Error Handling**

   - Always handle errors explicitly with typed error channels
   - Use `runEffectInAction` in server actions for automatic error mapping
   - Provide user-friendly error messages via `getErrorMessage`

3. **Type Safety**

   - Let TypeScript infer Effect types
   - Use the typed error classes for pattern matching
   - Leverage Effect's type system for compile-time guarantees

4. **Migration Strategy**
   - Start with new features
   - Gradually migrate existing code as needed
   - Don't refactor working code unless there's a clear benefit

## API Reference

### runEffectInAction

Executes an Effect within a next-safe-action handler.

```typescript
function runEffectInAction<A, E extends AppError>(
  effect: Effect.Effect<A, E, never>
): Promise<A>;
```

**Throws:** Standard Error if the Effect fails

### effectToPromise

Converts an Effect to a Promise.

```typescript
function effectToPromise<A, E extends AppError>(
  effect: Effect.Effect<A, E, never>
): Promise<A>;
```

**Rejects:** With Error if the Effect fails

### catchEffectError

Catches Effect errors and provides fallback values.

```typescript
function catchEffectError<A, E extends AppError>(
  effect: Effect.Effect<A, E, never>,
  onError: (error: E) => A
): Effect.Effect<A, never, never>;
```

**Returns:** An Effect that never fails

### getErrorMessage

Extracts user-friendly error messages.

```typescript
function getErrorMessage(error: AppError): string;
```

**Returns:** Human-readable error message

## Examples

### Example 1: Delete Action with Error Handling

```typescript
export const deleteItemAction = authActionClient
  .schema(z.object({ id: z.string().uuid() }))
  .action(async ({ parsedInput }) => {
    const supabase = await createSupabaseClient();

    await runEffectInAction(deleteItemEffect(supabase, parsedInput.id));

    revalidatePath('/items');
    return { success: true };
  });
```

### Example 2: Fetching with Fallback

```typescript
export async function getItemWithFallback(itemId: string) {
  const supabase = await createSupabaseClient();

  const itemOrNull = await effectToPromise(
    catchEffectError(getItemEffect(supabase, itemId), () => null)
  );

  return itemOrNull;
}
```

### Example 3: Custom Error Mapping

```typescript
import { Effect } from 'effect';

const customEffect = Effect.gen(function* () {
  const item = yield* getItemEffect(supabase, itemId);

  if (item.archived) {
    return yield* Effect.fail(
      new ValidationError({
        message: 'Cannot access archived items',
        field: 'archived',
      })
    );
  }

  return item;
});
```

## Resources

- [Effect Documentation](https://effect.website)
- [Effect Schema Guide](https://effect.website/docs/schema/getting-started)
- [Effect Error Handling](https://effect.website/docs/error-management/expected-errors)

## Support

For questions or issues with Effect integration:

1. Check this documentation first
2. Review the Effect official documentation
3. Consult with the team lead
4. File an issue in the project repository
