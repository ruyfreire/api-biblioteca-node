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

      if (!Number(id)) {
        const error = new ResponseBuilder({
          status: 400,
          code: 'error.validation',
          message: 'ID inválido'
        })

        logger.error('delete book controller | error:', { error })

        return res.status(error.status).json(error)
      }

      await this.service.delete(Number(id))

      logger.info(
        `delete book controller | Livro deletado com sucesso | ID: ${id}`
      )

      return res.status(200).json({
        code: 'success',
        message: 'Livro deletado com sucesso'
      } as ResponseBuilder)
    } catch (error: Error | any) {
      const errorBuilder = handlerErrorsBuilder(error)

      logger.error('delete book controller | error:', {
        error: errorBuilder,
        originalError: error
      })

      return res.status(errorBuilder.status).json(errorBuilder)
    }
  }
}
