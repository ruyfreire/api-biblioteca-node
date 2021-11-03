import { ValidationError } from 'yup'

export const handlerValidationError = (error: any) => {
  if (error instanceof ValidationError) {
    return {
      message: 'Erro de validação dos campos',
      data: error.errors
    }
  }

  return null
}
