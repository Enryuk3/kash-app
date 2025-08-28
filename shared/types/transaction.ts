export type Category = {
  id: string
  name: string
  type: 'income' | 'expense'
  icon?: string
  color?: string
}

export type Transaction = {
  id: string
  description: string
  amount: number
  date: string
  category: Category
  createdAt: string
  updatedAt: string
}
