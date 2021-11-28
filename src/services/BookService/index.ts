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

  async getById(id: number): Promise<Book | null> {
    try {
      const book = await prismaClient.book.findFirst({
        where: {
          id
        }
      })

      return book
    } catch (error) {
      const errorPrisma = handlerErrorsPrisma(error)

      if (errorPrisma) {
        throw errorPrisma
      }

      throw new Error('Erro para buscar livro no banco')
    }
  }

  async update(id: number, book: ICreateBook): Promise<Book> {
    try {
      const updatedBook = await prismaClient.book.update({
        where: {
          id
        },
        data: book
      })

      return updatedBook
    } catch (error) {
      const errorPrisma = handlerErrorsPrisma(error)

      if (errorPrisma) {
        throw errorPrisma
      }

      throw new Error('Erro para atualizar livro no banco')
    }
  }

  async delete(id: number): Promise<Book> {
    try {
      const deletedBook = await prismaClient.book.delete({
        where: {
          id
        }
      })

      return deletedBook
    } catch (error) {
      const errorPrisma = handlerErrorsPrisma(error)

      if (errorPrisma) {
        throw errorPrisma
      }

      throw new Error('Erro para deletar livro do banco')
    }
  }
}
