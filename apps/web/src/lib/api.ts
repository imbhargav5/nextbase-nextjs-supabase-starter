import * as z from 'zod'

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

export function ok<T>(data: T): ActionResult<T> {
  return { success: true, data }
}

export function fail(
  error: string,
  fieldErrors?: Record<string, string[]>
): ActionResult<never> {
  return { success: false, error, fieldErrors }
}

export function fromZodError(err: z.ZodError): ActionResult<never> {
  const flat = z.flattenError(err)
  return {
    success: false,
    error: 'Validasi gagal',
    fieldErrors: flat.fieldErrors as Record<string, string[]>,
  }
}