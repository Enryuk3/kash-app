import prisma from '~/lib/db'

export default defineAuthenticatedEventHandler(async (event) => {
  const result = await readValidatedBody(event, categorySchema.safeParse)

  if (!result.success) {
    return sendZodError(event, result.error)
  }

  const existingCategory = await prisma.category.findFirst({
    where: {
      name: result.data.name,
      userId: event.context.user.id,
    },
    select: { id: true },
  })

  if (existingCategory) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Ya existe una categoría con este nombre',
    })
  }

  try {
    const category = await prisma.category.create({
      data: {
        ...result.data,
        userId: event.context.user.id,
      },
    })

    return {
      statusCode: 201,
      data: category,
    }
  }
  catch (error) {
    if (error && typeof error === 'object' && 'errors' in error) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Datos inválidos',
        data: (error as any).errors,
      })
    }

    if (error && typeof error === 'object' && 'code' in error) {
      // Error de duplicado
      if (error.code === 'P2002') {
        throw createError({
          statusCode: 409,
          statusMessage: 'Ya existe una categoría con este nombre para este tipo',
          data: { field: 'name' },
        })
      }
    }

    console.error('Error al crear categoría:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al crear la categoría',
    })
  }
})
