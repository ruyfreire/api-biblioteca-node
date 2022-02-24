import { Author } from '.prisma/client'
import { prismaClient } from '../../prisma'
import { handlerErrorsPrisma } from '../../utils/HandlerErrorsPrisma'
import { logger } from '../../utils/Logger'

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
    const errorBuilder = handlerErrorsPrisma(error)

    logger.error('create author service | error:', {
      error: { ...errorBuilder, originalError: error }
    })

    if (errorBuilder) {
      throw errorBuilder
    }

    throw new Error('Erro para criar novo autor')
  }
}

export const getAllAuthorsService = async (): Promise<Author[]> => {
  try {
    const authors = await prismaClient.author.findMany()

    return authors
  } catch (error: any) {
    const errorBuilder = handlerErrorsPrisma(error)

    logger.error('get all authors service | error:', {
      error: { ...errorBuilder, originalError: error }
    })

    if (errorBuilder) {
      throw errorBuilder
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
    const errorBuilder = handlerErrorsPrisma(error)

    logger.error('get author by id service | error:', {
      error: { ...errorBuilder, originalError: error }
    })

    if (errorBuilder) {
      throw errorBuilder
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
    const errorBuilder = handlerErrorsPrisma(error)

    logger.error('put author service | error:', {
      error: { ...errorBuilder, originalError: error }
    })

    if (errorBuilder) {
      throw errorBuilder
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
    const errorBuilder = handlerErrorsPrisma(error)

    logger.error('delete author service | error:', {
      error: { ...errorBuilder, originalError: error }
    })

    if (errorBuilder) {
      throw errorBuilder
    }

    throw new Error('Erro para deletar autor no banco')
  }
}
