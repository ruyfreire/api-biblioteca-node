import { Request, Response } from 'express'

import { BookService } from '../../services/BookService'
import { logger } from '../../utils/Logger'
import {
  handlerErrorsBuilder,
  ResponseBuilder
} from '../../utils/ResponseBuilder'

export class DeleteBookController {
  constructor(private service: BookService) {}

  async execute(req: Request, res: Response) {
    try {
      const { id } = req.params

      await this.service.delete(id)

      logger.info(
        `delete book controller | Livro deletado com sucesso | ID: ${id}`
      )

      return res.status(200).json({
        code: 'success',
        message: 'Livro deletado com sucesso'
      } as ResponseBuilder)
    } catch (error: Error | any) {
      const errorBuilder = handlerErrorsBuilder(error)

      logger.error(`delete book controller | ID: ${req.params.id} | error:`, {
        error: errorBuilder,
        originalError: error
      })

      return res.status(errorBuilder.status).json(errorBuilder)
    }
  }
}
