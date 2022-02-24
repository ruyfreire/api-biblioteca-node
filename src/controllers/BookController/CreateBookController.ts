import { Request, Response } from 'express'
import { validatorCreateBook } from '../../utils/Validators/bookValidator'
import { BookService, ICreateBook } from '../../services/BookService'
import { handlerValidationError } from '../../utils/Validators/handlerValidation'
import { logger } from '../../utils/Logger'

export class CreateBookController {
  constructor(private service: BookService) {}

  async execute(req: Request, res: Response) {
    try {
      const book = req.body as ICreateBook

      await validatorCreateBook(book)

      const newBook = await this.service.create(book)

      logger.info(
        `create book controller | Livro criado com sucesso | ID: ${newBook.id}`
      )

      return res.status(201).json({
        code: 'success',
        message: 'Livro criado com sucesso',
        data: newBook
      })
    } catch (error: Error | any) {
      logger.error('create book controller | error:', { error })

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
