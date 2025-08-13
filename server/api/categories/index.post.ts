import prisma from '~/lib/db'

export default defineAuthenticatedEventHandler(async (event) => {
  const result = await readValidatedBody(event, categorySchema.safeParse)

  if (!result.success) {
    const statusMessage = result.error.issues
      .map(issue => `${issue.path.join('')}: ${issue.message}`)
      .join('; ')

    return sendError(event, createError({
      statusCode: 422,
      statusMessage,
      data: result.error.issues,
    }))
  }

  const existingCategory = await prisma.category.findFirst({
    where: {
      name: result.data.name,
      userId: event.context.user.id,
    },
    select: { id: true },
  })

  if (existingCategory) {
    return sendError(event, createError({
      statusCode: 409,
      statusMessage: 'Ya existe una categoría con este nombre',
    }))
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
      return sendError(event, createError({
        statusCode: 400,
        statusMessage: 'Datos inválidos',
        data: (error as any).errors,
      }))
    }

    if (error && typeof error === 'object' && 'code' in error) {
      // Error de duplicado
      if (error.code === 'P2002') {
        return sendError(event, createError({
          statusCode: 409,
          statusMessage: 'Ya existe una categoría con este nombre para este tipo',
          data: { field: 'name' },
        }))
      }
    }

    console.error('Error al crear categoría:', error)
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Error al crear la categoría',
    }))
  }
})
