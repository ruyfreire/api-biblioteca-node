import { Request, Response } from 'express'
import {
  createAuthorService,
  deleteAuthorService,
  getAllAuthorsService,
  getAuthorByIdService,
  ICreateAuthor,
  putAuthorService
} from '../../services/AuthorService'
import { logger } from '../../utils/Logger'
import { schemaCreateAuthor } from '../../utils/Validators/authorValidator'
import { handlerValidationError } from '../../utils/Validators/handlerValidation'

export const createAuthorController = async (req: Request, res: Response) => {
  try {
    const author = req.body as ICreateAuthor

    await schemaCreateAuthor.validate(author)

    const newAuthor = await createAuthorService(author)

    logger.info(
      `create author controller | Autor criado com sucesso | ID: ${newAuthor.id}`
    )

    return res.status(201).json({
      code: 'success',
      message: 'Autor criado com sucesso',
      data: newAuthor
    })
  } catch (error: Error | any) {
    logger.error('create author controller | error:', { error })

    const validationError = handlerValidationError(error)

    if (validationError) {
      return res.status(400).json(validationError)
    }

    if (error.status) {
      return res.status(error.status).json({
        code: error.code,
        message: error.message,
        data: error.data
      })
    }

    return res.status(500).json({
      code: 'error.internal',
      message: error.message
    })
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
    })
  } catch (error: Error | any) {
    logger.error('get all authors controller | error:', { error })

    if (error.status) {
      return res.status(error.status).json({
        code: error.code,
        message: error.message,
        data: error.data
      })
    }

    return res.status(500).json({
      code: 'error.internal',
      message: error.message
    })
  }
}

export const getAuthorByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    if (!Number(id)) {
      const error = {
        code: 'error.validation',
        message: 'ID inválido'
      }

      logger.error('get author by id | error:', { error })

      return res.status(400).json(error)
    }

    const author = await getAuthorByIdService(Number(id))

    if (!author) {
      logger.warn(`get author by id | Autor não encontrado | ID: ${id}`)

      return res.status(404).json({
        code: 'error.notFound',
        message: 'Autor não encontrado'
      })
    }

    logger.info(`get author by id | Autor retornado com sucesso | ID: ${id}`)

    return res.status(200).json({
      code: 'success',
      message: 'Autor encontrado',
      data: author
    })
  } catch (error: Error | any) {
    logger.error('get author by id | error:', { error })

    if (error.status) {
      return res.status(error.status).json({
        code: error.code,
        message: error.message,
        data: error.data
      })
    }

    return res.status(500).json({
      code: 'error.internal',
      message: error.message
    })
  }
}

export const putAuthorController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const author = req.body as ICreateAuthor

    if (!Number(id)) {
      const error = {
        code: 'error.validation',
        message: 'ID inválido'
      }

      logger.error('update author controller | error:', { error })

      return res.status(400).json(error)
    }

    await schemaCreateAuthor.validate(author)

    const authorUpdated = await putAuthorService(author, Number(id))

    logger.info(
      `update author controller | Autor atualizado com sucesso | ID: ${id}`
    )

    return res.status(200).json({
      code: 'success',
      message: 'Autor atualizado com sucesso',
      data: authorUpdated
    })
  } catch (error: Error | any) {
    logger.error('update author controller | error:', { error })

    const validationError = handlerValidationError(error)

    if (validationError) {
      return res.status(400).json(validationError)
    }

    if (error.status) {
      return res.status(error.status).json({
        code: error.code,
        message: error.message,
        data: error.data
      })
    }

    return res.status(500).json({
      code: 'error.internal',
      message: error.message
    })
  }
}

export const deleteAuthorController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    if (!Number(id)) {
      const error = {
        code: 'error.validation',
        message: 'ID inválido'
      }

      logger.error('delete author controller | error:', { error })

      return res.status(400).json(error)
    }

    await deleteAuthorService(Number(id))

    logger.info(
      `delete author controller | Autor deletado com sucesso | ID: ${id}`
    )

    return res.status(200).json({
      code: 'success',
      message: 'Autor deletado com sucesso'
    })
  } catch (error: Error | any) {
    logger.error('delete author controller | error:', { error })

    if (error.status) {
      return res.status(error.status).json({
        code: error.code,
        message: error.message,
        data: error.data
      })
    }

    return res.status(500).json({
      code: 'error.internal',
      message: error.message
    })
  }
}
