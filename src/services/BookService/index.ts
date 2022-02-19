import { Book, Author } from '.prisma/client'
import { prismaClient } from '../../prisma'
import { handlerErrorsPrisma } from '../../utils/HandlerErrorsPrisma'

export interface ICreateBook {
  name: string
  summary: string
  authors?: number[]
}

export interface IBookCreated extends Book {
  authors: Author[]
}

export class BookService {
  async create(book: ICreateBook): Promise<IBookCreated> {
    try {
      const authorList = book?.authors || []

      if (authorList.length === 0) {
        throw {
          code: 'error.validation',
          status: 400,
          message: 'É necessário informar pelo menos um autor',
          data: null
        }
      }

      const authorFoundList: number[] = []
      const authorNotFound: number[] = []
      await new Promise((resolve, reject) => {
        authorList.forEach((authorId) => {
          prismaClient.author
            .findFirst({
              where: {
                id: authorId
              },
              select: {
                id: true
              }
            })
            .then((author) => {
              if (author) {
                authorFoundList.push(author.id)
              } else {
                authorNotFound.push(authorId)
              }
            })
            .catch(reject)
            .finally(() => resolve(true))
        })
      })

      if (authorNotFound.length > 0) {
        throw {
          code: 'error.notFound',
          status: 400,
          message: 'Um ou mais autores não foram encontrados',
          data: authorNotFound
        }
      }

      const newAuthorsList = authorFoundList.map((currentAuthor) => ({
        author: {
          connect: {
            id: currentAuthor
          }
        }
      }))

      const newBook = await prismaClient.book.create({
        data: {
          name: book.name,
          summary: book.summary,
          authors: {
            create: newAuthorsList
          }
        },
        include: {
          authors: {
            select: {
              author: true
            }
          }
        }
      })

      const bookResponse = {
        ...newBook,
        authors: newBook.authors.map((current) => current.author)
      }

      return bookResponse
    } catch (error: any) {
      const errorBuilder = handlerErrorsPrisma(error)

      if (errorBuilder.status) {
        throw errorBuilder
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
