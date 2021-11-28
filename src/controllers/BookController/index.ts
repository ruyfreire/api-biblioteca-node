import { Request, Response } from 'express'
import { BookService, ICreateBook } from '../../services/BookService'
import { schemaCreateBook } from '../../utils/Validators/bookValidator'
import { handlerValidationError } from '../../utils/Validators/handlerValidation'

export class BookController {
  async create(req: Request, res: Response) {
    try {
      const book = req.body as ICreateBook

      await schemaCreateBook.validate(book)

      const serviceBook = new BookService()
      const newBook = await serviceBook.create(book)

      return res.status(201).json({
        code: 'success',
        message: 'Livro criado com sucesso',
        book: newBook
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
