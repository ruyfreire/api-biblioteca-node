import { Request, Response } from 'express'
import { BookService } from '../../services/BookService'
import { logger } from '../../utils/Logger'

export class GetByIdBookController {
  constructor(private service: BookService) {}

  async execute(req: Request, res: Response) {
    try {
      const { id } = req.params

      if (!Number(id)) {
        const error = {
          code: 'error.validation',
          message: 'ID inválido'
        }

        logger.error('get book by id controller | error:', { error })

        return res.status(400).json(error)
      }

      const book = await this.service.getById(Number(id))

      if (!book) {
        logger.warn(
          `get book by id controller | Livro não encontrado | ID: ${id}`
        )

        return res.status(404).json({
          code: 'error.notFound',
          message: 'Livro não encontrado'
        })
      }

      logger.info(
        `get book by id controller | Livro recuperado com sucesso | ID: ${id}`
      )

      return res.status(200).json({
        code: 'success',
        message: 'Livro encontrado com sucesso',
        data: book
      })
    } catch (error: Error | any) {
      logger.error('get book by id controller | error:', { error })

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
