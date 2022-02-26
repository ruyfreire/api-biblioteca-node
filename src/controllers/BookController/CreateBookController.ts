import { Request, Response } from 'express'

import { BookService, ICreateBook } from '../../services/BookService'
import { logger } from '../../utils/Logger'
import {
  handlerErrorsBuilder,
  ResponseBuilder
} from '../../utils/ResponseBuilder'

export class CreateBookController {
  constructor(private service: BookService) {}

  async execute(req: Request, res: Response) {
    try {
      const book = req.body as ICreateBook

      const newBook = await this.service.create(book)

      logger.info(
        `create book controller | Livro criado com sucesso | ID: ${newBook.id}`
      )

      return res.status(201).json({
        code: 'success',
        message: 'Livro criado com sucesso',
        data: newBook
      } as ResponseBuilder)
    } catch (error: Error | any) {
      const errorBuilder = handlerErrorsBuilder(error)

      logger.error('create book controller | error:', {
        error: errorBuilder,
        originalError: error
      })

      return res.status(errorBuilder.status).json(errorBuilder)
    }
  }
}
