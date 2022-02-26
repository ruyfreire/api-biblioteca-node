import { NextFunction, Request, Response } from 'express'
import { SchemaOf, string, ValidationError } from 'yup'

import { ICreateAuthor } from '../../services/AuthorService'
import { logger } from '../Logger'
import { ResponseBuilder } from '../ResponseBuilder'
import { GlobalSchema } from './globalSchema'

export const schemaCreateAuthor: SchemaOf<ICreateAuthor> = GlobalSchema.shape({
  name: string().min(2).max(100).required()
})

export const validatorAuthor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  schemaCreateAuthor
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

      logger.error('author validator | error:', {
        error: errorBuilder,
        originalError: error
      })

      return res.status(errorBuilder.status).json(errorBuilder)
    })
}
