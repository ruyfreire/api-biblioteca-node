import { NextFunction, Request, Response } from 'express'
import { SchemaOf, string, array, ValidationError } from 'yup'

import { ICreateBook } from '../../services/BookService'
import { logger } from '../Logger'
import { ResponseBuilder } from '../ResponseBuilder'
import { GlobalSchema } from './globalSchema'

const schemaCreateBook: SchemaOf<ICreateBook> = GlobalSchema.shape({
  name: string().min(3).max(100).required(),
  summary: string().min(6).max(500).required(),
  authors: array()
    .of(string().uuid().required())
    .min(1, 'O array de autores precisa ter pelo menos um autor')
    .required()
})

export const validatorBook = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  schemaCreateBook
    .validate(req.body, {
      abortEarly: false
    })
    .then(() => next())
    .catch((error: ValidationError) => {
      const errorBuilder = new ResponseBuilder({
        status: 400,
        code: 'error.validation',
        message: 'Erro de validação dos campos',
        data: error.errors
      })

      logger.error('book validator | error:', {
        error: errorBuilder,
        originalError: error
      })

      return res.status(errorBuilder.status).json(errorBuilder)
    })
}
