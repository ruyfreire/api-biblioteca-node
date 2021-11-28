import { Book } from '.prisma/client'
import { prismaClient } from '../../prisma'
import { handlerErrorsPrisma } from '../../utils/HandlerErrorsPrisma'

export interface ICreateBook {
  name: string
  summary: string
}

export class BookService {
  async create(book: ICreateBook): Promise<Book> {
    try {
      const newBook = await prismaClient.book.create({
        data: book
      })

      return newBook
    } catch (error) {
      const errorPrisma = handlerErrorsPrisma(error)

      if (errorPrisma) {
        throw errorPrisma
      }

      throw new Error('Erro para criar novo livro')
    }
  }

  async getAll(): Promise<Book[]> {
    try {
      const books = await prismaClient.book.findMany()

      return books
    } catch (error) {
      const errorPrisma = handlerErrorsPrisma(error)

      if (errorPrisma) {
        throw errorPrisma
      }

      throw new Error('Erro para buscar lista de livros no banco')
    }
  }
}
