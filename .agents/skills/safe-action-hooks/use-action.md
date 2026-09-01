# execute vs executeAsync

## execute — Fire and Forget

`execute(input)` triggers the action and updates hook state reactively. It does not return a value — use callbacks or `result` to react to the outcome.

```tsx
const { execute, result, isPending } = useAction(myAction, {
  onSuccess: ({ data }) => {
    toast.success("Done!");
    router.refresh();
  },
  onError: ({ error }) => {
    toast.error(error.serverError ?? "Something went wrong");
  },
});

// Trigger
<button onClick={() => execute({ name: "Alice" })}>Submit</button>
```

Internally, `execute` runs inside `React.startTransition` with a `setTimeout(0)` for deferred state updates.

## executeAsync — Awaitable Result

`executeAsync(input)` returns a `Promise<SafeActionResult>`. Useful when you need the result inline (e.g., in a multi-step flow).

```tsx
const { executeAsync, isPending } = useAction(myAction);

const handleSubmit = async () => {
  const result = await executeAsync({ name: "Alice" });

  if (result.data) {
    // Navigate, show toast, etc.
    router.push(`/users/${result.data.id}`);
  }
  if (result.serverError) {
    toast.error(result.serverError);
  }
};
```

**Important:** If the action triggers a navigation error (redirect, notFound, etc.), `executeAsync` will **throw**. Always wrap in try/catch if your action might navigate:

```tsx
const handleSubmit = async () => {
  try {
    const result = await executeAsync(input);
    // Handle result...
  } catch (e) {
    // Navigation errors propagate to Next.js — rethrow them
    throw e;
  }
};
```

## Result Object

`result` is a **discriminated union** with 4 mutually exclusive branches (no explicit `status` field — the discriminant is which of `data` / `serverError` / `validationErrors` is populated):

```ts
const { result } = useAction(myAction);

// Branches:
//   idle / cleared:     { data: undefined; serverError: undefined; validationErrors: undefined }
//   success:            { data: Data;      serverError: undefined; validationErrors: undefined }
//   server error:       { data: undefined; serverError: SE;        validationErrors: undefined }
//   validation error:   { data: undefined; serverError: undefined; validationErrors: VE         }
```

Checking any one field narrows the other two to `undefined`:

```ts
if (result.data) {
  // result.serverError      → undefined
  // result.validationErrors → undefined
}
```

The result is the idle branch initially and after `reset()` (seeded by `initResult` if provided). Precedence when multiple outcomes coexist: `validationErrors` > `serverError` > `data`.

## Type Narrowing via Hook Status

The hook return itself is a discriminated union keyed on `status` — so shorthand booleans work as type guards and narrow `result` directly, without checking `result.data` first:

```ts
const action = useAction(myAction);

if (action.hasSucceeded) {
  action.result.data;        // Data (guaranteed — not Data | undefined)
  action.result.serverError; // undefined
}

if (action.hasErrored) {
  // result.serverError or result.validationErrors is populated
}
```

The destructured form works the same way when keyed on `status`:

```ts
const { status, result } = useAction(myAction);
if (status === "hasSucceeded") {
  result.data; // narrowed to Data
}
```

For void-returning actions, `result.data` is typed as `undefined` (not `void | undefined`) thanks to `NormalizeActionResult`.

## Sequential Actions

Use `executeAsync` for dependent calls:

```tsx
const uploadAction = useAction(uploadFile);
const createPostAction = useAction(createPost);

const handlePublish = async () => {
  const uploadResult = await uploadAction.executeAsync({ file });
  if (!uploadResult.data) return;

  const postResult = await createPostAction.executeAsync({
    title,
    imageUrl: uploadResult.data.url,
  });
  if (postResult.data) {
    router.push(`/posts/${postResult.data.id}`);
  }
};
```

## initResult

Seed the hook with a preloaded result (e.g. data fetched on the server), so `result.data` is populated before the first execution. The shape you pass precisely types the idle branch's `result`:

```tsx
const { result } = useAction(myAction, {
  initResult: { data: initialData },
});

// result.data is narrowed before any call is made (no optional chaining needed)
```

The value is captured **once at mount**, like React's `useActionState` initial state: later changes to the option are ignored, and `reset()` restores the mount value. Also available on `useOptimisticAction` (in the utils object, alongside `currentState`/`updateFn`) and `useStateAction`.

## reset()

Resets the hook to its initial state — restores `result` to `initResult` (or empty), clears input and status, and sets `isIdle` to `true`.

Reset also **discards any in-flight execution**: if an action is still running when you call `reset()`, its result, errors, and callbacks are ignored when it settles, and the hook reports idle immediately (`isExecuting`/`isPending` go `false` right away).

```tsx
const { execute, result, reset } = useAction(myAction);

// After showing a success message
useEffect(() => {
  if (result.data) {
    const timer = setTimeout(reset, 3000);
    return () => clearTimeout(timer);
  }
}, [result.data, reset]);
```
