import { Request, Response } from 'express'
import { BookService } from '../../services/BookService'

export class GetByIdBookController {
  constructor(private service: BookService) {}

  async execute(req: Request, res: Response) {
    try {
      const { id } = req.params

      if (!Number(id)) {
        return res.status(400).json({
          code: 'error',
          message: 'ID inválido'
        })
      }

      const book = await this.service.getById(Number(id))

      if (!book) {
        return res.status(404).json({
          code: 'error',
          message: 'Livro não encontrado'
        })
      }

      return res.status(200).json({
        code: 'success',
        message: 'Livro encontrado com sucesso',
        data: book
      })
    } catch (error: Error | any) {
      if (error.status) {
        return res.status(error.status).json({
          code: error.code,
          message: error.message,
          data: error.data || ''
        })
      }

      return res.status(500).json({
        code: 'error',
        message: error.message
      })
    }
  }
}
