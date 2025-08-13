import prisma from '~/lib/db'

export async function findCategories(userId: string) {
  return prisma.category.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
  })
}
