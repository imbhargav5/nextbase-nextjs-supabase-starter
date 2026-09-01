# throwOnNavigation

## Overview

The `throwOnNavigation` option controls how navigation errors (`redirect()`, `notFound()`, `forbidden()`, `unauthorized()`) are handled by hooks.

| Mode | Behavior |
|---|---|
| `throwOnNavigation: false` (default) | Navigation errors are caught. `onNavigation` and `onSettled` callbacks fire. Status set to `"hasNavigated"`. |
| `throwOnNavigation: true` | Navigation errors are thrown during React's render phase to the nearest error boundary. In Next.js, this shows the appropriate error page (404, 403, 401). |

## When throwOnNavigation is true

**`onNavigation` and `onSettled` callbacks are NOT available.** This is enforced at the TypeScript level via a discriminated union:

```ts
// TypeScript will ERROR if you try to pass onNavigation or onSettled
const { execute } = useAction(myAction, {
  throwOnNavigation: true,
  onSuccess: ({ data }) => { /* works fine */ },
  onError: ({ error }) => { /* works fine */ },
  // onNavigation: () => {} // TypeScript error!
  // onSettled: () => {}    // TypeScript error!
});
```

**Why callbacks can't fire:** When `throwOnNavigation` is `true`, the navigation error is thrown during React's render phase. React's rendering model prevents effects (and therefore callbacks) from running when a component throws during render. The throw happens before the commit phase where effects execute.

## When to Use

**Use `throwOnNavigation: true` when:**
- Navigation is the primary outcome of the action (e.g., delete-then-redirect)
- You want Next.js's built-in error pages (`not-found.tsx`, `forbidden.tsx`, `unauthorized.tsx`)
- You don't need client-side cleanup or logging before navigation

**Use `throwOnNavigation: false` (default) when:**
- You need to run client-side logic before navigation (analytics, cleanup, toast)
- You want to show a custom UI for navigation states
- You need the `onSettled` callback for guaranteed cleanup

## Server-Side Alternative for Side Effects

When `throwOnNavigation: true` is enabled, use server-side action callbacks for side effects. These always run regardless of `throwOnNavigation`:

```ts
// Server-side: actions.ts
"use server";

export const deletePost = authActionClient
  .inputSchema(z.object({ postId: z.string().uuid() }))
  .action(
    async ({ parsedInput }) => {
      await db.post.delete(parsedInput.postId);
      redirect("/posts");
    },
    {
      // Server-side callbacks always fire, even with throwOnNavigation: true
      onNavigation: async ({ navigationKind }) => {
        console.log("Server: navigation occurred:", navigationKind);
      },
      onSettled: async ({ result }) => {
        await analytics.track("post_deleted");
      },
    }
  );
```

```tsx
// Client-side: component.tsx
"use client";

const { execute } = useAction(deletePost, {
  throwOnNavigation: true,
  // No onNavigation/onSettled needed — side effects handled on the server
  onError: ({ error }) => {
    toast.error(error.serverError ?? "Failed to delete");
  },
});
```

## Examples

### With useAction

```tsx
const { execute, isPending } = useAction(deleteAndRedirect, {
  throwOnNavigation: true,
  onSuccess: ({ data }) => {
    // This fires if the action returns data without navigating
    toast.success("Done!");
  },
  onError: ({ error }) => {
    toast.error(error.serverError ?? "Failed");
  },
});
```

### With useStateAction

```tsx
const { formAction, isPending } = useStateAction(deleteAndRedirect, {
  throwOnNavigation: true,
  onSuccess: ({ data }) => {
    toast.success("Done!");
  },
});

return (
  <form action={formAction}>
    <button type="submit" disabled={isPending}>Delete</button>
  </form>
);
```

### With useOptimisticAction

```tsx
const { execute, optimisticState } = useOptimisticAction(archiveItem, {
  currentState: item,
  updateFn: (state) => ({ ...state, archived: true }),
  throwOnNavigation: true,
});
```

## Anti-Patterns

```ts
// BAD: Passing onNavigation with throwOnNavigation: true — TypeScript error
const { execute } = useAction(myAction, {
  throwOnNavigation: true,
  onNavigation: () => {}, // TypeScript error!
});

// BAD: Passing onSettled with throwOnNavigation: true — TypeScript error
const { execute } = useAction(myAction, {
  throwOnNavigation: true,
  onSettled: () => {},  // TypeScript error!
});

// GOOD: Use server-side callbacks for side effects instead
export const myAction = actionClient.action(
  async () => { redirect("/home"); },
  {
    onNavigation: async () => { /* runs on server */ },
    onSettled: async () => { /* runs on server */ },
  }
);
```
