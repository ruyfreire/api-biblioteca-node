import { Author } from '.prisma/client'
import { prismaClient } from '../../prisma'
import { handlerErrorsPrisma } from '../../utils/HandlerErrorsPrisma'

export interface ICreateAuthor {
  name: string
}

export const createAuthorService = async (
  newAuthor: ICreateAuthor
): Promise<Author> => {
  try {
    const author = await prismaClient.author.create({
      data: newAuthor
    })

    return author
  } catch (error: any) {
    const errorPrisma = handlerErrorsPrisma(error)

    if (errorPrisma) {
      throw errorPrisma
    }

    throw new Error('Erro para criar novo autor')
  }
}

export const getAllAuthorsService = async (): Promise<Author[]> => {
  try {
    const authors = await prismaClient.author.findMany()

    return authors
  } catch (error: any) {
    const errorPrisma = handlerErrorsPrisma(error)

    if (errorPrisma) {
      throw errorPrisma
    }

    throw new Error('Erro para buscar lista de autores no banco')
  }
}

export const getAuthorByIdService = async (
  id: number
): Promise<Author | null> => {
  try {
    const author = await prismaClient.author.findFirst({
      where: {
        id
      }
    })

    return author
  } catch (error) {
    const errorPrisma = handlerErrorsPrisma(error)

    if (errorPrisma) {
      throw errorPrisma
    }

    throw new Error('Erro para buscar ID do autor no banco')
  }
}

export const putAuthorService = async (
  author: ICreateAuthor,
  id: number
): Promise<Author> => {
  try {
    const authorUpdated = await prismaClient.author.update({
      where: {
        id
      },
      data: author
    })

    return authorUpdated
  } catch (error) {
    const errorPrisma = handlerErrorsPrisma(error)

    if (errorPrisma) {
      throw errorPrisma
    }

    throw new Error('Erro para atualizar autor no banco')
  }
}

export const deleteAuthorService = async (id: number): Promise<Author> => {
  try {
    const authorDeleted = await prismaClient.author.delete({
      where: {
        id
      }
    })

    await prismaClient.book.deleteMany({
      where: {
        authors: {
          none: {}
        }
      }
    })

    return authorDeleted
  } catch (error) {
    const errorPrisma = handlerErrorsPrisma(error)

    if (errorPrisma) {
      throw errorPrisma
    }

    throw new Error('Erro para deletar autor no banco')
  }
}
