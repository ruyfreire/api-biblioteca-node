import { Request, Response } from 'express'
import { validatorCreateBook } from '../../utils/Validators/bookValidator'
import { BookService, ICreateBook } from '../../services/BookService'
import { handlerValidationError } from '../../utils/Validators/handlerValidation'
import { logger } from '../../utils/Logger'
import {
  handlerErrorsBuilder,
  ResponseBuilder
} from '../../utils/ResponseBuilder'

export class UpdateBookController {
  constructor(private service: BookService) {}

  async execute(req: Request, res: Response) {
    try {
      const { id } = req.params
      const book = req.body as ICreateBook

      if (!Number(id)) {
        const error = new ResponseBuilder({
          status: 400,
          code: 'error.validation',
          message: 'ID inválido'
        })

        logger.error('update book controller | error:', { error })

        return res.status(error.status).json(error)
      }

      await validatorCreateBook(book)

      const updatedBook = await this.service.update(Number(id), book)

      logger.info(
        `update book controller | Livro atualizado com sucesso | ID: ${id}`
      )

      return res.status(200).json({
        code: 'success',
        message: 'Livro atualizado com sucesso',
        data: updatedBook
      } as ResponseBuilder)
    } catch (error: Error | any) {
      const validationError = handlerValidationError(error)

      if (validationError) {
        return res.status(400).json(validationError)
      }

      const errorBuilder = handlerErrorsBuilder(error)

      logger.error('update book controller | error:', {
        error: errorBuilder,
        originalError: error
      })

      return res.status(errorBuilder.status).json(errorBuilder)
    }
  }
}
