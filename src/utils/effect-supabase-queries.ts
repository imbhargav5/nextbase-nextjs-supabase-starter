import { AppSupabaseClient, Table } from '@/types';
import { Effect } from 'effect';
import { DatabaseError, NotFoundError } from './effect-errors';

interface SupabaseError {
  message?: string;
  code?: string;
  details?: string;
  hint?: string;
}

/**
 * Maps Supabase errors to typed Effect errors
 */
function mapSupabaseError(error: unknown): DatabaseError | NotFoundError {
  const supabaseError = error as SupabaseError;
  // Check if it's a not found error
  if (
    supabaseError.code === 'PGRST116' ||
    supabaseError.message?.includes('not found')
  ) {
    return new NotFoundError({
      message: supabaseError.message || 'Resource not found',
      resource: 'unknown',
    });
  }

  // Default to DatabaseError
  return new DatabaseError({
    message: supabaseError.message || 'Database operation failed',
    code: supabaseError.code,
    details: supabaseError.details,
    hint: supabaseError.hint,
  });
}

/**
 * Get all items from the items table
 */
export function getAllItemsEffect(
  supabase: AppSupabaseClient
): Effect.Effect<Array<Table<'items'>>, DatabaseError | NotFoundError> {
  return Effect.tryPromise({
    try: async () => {
      const { data, error } = await supabase.from('items').select('*');

      if (error) {
        throw error;
      }

      return data;
    },
    catch: (error) => mapSupabaseError(error),
  });
}

/**
 * Get a single item by ID
 */
export function getItemEffect(
  supabase: AppSupabaseClient,
  id: string
): Effect.Effect<Table<'items'>, DatabaseError | NotFoundError> {
  return Effect.tryPromise({
    try: async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    catch: (error) => mapSupabaseError(error),
  });
}

/**
 * Delete an item by ID
 */
export function deleteItemEffect(
  supabase: AppSupabaseClient,
  id: string
): Effect.Effect<boolean, DatabaseError | NotFoundError> {
  return Effect.tryPromise({
    try: async () => {
      const { error } = await supabase.from('items').delete().match({ id });

      if (error) {
        throw error;
      }

      return true;
    },
    catch: (error) => mapSupabaseError(error),
  });
}

/**
 * Get all private items from the private_items table
 */
export function getAllPrivateItemsEffect(
  supabase: AppSupabaseClient
): Effect.Effect<Array<Table<'private_items'>>, DatabaseError | NotFoundError> {
  return Effect.tryPromise({
    try: async () => {
      const { data, error } = await supabase.from('private_items').select('*');

      if (error) {
        throw error;
      }

      return data;
    },
    catch: (error) => mapSupabaseError(error),
  });
}

/**
 * Get a single private item by ID
 */
export function getPrivateItemEffect(
  supabase: AppSupabaseClient,
  id: string
): Effect.Effect<Table<'private_items'>, DatabaseError | NotFoundError> {
  return Effect.tryPromise({
    try: async () => {
      const { data, error } = await supabase
        .from('private_items')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    catch: (error) => mapSupabaseError(error),
  });
}

/**
 * Delete a private item by ID
 */
export function deletePrivateItemEffect(
  supabase: AppSupabaseClient,
  id: string
): Effect.Effect<boolean, DatabaseError | NotFoundError> {
  return Effect.tryPromise({
    try: async () => {
      const { error } = await supabase
        .from('private_items')
        .delete()
        .match({ id });

      if (error) {
        throw error;
      }

      return true;
    },
    catch: (error) => mapSupabaseError(error),
  });
}

/**
 * Insert a new private item
 */
export function insertPrivateItemEffect(
  supabase: AppSupabaseClient,
  item: { name: string; description: string }
): Effect.Effect<Table<'private_items'>, DatabaseError | NotFoundError> {
  return Effect.tryPromise({
    try: async () => {
      const { data, error } = await supabase
        .from('private_items')
        .insert(item)
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    catch: (error) => mapSupabaseError(error),
  });
}
