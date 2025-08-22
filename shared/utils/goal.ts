import { z } from 'zod'

export const goalSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es requerido' }),
  description: z.string().nullable().optional(),
  targetAmount: z.number().min(1, { error: 'La meta debe ser mayor a cero' }),
  currentAmount: z.number().min(0),
  targetDate: z.string().nullable().optional(),
})

export type GoalFormData = z.infer<typeof goalSchema>
