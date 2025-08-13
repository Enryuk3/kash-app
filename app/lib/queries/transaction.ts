import prisma from '~/lib/db'

export async function findTransactions(userId: string) {
  return prisma.transaction.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { date: 'desc' },
  })
}
