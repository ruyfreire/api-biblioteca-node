import { Request, Response } from 'express'
import { validatorCreateBook } from '../../utils/Validators/bookValidator'
import { BookService, ICreateBook } from '../../services/BookService'
import { handlerValidationError } from '../../utils/Validators/handlerValidation'
import { logger } from '../../utils/Logger'

export class UpdateBookController {
  constructor(private service: BookService) {}

  async execute(req: Request, res: Response) {
    try {
      const { id } = req.params
      const book = req.body as ICreateBook

      if (!Number(id)) {
        const error = {
          code: 'error.validation',
          message: 'ID inválido'
        }

        logger.error('update book controller | error:', { error })

        return res.status(400).json(error)
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
      })
    } catch (error: Error | any) {
      logger.error('update book controller | error:', { error })

      const validationError = handlerValidationError(error)

      if (validationError) {
        return res.status(400).json(validationError)
      }

      if (error.status) {
        return res.status(error.status).json({
          code: error.code,
          message: error.message,
          data: error.data
        })
      }

      return res.status(500).json({
        code: 'error.internal',
        message: error.message
      })
    }
  }
}
