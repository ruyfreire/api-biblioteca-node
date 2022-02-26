import { Book, Author } from '.prisma/client'
import { prismaClient } from '../../prisma'
import { ResponseBuilder } from '../../utils/ResponseBuilder'
import { handlerErrorsBuilder } from '../../utils/ResponseBuilder'
import { logger } from '../../utils/Logger'

export interface ICreateBook {
  name: string
  summary: string
  authors: string[]
}

const formatResponseBook = (
  books: Book & {
    authors: {
      author: Author
    }[]
  }
): Book & { authors: Author[] } => ({
  ...books,
  authors: books.authors.map((current) => current.author)
})

export class BookService {
  async create(book: ICreateBook): Promise<Book> {
    try {
      const authorList = book?.authors || []

      if (authorList.length === 0) {
        throw new ResponseBuilder({
          code: 'error.validation',
          status: 400,
          message: 'É necessário informar pelo menos um autor',
          data: null
        })
      }

      const authorsFound = await prismaClient.author.findMany({
        where: {
          id: {
            in: authorList
          }
        }
      })

      if (authorsFound.length !== authorList.length) {
        throw new ResponseBuilder({
          code: 'error.notFound',
          status: 400,
          message: 'Um ou mais autores não foram encontrados',
          data: authorList.filter(
            (authorId) => !authorsFound.some((author) => author.id === authorId)
          )
        })
      }

      const newBook = await prismaClient.book.create({
        data: {
          name: book.name,
          summary: book.summary,
          authors: {
            create: authorList.map((authorId) => ({
              author: {
                connect: {
                  id: authorId
                }
              }
            }))
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

      const bookResponse = formatResponseBook(newBook)

      return bookResponse
    } catch (error: any) {
      const defaultError = 'Erro para criar novo livro'
      const errorBuilder = handlerErrorsBuilder(error, defaultError)

      logger.error('create book service | error:', {
        error: errorBuilder,
        originalError: error
      })

      throw errorBuilder
    }
  }

  async getAll(): Promise<Book[]> {
    try {
      const books = await prismaClient.book.findMany({
        include: {
          authors: {
            select: {
              author: true
            }
          }
        }
      })

      const booksResponse = books.map(formatResponseBook)

      return booksResponse
    } catch (error) {
      const defaultError = 'Erro para buscar lista de livros no banco'
      const errorBuilder = handlerErrorsBuilder(error, defaultError)

      logger.error('get all books service | error:', {
        error: errorBuilder,
        originalError: error
      })

      throw errorBuilder
    }
  }

  async getById(id: string): Promise<Book | null> {
    try {
      const book = await prismaClient.book.findFirst({
        where: {
          id
        },
        include: {
          authors: {
            select: {
              author: true
            }
          }
        }
      })

      if (book) {
        const bookResponse = formatResponseBook(book)

        return bookResponse
      }

      return book
    } catch (error) {
      const defaultError = 'Erro para buscar livro no banco'
      const errorBuilder = handlerErrorsBuilder(error, defaultError)

      logger.error(`get book by id service | ID: ${id} | error:`, {
        error: errorBuilder,
        originalError: error
      })

      throw errorBuilder
    }
  }

  async update(id: string, book: ICreateBook): Promise<Book> {
    try {
      const authorList = book?.authors || []

      if (authorList.length === 0) {
        throw new ResponseBuilder({
          code: 'error.validation',
          status: 400,
          message: 'É necessário informar pelo menos um autor',
          data: null
        })
      }

      const authorsFound = await prismaClient.author.findMany({
        where: {
          id: {
            in: authorList
          }
        }
      })

      if (authorsFound.length !== authorList.length) {
        throw new ResponseBuilder({
          code: 'error.notFound',
          status: 400,
          message: 'Um ou mais autores não foram encontrados',
          data: authorList.filter(
            (authorId) => !authorsFound.some((author) => author.id === authorId)
          )
        })
      }

      const updatedBook = await prismaClient.book.update({
        where: {
          id
        },
        data: {
          name: book.name,
          summary: book.summary,
          authors: {
            connectOrCreate: authorList.map((authorId) => ({
              create: {
                author: {
                  connect: {
                    id: authorId
                  }
                }
              },
              where: {
                authorId_bookId: {
                  bookId: id,
                  authorId
                }
              }
            })),
            deleteMany: [
              {
                authorId: {
                  notIn: authorList
                },
                bookId: id
              }
            ]
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

      const bookResponse = formatResponseBook(updatedBook)

      return bookResponse
    } catch (error) {
      const defaultError = 'Erro para atualizar livro no banco'
      const errorBuilder = handlerErrorsBuilder(error, defaultError)

      logger.error(`update book service | ID: ${id} | error:`, {
        error: errorBuilder,
        originalError: error
      })

      throw errorBuilder
    }
  }

  async delete(id: string): Promise<Book> {
    try {
      const deletedBook = await prismaClient.book.delete({
        where: {
          id
        }
      })

      return deletedBook
    } catch (error) {
      const defaultError = 'Erro para deletar livro no banco'
      const errorBuilder = handlerErrorsBuilder(error, defaultError)

      logger.error(`delete book service | ID: ${id} | error:`, {
        error: errorBuilder,
        originalError: error
      })

      throw errorBuilder
    }
  }
}
