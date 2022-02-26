import { ValidationError } from 'yup'
import { ResponseBuilder } from '../ResponseBuilder'

export const handlerValidationError = (error: any) => {
  if (error instanceof ValidationError) {
    return new ResponseBuilder({
      status: 400,
      code: 'error.validation',
      message: 'Erro de validação dos campos',
      data: error.errors
    })
  }

  return null
}
