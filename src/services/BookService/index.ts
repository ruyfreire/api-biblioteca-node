import { Book } from '.prisma/client'
import { prismaClient } from '../../prisma'
import { handlerErrorsPrisma } from '../../utils/HandlerErrorsPrisma'

export interface ICreateBook {
  name: string
  summary: string
  authors: number[]
}

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

      const newBook = await prismaClient.book.create({
        data: {
          name: book.name,
          summary: book.summary,
          authors: {
            create: authorFoundList.map((authorId) => ({
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
      const books = await prismaClient.book.findMany({
        include: {
          authors: {
            select: {
              author: true
            }
          }
        }
      })

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
        const bookResponse = {
          ...book,
          authors: book.authors.map((current) => current.author)
        }

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

      const bookResponse = {
        ...updatedBook,
        authors: updatedBook.authors.map((current) => current.author)
      }

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
