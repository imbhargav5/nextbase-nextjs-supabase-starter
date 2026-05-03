import * as z from 'zod'

export const emailSchema = z.string().email('Email tidak valid')
export const passwordSchema = z.string().min(8, 'Minimal 8 karakter')

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const profileSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: emailSchema,
  bio: z.string().max(160).optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type ProfileInput = z.infer<typeof profileSchema>