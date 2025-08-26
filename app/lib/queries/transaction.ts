import prisma from '~/lib/db'

export async function findTransactions(userId: string) {
  return prisma.transaction.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { date: 'desc' },
  })
}

export async function findTransactionById(id: string, userId: string) {
  return prisma.transaction.findUnique({
    where: { id, userId },
    include: {
      category: true,
    },
  })
}

export async function deleteTransactionById(id: string, userId: string) {
  return prisma.transaction.deleteMany({
    where: {
      id,
      category: {
        userId,
      },
    },
  })
}
