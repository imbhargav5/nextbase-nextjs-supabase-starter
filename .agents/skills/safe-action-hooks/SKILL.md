---
name: safe-action-hooks
description: Use when executing next-safe-action actions from React client components -- useAction, useOptimisticAction, handling status/callbacks (onSuccess/onError/onSettled), execute vs executeAsync, or optimistic UI updates
---

# next-safe-action React Hooks

## Import

```ts
// All hooks
import { useAction, useOptimisticAction, useStateAction } from "next-safe-action/hooks";

// Backward-compatible re-export (same useStateAction hook)
import { useStateAction } from "next-safe-action/stateful-hooks";
```

## useAction — Quick Start

```tsx
"use client";

import { useAction } from "next-safe-action/hooks";
import { createUser } from "@/app/actions";

export function CreateUserForm() {
  const { execute, result, status, isExecuting, isPending } = useAction(createUser, {
    onSuccess: ({ data }) => {
      console.log("User created:", data);
    },
    onError: ({ error }) => {
      console.error("Failed:", error.serverError);
    },
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      execute({ name: formData.get("name") as string });
    }}>
      <input name="name" required />
      <button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create User"}
      </button>
      {result.serverError && <p className="error">{result.serverError}</p>}
      {result.data && <p className="success">Created: {result.data.id}</p>}
    </form>
  );
}
```

## useOptimisticAction — Quick Start

```tsx
"use client";

import { useOptimisticAction } from "next-safe-action/hooks";
import { toggleTodo } from "@/app/actions";

export function TodoItem({ todo }: { todo: Todo }) {
  const { execute, optimisticState } = useOptimisticAction(toggleTodo, {
    currentState: todo,
    updateFn: (state, input) => ({
      ...state,
      completed: !state.completed,
    }),
  });

  return (
    <label>
      <input
        type="checkbox"
        checked={optimisticState.completed}
        onChange={() => execute({ todoId: todo.id })}
      />
      {todo.title}
    </label>
  );
}
```

## useStateAction — Quick Start

```tsx
"use client";

import { useStateAction } from "next-safe-action/hooks";
import { submitFeedback } from "@/app/actions";

export function FeedbackForm() {
  const { formAction, result, isPending, hasSucceeded } = useStateAction(submitFeedback, {
    onSuccess: ({ data }) => {
      console.log("Submitted:", data);
    },
    onError: ({ error }) => {
      console.error("Failed:", error.serverError);
    },
  });

  return (
    <form action={formAction}>
      <input name="rating" type="number" min="1" max="5" required />
      <textarea name="comment" required />
      <button type="submit" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit"}
      </button>
      {result.validationErrors?.comment && (
        <p className="error">{result.validationErrors.comment._errors[0]}</p>
      )}
      {hasSucceeded && <p className="success">Thank you!</p>}
    </form>
  );
}
```

The server-side action must use `.stateAction()` (not `.action()`):

```ts
"use server";

import { z } from "zod";
import { actionClient } from "@/lib/safe-action";

export const submitFeedback = actionClient
  .inputSchema(z.object({ rating: z.number().min(1).max(5), comment: z.string() }))
  .stateAction(async ({ parsedInput }, { prevResult }) => {
    // prevResult contains the previous SafeActionResult
    await db.feedback.create({ data: parsedInput });
    return { rating: parsedInput.rating };
  });
```

## Return Value

All hooks (`useAction`, `useOptimisticAction`, `useStateAction`) return:

| Property | Type | Description |
|---|---|---|
| `execute(input)` | `(input) => void` | Fire-and-forget execution |
| `executeAsync(input)` | `(input) => Promise<Result>` | Returns a promise with the result |
| `input` | `Input \| undefined` | Last input passed to execute |
| `result` | `SafeActionResult` | Last action result — **discriminated union** of 4 branches (idle / success / serverError / validationErrors); narrowed when you check `status` or any `has*` shorthand |
| `reset()` | `() => void` | Resets to initial state (restores `initResult` if provided) and discards any in-flight execution |
| `status` | `HookActionStatus` | Current status string |
| `isIdle` | `boolean` | No execution has started yet |
| `isExecuting` | `boolean` | Action promise is pending |
| `isTransitioning` | `boolean` | React transition is pending |
| `isPending` | `boolean` | `isExecuting \|\| isTransitioning` |
| `hasSucceeded` | `boolean` | Last execution returned data |
| `hasErrored` | `boolean` | Last execution had an error |
| `hasNavigated` | `boolean` | Last execution triggered a navigation |

`useOptimisticAction` additionally returns:
| `optimisticState` | `State` | The optimistically-updated state |

`useStateAction` additionally returns:
| `formAction` | `(input) => void` | Dispatcher for `<form action={formAction}>` pattern |

The hook return is itself a **discriminated union** keyed on `status` and every `has*` / `is*` shorthand (each typed as literal `true` / `false` per branch). Narrowing any discriminant narrows `result` — e.g. inside `if (hasSucceeded)`, `result.data` is `Data` (not `Data | undefined`). See [Type narrowing via hook status](./use-action.md#type-narrowing-via-hook-status).

## initResult Option

All three hooks accept `initResult` to seed the hook with a preloaded result (e.g. data fetched on the server): in the opts object for `useAction`/`useStateAction`, in the utils object (alongside `currentState`/`updateFn`) for `useOptimisticAction`. The value is captured **once at mount** (like React's `useActionState` initial state): later changes to the option are ignored, and `reset()` restores the mount value. The seeded shape precisely types the idle branch's `result`. See [initResult in depth](./use-action.md#initresult).

## Supporting Docs

- [execute vs executeAsync, result handling](./use-action.md)
- [useStateAction in depth (decision table, formAction)](./use-state-action.md)
- [Optimistic updates with useOptimisticAction](./optimistic-updates.md)
- [Status lifecycle and all callbacks](./status-callbacks.md)
- [throwOnNavigation flag](./throw-on-navigation.md)

## Anti-Patterns

```ts
// BAD: Using executeAsync without try/catch when navigation errors are possible
const handleClick = async () => {
  const result = await executeAsync({ id }); // Throws on redirect!
  showToast(result.data);
};

// GOOD: Wrap executeAsync in try/catch
const handleClick = async () => {
  try {
    const result = await executeAsync({ id });
    showToast(result.data);
  } catch (e) {
    // Handle non-navigation errors here if needed, then re-throw
    // Navigation errors must propagate to Next.js
    throw e;
  }
};
```

```ts
// BAD: Using .action() with useStateAction — type error
const myAction = actionClient.inputSchema(schema).action(async ({ parsedInput }) => { ... });
useStateAction(myAction); // TypeScript error!

// GOOD: Use .stateAction() for useStateAction
const myAction = actionClient.inputSchema(schema).stateAction(async ({ parsedInput }, { prevResult }) => { ... });
useStateAction(myAction); // Works!
```
