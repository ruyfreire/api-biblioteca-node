import { v4 as uuidv4 } from 'uuid'
import { Prisma } from '@prisma/client'

interface IMetaError {
  target: Array<string>
  cause: string
}

interface IPrismaKnownError extends Prisma.PrismaClientKnownRequestError {
  meta: IMetaError
}

export interface ResponseBuilderOptions {
  code:
    | 'success'
    | 'error.validation'
    | 'error.internal'
    | 'error.notFound'
    | 'error.notAuthorized'
    | 'error.database.internal'
    | 'error.database.unique'
    | 'error.database.notFound'
    | 'error.database.validation'
  status: number
  message: string
  data?: any
}

export class ResponseBuilder {
  id_error
  code
  status
  message
  data

  constructor({ code, status, message, data }: ResponseBuilderOptions) {
    this.id_error = uuidv4()
    this.code = code
    this.status = status
    this.message = message
    this.data = data || null
  }
}

export const handlerErrorsBuilder = (
  error: any,
  messageError?: string
): ResponseBuilder => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002: Valor único que nao pode ser alterado
    if (error.code === 'P2002') {
      const { meta } = error as IPrismaKnownError
      const { target = [] } = meta || {}

      return new ResponseBuilder({
        status: 400,
        code: 'error.database.unique',
        message: 'Dados já existem no banco',
        data: {
          duplicate_fields: target
        }
      })
    }

    // P2025: Recurso não encontrado
    if (error.code === 'P2025') {
      const { meta } = error as IPrismaKnownError
      const { cause = '' } = meta || {}

      return new ResponseBuilder({
        status: 404,
        code: 'error.database.notFound',
        message: 'Um ou mais registros nao foram encontrados no banco',
        data: cause
      })
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return new ResponseBuilder({
      status: 500,
      code: 'error.database.validation',
      message: 'Erro de validação dos campos ao comunicar com banco'
    })
  }

  if (error instanceof ResponseBuilder) {
    return error
  } else {
    return new ResponseBuilder({
      status: 500,
      code: 'error.database.internal',
      message: messageError || error.message
    })
  }
}
