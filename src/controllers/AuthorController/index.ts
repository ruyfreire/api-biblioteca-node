import { Request, Response } from 'express'

import {
  createAuthorService,
  deleteAuthorService,
  getAllAuthorsService,
  getAuthorByIdService,
  ICreateAuthor,
  putAuthorService
} from '../../services/AuthorService'
import {
  ResponseBuilder,
  handlerErrorsBuilder
} from '../../utils/ResponseBuilder'
import { logger } from '../../utils/Logger'

export const createAuthorController = async (req: Request, res: Response) => {
  try {
    const author = req.body as ICreateAuthor

    const newAuthor = await createAuthorService(author)

    logger.info(
      `create author controller | Autor criado com sucesso | ID: ${newAuthor.id}`
    )

    return res.status(201).json({
      code: 'success',
      message: 'Autor criado com sucesso',
      data: newAuthor
    } as ResponseBuilder)
  } catch (error: Error | any) {
    const errorBuilder = handlerErrorsBuilder(error)

    logger.error('create author controller | error:', {
      error: errorBuilder,
      originalError: error
    })

    return res.status(errorBuilder.status).json(errorBuilder)
  }
}

export const getAllAuthorsController = async (req: Request, res: Response) => {
  try {
    const authors = await getAllAuthorsService()

    logger.info('get all authors controller | Autores retornados com sucesso')

    return res.status(200).json({
      code: 'success',
      message: 'Listagem com todos os autores',
      data: authors
    } as ResponseBuilder)
  } catch (error: Error | any) {
    const errorBuilder = handlerErrorsBuilder(error)

    logger.error('get all authors controller | error:', {
      error: errorBuilder,
      originalError: error
    })

    return res.status(errorBuilder.status).json(errorBuilder)
  }
}

export const getAuthorByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const author = await getAuthorByIdService(id)

    if (!author) {
      logger.warn(`get author by id | Autor não encontrado | ID: ${id}`)

      return res.status(404).json({
        code: 'error.notFound',
        message: 'Autor não encontrado'
      } as ResponseBuilder)
    }

    logger.info(`get author by id | Autor retornado com sucesso | ID: ${id}`)

    return res.status(200).json({
      code: 'success',
      message: 'Autor encontrado',
      data: author
    } as ResponseBuilder)
  } catch (error: Error | any) {
    const errorBuilder = handlerErrorsBuilder(error)

    logger.error(`get author by id | ID: ${req.params.id} | error:`, {
      error: errorBuilder,
      originalError: error
    })

    return res.status(errorBuilder.status).json(errorBuilder)
  }
}

export const putAuthorController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const author = req.body as ICreateAuthor

    const authorUpdated = await putAuthorService(author, id)

    logger.info(
      `update author controller | Autor atualizado com sucesso | ID: ${id}`
    )

    return res.status(200).json({
      code: 'success',
      message: 'Autor atualizado com sucesso',
      data: authorUpdated
    } as ResponseBuilder)
  } catch (error: Error | any) {
    const errorBuilder = handlerErrorsBuilder(error)

    logger.error(`update author controller | ID: ${req.params.id} | error:`, {
      error: errorBuilder,
      originalError: error
    })

    return res.status(errorBuilder.status).json(errorBuilder)
  }
}

export const deleteAuthorController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    await deleteAuthorService(id)

    logger.info(
      `delete author controller | Autor deletado com sucesso | ID: ${id}`
    )

    return res.status(200).json({
      code: 'success',
      message: 'Autor deletado com sucesso'
    } as ResponseBuilder)
  } catch (error: Error | any) {
    const errorBuilder = handlerErrorsBuilder(error)

    logger.error(`delete author controller | ID: ${req.params.id} | error:`, {
      error: errorBuilder,
      originalError: error
    })

    return res.status(errorBuilder.status).json(errorBuilder)
  }
}
