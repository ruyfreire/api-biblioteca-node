import { Request, Response } from 'express'
import { BookService } from '../../services/BookService'
import { logger } from '../../utils/Logger'

export class DeleteBookController {
  constructor(private service: BookService) {}

  async execute(req: Request, res: Response) {
    try {
      const { id } = req.params

      if (!Number(id)) {
        const error = {
          code: 'error.validation',
          message: 'ID inválido'
        }

        logger.error('delete book controller | error:', { error })

        return res.status(400).json(error)
      }

      await this.service.delete(Number(id))

      logger.info(
        `delete book controller | Livro deletado com sucesso | ID: ${id}`
      )

      return res.status(200).json({
        code: 'success',
        message: 'Livro deletado com sucesso'
      })
    } catch (error: Error | any) {
      logger.error('delete book controller | error:', { error })

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
