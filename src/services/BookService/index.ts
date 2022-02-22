import { Book, Author } from '.prisma/client'
import { prismaClient } from '../../prisma'
import { handlerErrorsPrisma } from '../../utils/HandlerErrorsPrisma'

export interface ICreateBook {
  name: string
  summary: string
  authors: number[]
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
        throw {
          code: 'error.validation',
          status: 400,
          message: 'É necessário informar pelo menos um autor',
          data: null
        }
      }

      const authorsFound = await prismaClient.author.findMany({
        where: {
          id: {
            in: authorList
          }
        }
      })

      if (authorsFound.length !== authorList.length) {
        throw {
          code: 'error.notFound',
          status: 400,
          message: 'Um ou mais autores não foram encontrados',
          data: authorList.filter(
            (authorId) => !authorsFound.some((author) => author.id === authorId)
          )
        }
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
      const errorBuilder = handlerErrorsPrisma(error)

      if (errorBuilder.status) {
        throw errorBuilder
      }

      throw new Error('Erro para criar novo livro')
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
      const errorPrisma = handlerErrorsPrisma(error)

      if (errorPrisma) {
        throw errorPrisma
      }

      throw new Error('Erro para buscar livro no banco')
    }
  }

  async update(id: number, book: ICreateBook): Promise<Book> {
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

      const authorsFound = await prismaClient.author.findMany({
        where: {
          id: {
            in: authorList
          }
        }
      })

      if (authorsFound.length !== authorList.length) {
        throw {
          code: 'error.notFound',
          status: 400,
          message: 'Um ou mais autores não foram encontrados',
          data: authorList.filter(
            (authorId) => !authorsFound.some((author) => author.id === authorId)
          )
        }
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
