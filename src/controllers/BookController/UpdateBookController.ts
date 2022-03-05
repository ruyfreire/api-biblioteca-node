import { Request, Response } from 'express'

import { BookService, ICreateBook } from '../../services/BookService'
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

      const updatedBook = await this.service.update(id, book)

      logger.info(
        `update book controller | Livro atualizado com sucesso | ID: ${id}`
      )

      return res.status(200).json({
        code: 'success',
        message: 'Livro atualizado com sucesso',
        data: updatedBook
      } as ResponseBuilder)
    } catch (error: Error | any) {
      const errorBuilder = handlerErrorsBuilder(error)

      logger.error(`update book controller | ID: ${req.params.id} | error:`, {
        error: errorBuilder,
        originalError: error
      })

      return res.status(errorBuilder.status).json(errorBuilder)
    }
  }
}
