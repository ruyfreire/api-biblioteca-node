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
