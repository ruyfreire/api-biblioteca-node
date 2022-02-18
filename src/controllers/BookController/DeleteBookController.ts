import { Request, Response } from 'express'
import { BookService } from '../../services/BookService'

export class DeleteBookController {
  constructor(private service: BookService) {}

  async execute(req: Request, res: Response) {
    try {
      const { id } = req.params

      if (!Number(id)) {
        return res.status(400).json({
          code: 'error.validation',
          message: 'ID inválido'
        })
      }

      await this.service.delete(Number(id))

      return res.status(200).json({
        code: 'success',
        message: 'Livro deletado com sucesso'
      })
    } catch (error: Error | any) {
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
