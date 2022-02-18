import { Request, Response } from 'express'
import {
  createAuthorService,
  deleteAuthorService,
  getAllAuthorsService,
  getAuthorByIdService,
  ICreateAuthor,
  putAuthorService
} from '../../services/AuthorService'
import { schemaCreateAuthor } from '../../utils/Validators/authorValidator'
import { handlerValidationError } from '../../utils/Validators/handlerValidation'

export const createAuthorController = async (req: Request, res: Response) => {
  try {
    const author = req.body as ICreateAuthor

    await schemaCreateAuthor.validate(author)

    const newAuthor = await createAuthorService(author)

    return res.status(201).json({
      code: 'success',
      message: 'Autor criado com sucesso',
      data: newAuthor
    })
  } catch (error: Error | any) {
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

    return res.status(200).json({
      code: 'success',
      message: 'Listagem com todos os autores',
      data: authors
    })
  } catch (error: Error | any) {
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
      return res.status(400).json({
        code: 'error.validation',
        message: 'ID inválido'
      })
    }

    const author = await getAuthorByIdService(Number(id))

    if (!author) {
      return res.status(404).json({
        code: 'error.notFound',
        message: 'Autor não encontrado'
      })
    }

    return res.status(200).json({
      code: 'success',
      message: 'Autor encontrado',
      data: author
    })
  } catch (error: Error | any) {
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
      return res.status(400).json({
        code: 'error.validation',
        message: 'ID inválido'
      })
    }

    await schemaCreateAuthor.validate(author)

    const authorUpdated = await putAuthorService(author, Number(id))

    return res.status(200).json({
      code: 'success',
      message: 'Autor atualizado com sucesso',
      data: authorUpdated
    })
  } catch (error: Error | any) {
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
      return res.status(400).json({
        code: 'error.validation',
        message: 'ID inválido'
      })
    }

    await deleteAuthorService(Number(id))

    return res.status(200).json({
      code: 'success',
      message: 'Autor deletado com sucesso'
    })
  } catch (error: Error | any) {
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
