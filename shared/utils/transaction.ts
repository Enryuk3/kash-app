import { z } from 'zod'

export const transactionSchema = z.object({
  type: z.enum(['income', 'expense'], { error: 'Tipo inválido' }),
  amount: z.number({ error: 'El monto es requerido' })
    .positive({ error: 'El monto debe ser mayor a cero' }),
  description: z.string({ error: 'La descripción es requerida' })
    .min(3, { error: 'La descripción es muy corta' }),
  date: z.string({ error: 'La fecha es requerida' }),
  categoryId: z.string({ error: 'Se requiere una categoría' })
    .min(1, { error: 'Se requiere una categoría' }),
})
