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

  async getAll(req: Request, res: Response) {
    try {
      const serviceBook = new BookService()
      const books = await serviceBook.getAll()

      return res.status(200).json({
        code: 'success',
        message: 'Listagem com todos os livros',
        books
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

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params

      if (!Number(id)) {
        return res.status(400).json({
          code: 'error',
          message: 'ID inválido'
        })
      }

      const serviceBook = new BookService()
      const book = await serviceBook.getById(Number(id))

      if (!book) {
        return res.status(404).json({
          code: 'error',
          message: 'Livro não encontrado'
        })
      }

      return res.status(200).json({
        code: 'success',
        message: 'Livro encontrado com sucesso',
        book
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

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params
      const book = req.body as ICreateBook

      if (!Number(id)) {
        return res.status(400).json({
          code: 'error',
          message: 'ID inválido'
        })
      }

      await schemaCreateBook.validate(book)

      const serviceBook = new BookService()
      const updatedBook = await serviceBook.update(Number(id), book)

      return res.status(201).json({
        code: 'success',
        message: 'Livro atualizado com sucesso',
        book: updatedBook
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

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params

      if (!Number(id)) {
        return res.status(400).json({
          code: 'error',
          message: 'ID inválido'
        })
      }

      const serviceBook = new BookService()
      const deletedBook = await serviceBook.delete(Number(id))

      return res.status(200).json({
        code: 'success',
        message: 'Livro deletado com sucesso',
        book: deletedBook
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
