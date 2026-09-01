# Status Lifecycle & Callbacks

## Status Lifecycle

```
idle → executing → hasSucceeded
                 → hasErrored
                 → hasNavigated
```

| Status | Meaning |
|---|---|
| `idle` | No execution has started (or `reset()` was called) |
| `executing` | Action promise is pending |
| `hasSucceeded` | Last execution returned `data` |
| `hasErrored` | Last execution had `serverError` or `validationErrors` |
| `hasNavigated` | Last execution triggered a navigation (redirect, notFound, etc.) |

## Shorthand Booleans

```ts
const {
  isIdle,          // status === "idle"
  isExecuting,     // status === "executing"
  isTransitioning, // React transition is still pending (after action resolves)
  isPending,       // isExecuting || isTransitioning
  hasSucceeded,    // status === "hasSucceeded"
  hasErrored,      // status === "hasErrored"
  hasNavigated,    // status === "hasNavigated"
} = useAction(myAction);
```

`isPending` is the most useful for disabling UI — it covers both the action execution and any React transition that follows. Note: `isTransitioning` tracks the React transition state separately (it may remain `true` briefly after `isExecuting` becomes `false`).

### Shorthand booleans as type guards

The hook return is a discriminated union keyed on `status`, and each of `isIdle` / `isExecuting` / `hasSucceeded` / `hasErrored` / `hasNavigated` is typed as literal `true` / `false` per branch. That makes them real type guards: checking one narrows `result` without further checks.

```ts
const action = useAction(myAction);

if (action.hasSucceeded) {
  action.result.data;        // Data (not Data | undefined)
  action.result.serverError; // undefined
} else if (action.hasErrored) {
  // result.serverError or result.validationErrors is the populated one
}
```

`isTransitioning` and `isPending` are plain `boolean` (they don't map to a single status branch) — they don't narrow.

## Callbacks

All callbacks are optional and receive typed arguments:

### onExecute

Fires immediately when `execute` or `executeAsync` is called.

```ts
useAction(myAction, {
  onExecute: ({ input }) => {
    console.log("Starting with input:", input);
  },
});
```

### onSuccess

Fires when the action returns data without errors.

```ts
useAction(myAction, {
  onSuccess: ({ data, input }) => {
    toast.success(`Created: ${data.name}`);
    router.refresh();
  },
});
```

### onError

Fires when the action has `serverError`, `validationErrors`, or throws.

```ts
useAction(myAction, {
  onError: ({ error, input }) => {
    // error.serverError    — from handleServerError
    // error.validationErrors — from schema validation / returnValidationErrors
    // error.thrownError    — non-navigation error thrown by executeAsync

    if (error.serverError) {
      toast.error(error.serverError);
    }
    if (error.validationErrors) {
      console.warn("Validation failed:", error.validationErrors);
    }
  },
});
```

### onNavigation

Fires when the action triggers a Next.js navigation error (redirect, notFound, forbidden, unauthorized).

```ts
useAction(myAction, {
  onNavigation: ({ input, navigationKind }) => {
    // navigationKind: "redirect" | "notFound" | "forbidden" | "unauthorized" | "other"
    console.log(`Navigation: ${navigationKind}`);
  },
});
```

### onSettled

Fires after any outcome (success, error, or navigation). Always runs.

```ts
useAction(myAction, {
  onSettled: ({ result, input, navigationKind }) => {
    // Good for cleanup, analytics, re-enabling UI
    setLoading(false);
  },
});
```

## Callback Execution Order

1. `onExecute` — immediately on execute
2. Action runs on server
3. One of: `onSuccess`, `onError`, or `onNavigation`
4. `onSettled` — always last

## throwOnNavigation Mode

When `throwOnNavigation: true` is set on a hook, `onNavigation` and `onSettled` callbacks are **not available**. TypeScript enforces this via a discriminated union:

```ts
// throwOnNavigation: true removes onNavigation and onSettled from the type
const { execute } = useAction(myAction, {
  throwOnNavigation: true,
  onExecute: () => { /* still works */ },
  onSuccess: ({ data }) => { /* still works */ },
  onError: ({ error }) => { /* still works */ },
  // onNavigation: () => {} // TypeScript error!
  // onSettled: () => {}    // TypeScript error!
});
```

Navigation errors are thrown during React's render phase to the nearest error boundary. In Next.js, this shows the appropriate error page (404, 403, 401).

**For side effects during navigation with `throwOnNavigation: true`**, use server-side action callbacks instead:

```ts
export const myAction = actionClient.action(
  async () => { redirect("/home"); },
  {
    onNavigation: async ({ navigationKind }) => { /* runs on server */ },
    onSettled: async ({ result }) => { /* runs on server */ },
  }
);
```

See [throwOnNavigation in depth](./throw-on-navigation.md) for full details.

## Using Multiple Callbacks

```tsx
const { execute, isPending, result } = useAction(createPost, {
  onExecute: () => {
    setFormDisabled(true);
  },
  onSuccess: ({ data }) => {
    toast.success("Post created!");
    router.push(`/posts/${data.id}`);
  },
  onError: ({ error }) => {
    toast.error(error.serverError ?? "Failed to create post");
  },
  onSettled: () => {
    setFormDisabled(false);
  },
});
```
