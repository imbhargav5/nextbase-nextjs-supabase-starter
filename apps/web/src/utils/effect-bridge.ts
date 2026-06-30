import { Cause, Effect, Exit, Option } from 'effect';
import { AppError } from './effect-errors';

function extractErrorMessage(error: unknown): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }

  return '';
}

/**
 * Runs an Effect within a next-safe-action handler, converting it to a Promise
 * and throwing an Error if the Effect fails.
 *
 * This allows Effect-based utilities to work seamlessly with next-safe-action.
 *
 * @param effect - The Effect to run
 * @returns A Promise that resolves with the success value or throws an Error
 *
 * @example
 * ```typescript
 * export const myAction = authActionClient
 *   .schema(mySchema)
 *   .action(async ({ parsedInput }) => {
 *     const supabase = await createSupabaseClient();
 *     const result = await runEffectInAction(
 *       getItemEffect(supabase, parsedInput.id)
 *     );
 *     return result;
 *   });
 * ```
 */
export async function runEffectInAction<A, E extends AppError>(
  effect: Effect.Effect<A, E, never>
): Promise<A> {
  const exit = await Effect.runPromiseExit(effect);

  if (Exit.isFailure(exit)) {
    const appError = Option.getOrElse(Cause.failureOption(exit.cause), () => {
      return new Error('Unknown error');
    });

    // Throw a standard Error for next-safe-action to catch
    const message = extractErrorMessage(appError);
    throw new Error(message || 'An error occurred while processing the request');
  }

  return exit.value;
}

/**
 * Converts an Effect to a Promise, useful for compatibility with existing Promise-based code.
 *
 * @param effect - The Effect to convert
 * @returns A Promise that resolves with the success value or rejects with an Error
 *
 * @example
 * ```typescript
 * const items = await effectToPromise(getAllItemsEffect(supabase));
 * ```
 */
export function effectToPromise<A, E extends AppError>(
  effect: Effect.Effect<A, E, never>
): Promise<A> {
  return Effect.runPromise(effect);
}

/**
 * Catches an Effect error and maps it to a user-friendly error message.
 *
 * @param effect - The Effect to catch errors from
 * @param onError - Maps the caught error to a fallback value
 * @returns An Effect that never fails (errors are mapped to fallback values)
 *
 * @example
 * ```typescript
 * const result = await Effect.runPromise(
 *   catchEffectError(
 *     getItemEffect(supabase, id),
 *     () => null
 *   )
 * );
 * ```
 */
export function catchEffectError<A, E extends AppError>(
  effect: Effect.Effect<A, E, never>,
  onError: (error: E) => A
): Effect.Effect<A, never, never> {
  return Effect.catchAll(effect, (error) => Effect.succeed(onError(error)));
}

/**
 * Extracts a user-friendly error message from an AppError.
 *
 * @param error - The AppError to extract the message from
 * @returns A user-friendly error message string
 */
export function getErrorMessage(error: AppError): string {
  switch (error._tag) {
    case 'DatabaseError':
      return error.message || 'A database error occurred';
    case 'NotFoundError':
      return error.message || `${error.resource} not found`;
    case 'ValidationError':
      return error.field
        ? `${error.field}: ${error.message}`
        : error.message || 'Validation failed';
    case 'AuthenticationError':
      return error.message || 'Authentication failed';
    case 'NetworkError':
      return error.message || 'A network error occurred';
    default:
      return 'An unknown error occurred';
  }
}
