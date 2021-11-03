import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError
} from '@prisma/client/runtime'

export const handlerErrorsPrisma = (error: any) => {
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return {
        code: 'error',
        message: 'Autor já existe',
        data: error.meta
      }
    }

    return {
      error: 'error',
      message: 'Erro para criar novo autor',
      data: error.message
    }
  }

  if (error instanceof PrismaClientValidationError) {
    return {
      code: 'error',
      message: 'Erro de validação dos campos ao salvar no banco',
      data: error.message
    }
  }

  return ''
}
