import { Request, Response } from 'express'
import { BookService } from '../../services/BookService'
import { logger } from '../../utils/Logger'
import {
  handlerErrorsBuilder,
  ResponseBuilder
} from '../../utils/ResponseBuilder'

export class GetAllBookController {
  constructor(private service: BookService) {}

  async execute(req: Request, res: Response): Promise<Response> {
    try {
      const books = await this.service.getAll()

      logger.info('get all books controller | Livros recuperados com sucesso')

      return res.status(200).json({
        code: 'success',
        message: 'Listagem com todos os livros',
        data: books
      } as ResponseBuilder)
    } catch (error: Error | any) {
      const errorBuilder = handlerErrorsBuilder(error)

      logger.error('get all books controller | error:', {
        error: errorBuilder,
        originalError: error
      })

      return res.status(errorBuilder.status).json(errorBuilder)
    }
  }
}
