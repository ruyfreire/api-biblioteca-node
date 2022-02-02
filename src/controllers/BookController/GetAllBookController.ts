import { Request, Response } from 'express'
import { BookService } from '../../services/BookService'

export class GetAllBookController {
  constructor(private service: BookService) {}

  async execute(req: Request, res: Response): Promise<Response> {
    try {
      const books = await this.service.getAll()

      return res.status(200).json({
        code: 'success',
        message: 'Listagem com todos os livros',
        data: books
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
        code: 'error.internal',
        message: error.message
      })
    }
  }
}
