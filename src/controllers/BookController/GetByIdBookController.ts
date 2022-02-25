import { Request, Response } from 'express'
import { BookService } from '../../services/BookService'
import { logger } from '../../utils/Logger'
import {
  handlerErrorsBuilder,
  ResponseBuilder
} from '../../utils/ResponseBuilder'

export class GetByIdBookController {
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

        logger.error('get book by id controller | error:', { error })

        return res.status(error.status).json(error)
      }

      const book = await this.service.getById(Number(id))

      if (!book) {
        logger.warn(
          `get book by id controller | Livro não encontrado | ID: ${id}`
        )

        return res.status(404).json({
          code: 'error.notFound',
          message: 'Livro não encontrado'
        } as ResponseBuilder)
      }

      logger.info(
        `get book by id controller | Livro recuperado com sucesso | ID: ${id}`
      )

      return res.status(200).json({
        code: 'success',
        message: 'Livro encontrado com sucesso',
        data: book
      } as ResponseBuilder)
    } catch (error: Error | any) {
      const errorBuilder = handlerErrorsBuilder(error)

      logger.error('get book by id controller | error:', {
        error: errorBuilder,
        originalError: error
      })

      return res.status(errorBuilder.status).json(errorBuilder)
    }
  }
}
