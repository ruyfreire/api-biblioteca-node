import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError
} from '@prisma/client/runtime'

interface IMetaError {
  target: Array<string>
}

interface IPrismaKnownError extends PrismaClientKnownRequestError {
  meta: IMetaError
}

export const handlerErrorsPrisma = (error: any) => {
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      const { meta } = error as IPrismaKnownError
      const { target = [] } = meta || {}

      return {
        code: 'error',
        message: 'Autor já existe',
        data: {
          duplicate_fields: target
        }
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
