import prisma from '~/lib/db'

export async function findGoals(userId: string) {
  return prisma.goal.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}
