import { Data } from 'effect';

/**
 * Base error for database operations with Supabase/Postgres
 */
export class DatabaseError extends Data.TaggedError('DatabaseError')<{
  message: string;
  code?: string;
  details?: string;
  hint?: string;
}> {}

/**
 * Error for data validation failures
 */
export class ValidationError extends Data.TaggedError('ValidationError')<{
  message: string;
  field?: string;
}> {}

/**
 * Error for authentication and authorization failures
 */
export class AuthenticationError extends Data.TaggedError(
  'AuthenticationError'
)<{
  message: string;
}> {}

/**
 * Error for resources that cannot be found
 */
export class NotFoundError extends Data.TaggedError('NotFoundError')<{
  message: string;
  resource: string;
  id?: string;
}> {}

/**
 * Error for external network/API failures
 */
export class NetworkError extends Data.TaggedError('NetworkError')<{
  message: string;
  statusCode?: number;
}> {}

/**
 * Union type of all possible errors in the application
 */
export type AppError =
  | DatabaseError
  | ValidationError
  | AuthenticationError
  | NotFoundError
  | NetworkError;
