import { z } from 'zod'

export const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().positive('El monto debe ser mayor a cero'),
  description: z.string().min(3, 'La descripción es muy corta'),
  date: z.string(),
  categoryId: z.string().min(1, 'Se requiere una categoría'),
})
