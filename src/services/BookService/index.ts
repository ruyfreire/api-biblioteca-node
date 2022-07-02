import { v4 as uuidV4 } from 'uuid'

import { books, authors } from '.prisma/client'
import { prismaClient } from '../../prisma'
import { ResponseBuilder } from '../../utils/ResponseBuilder'
import { handlerErrorsBuilder } from '../../utils/ResponseBuilder'
import { logger } from '../../utils/Logger'

export interface ICreateBook {
  name: string
  summary: string
  authors: string[]
}

interface IBookOriginalResponse extends Pick<books, 'id' | 'name' | 'summary'> {
  author_book: {
    authors: Pick<authors, 'id' | 'name'>
  }[]
}

interface IBookFormattedResponse
  extends Pick<books, 'id' | 'name' | 'summary'> {
  authors: Pick<authors, 'id' | 'name'>[]
}

interface BookResponse extends Pick<books, 'id' | 'name' | 'summary'> {}

const formatResponseBook = (
  books: IBookOriginalResponse
): IBookFormattedResponse => {
  const { author_book, ...bookProps } = books

  return {
    ...bookProps,
    authors: books.author_book.map((current) => current.authors)
  }
}

export class BookService {
  async create(book: ICreateBook): Promise<BookResponse> {
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

      const authorsFound = await prismaClient.authors.findMany({
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

      const newBook = await prismaClient.books.create({
        data: {
          id: uuidV4(),
          name: book.name,
          summary: book.summary,
          author_book: {
            create: authorList.map((authorId) => ({
              authors: {
                connect: {
                  id: authorId
                }
              }
            }))
          }
        },
        select: {
          id: true,
          name: true,
          summary: true,
          author_book: {
            select: {
              authors: {
                select: {
                  id: true,
                  name: true
                }
              }
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

  async getAll(): Promise<BookResponse[]> {
    try {
      const books = await prismaClient.books.findMany({
        select: {
          id: true,
          name: true,
          summary: true,
          author_book: {
            select: {
              authors: {
                select: {
                  id: true,
                  name: true
                }
              }
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

  async getById(id: string): Promise<BookResponse | null> {
    try {
      const book = await prismaClient.books.findFirst({
        where: {
          id
        },
        select: {
          id: true,
          name: true,
          summary: true,
          author_book: {
            select: {
              authors: {
                select: {
                  id: true,
                  name: true
                }
              }
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

  async update(id: string, book: ICreateBook): Promise<BookResponse> {
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

      const authorsFound = await prismaClient.authors.findMany({
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

      const updatedBook = await prismaClient.books.update({
        where: {
          id
        },
        data: {
          name: book.name,
          summary: book.summary,
          author_book: {
            connectOrCreate: authorList.map((authorId) => ({
              create: {
                authors: {
                  connect: {
                    id: authorId
                  }
                }
              },
              where: {
                author_id_book_id: {
                  book_id: id,
                  author_id: authorId
                }
              }
            })),
            deleteMany: [
              {
                author_id: {
                  notIn: authorList
                },
                book_id: id
              }
            ]
          }
        },
        select: {
          id: true,
          name: true,
          summary: true,
          author_book: {
            select: {
              authors: {
                select: {
                  id: true,
                  name: true
                }
              }
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

  async delete(id: string): Promise<BookResponse> {
    try {
      const deletedBook = await prismaClient.books.delete({
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
