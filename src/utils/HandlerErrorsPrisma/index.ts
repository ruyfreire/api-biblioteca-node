import { Prisma } from '@prisma/client'

interface IMetaError {
  target: Array<string>
  cause: string
}

interface IPrismaKnownError extends Prisma.PrismaClientKnownRequestError {
  meta: IMetaError
}

export const handlerErrorsPrisma = (error: any) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002: Valor único que nao pode ser alterado
    if (error.code === 'P2002') {
      const { meta } = error as IPrismaKnownError
      const { target = [] } = meta || {}

      return {
        code: 'error',
        message: 'Dados já existem no banco',
        data: {
          duplicate_fields: target
        }
      }
    }

    // P2025: Recurso não encontrado
    if (error.code === 'P2025') {
      const { meta } = error as IPrismaKnownError
      const { cause = '' } = meta || {}

      return {
        code: 'error',
        message: 'Um ou mais registros nao foram encontrados no banco',
        data: cause
      }
    }

    return {
      error: 'error',
      message: 'Erro na comunicação com banco',
      data: error.message
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      code: 'error',
      message: 'Erro de validação dos campos ao comunicar com banco',
      data: error.message
    }
  }

  return ''
}
