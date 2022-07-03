import { v4 as uuidV4 } from 'uuid'

import { authors } from '.prisma/client'
import { prismaClient } from '../../prisma'
import { handlerErrorsBuilder } from '../../utils/ResponseBuilder'
import { logger } from '../../utils/Logger'

export interface ICreateAuthor {
  name: string
}

export interface CreateAuthorDatabase extends Pick<authors, 'id' | 'name'> {}

export const createAuthorService = async (
  newAuthor: ICreateAuthor
): Promise<CreateAuthorDatabase> => {
  try {
    const author = await prismaClient.authors.create({
      data: {
        id: uuidV4(),
        name: newAuthor.name
      },
      select: {
        id: true,
        name: true
      }
    })

    return author
  } catch (error: any) {
    const defaultError = 'Erro para criar novo autor'
    const errorBuilder = handlerErrorsBuilder(error, defaultError)

    logger.error('create author service | error:', {
      error: errorBuilder,
      originalError: error
    })

    throw errorBuilder
  }
}

export const getAllAuthorsService = async (): Promise<
  CreateAuthorDatabase[]
> => {
  try {
    const authors = await prismaClient.authors.findMany({
      select: {
        id: true,
        name: true
      }
    })

    return authors
  } catch (error: any) {
    const defaultError = 'Erro para buscar lista de autores no banco'
    const errorBuilder = handlerErrorsBuilder(error, defaultError)

    logger.error('get all authors service | error:', {
      error: errorBuilder,
      originalError: error
    })

    throw errorBuilder
  }
}

export const getAuthorByIdService = async (
  id: string
): Promise<CreateAuthorDatabase | null> => {
  try {
    const author = await prismaClient.authors.findFirst({
      where: {
        id
      },
      select: {
        id: true,
        name: true
      }
    })

    return author
  } catch (error) {
    const defaultError = 'Erro para buscar ID do autor no banco'
    const errorBuilder = handlerErrorsBuilder(error, defaultError)

    logger.error(`get author by id service | ID: ${id} | error:`, {
      error: errorBuilder,
      originalError: error
    })

    throw errorBuilder
  }
}

export const putAuthorService = async (
  author: ICreateAuthor,
  id: string
): Promise<CreateAuthorDatabase> => {
  try {
    const authorUpdated = await prismaClient.authors.update({
      where: {
        id
      },
      data: author,
      select: {
        id: true,
        name: true
      }
    })

    return authorUpdated
  } catch (error) {
    const defaultError = 'Erro para atualizar autor no banco'
    const errorBuilder = handlerErrorsBuilder(error, defaultError)

    logger.error(`put author service | ID: ${id} | error:`, {
      error: errorBuilder,
      originalError: error
    })

    throw errorBuilder
  }
}

export const deleteAuthorService = async (
  id: string
): Promise<CreateAuthorDatabase> => {
  try {
    const authorDeleted = await prismaClient.authors.delete({
      where: {
        id
      }
    })

    await prismaClient.books.deleteMany({
      where: {
        author_book: {
          none: {}
        }
      }
    })

    return authorDeleted
  } catch (error) {
    const defaultError = 'Erro para deletar autor no banco'
    const errorBuilder = handlerErrorsBuilder(error, defaultError)

    logger.error(`delete author service | ID: ${id} | error:`, {
      error: errorBuilder,
      originalError: error
    })

    throw errorBuilder
  }
}
