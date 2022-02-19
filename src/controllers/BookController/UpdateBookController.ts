import { Request, Response } from 'express'
import { validatorCreateBook } from '../../utils/Validators/bookValidator'
import { BookService, ICreateBook } from '../../services/BookService'
import { handlerValidationError } from '../../utils/Validators/handlerValidation'

export class UpdateBookController {
  constructor(private service: BookService) {}

  async execute(req: Request, res: Response) {
    try {
      const { id } = req.params
      const book = req.body as ICreateBook

      if (!Number(id)) {
        return res.status(400).json({
          code: 'error.validation',
          message: 'ID inválido'
        })
      }

      await validatorCreateBook(book)

      const updatedBook = await this.service.update(Number(id), book)

      return res.status(200).json({
        code: 'success',
        message: 'Livro atualizado com sucesso',
        data: updatedBook
      })
    } catch (error: Error | any) {
      const validationError = handlerValidationError(error)

      if (validationError) {
        return res.status(400).json(validationError)
      }

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
