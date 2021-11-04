import { Request, Response } from 'express'
import {
  createAuthorService,
  getAllAuthorsService,
  getAuthorByIdService,
  ICreateAuthor
} from '../../services/AuthorService'
import { schemaCreateAuthor } from '../../utils/Validators/authorValidator'
import { handlerValidationError } from '../../utils/Validators/handlerValidation'

export const createAuthorController = async (req: Request, res: Response) => {
  try {
    const author = req.body as ICreateAuthor

    if (!author) {
      return res.status(400).json({
        code: 'error',
        message: 'author não foi enviado'
      })
    }

    await schemaCreateAuthor.validate(author)

    const newAuthor = await createAuthorService(author)

    return res.status(201).json({
      code: 'success',
      message: 'Autor criado com sucesso',
      author: newAuthor
    })
  } catch (error: Error | any) {
    const validationError = handlerValidationError(error)

    if (validationError) {
      return res.status(400).json({
        code: 'error',
        ...validationError
      })
    }

    return res.status(400).json({
      code: 'error',
      message: error.message,
      data: error.data || []
    })
  }
}

export const getAllAuthorsController = async (req: Request, res: Response) => {
  try {
    const authors = await getAllAuthorsService()

    return res.status(200).json({
      code: 'success',
      message: 'Listagem com todos os autores',
      authors
    })
  } catch (error: Error | any) {
    return res.status(400).json({
      code: 'error',
      message: error.message,
      data: error.data || []
    })
  }
}

export const getAuthorByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    if (!Number(id)) {
      return res.status(400).json({
        code: 'error',
        message: 'ID inválido'
      })
    }

    const author = await getAuthorByIdService(Number(id))

    if (!author) {
      return res.status(404).json({
        code: 'error',
        message: 'Autor não encontrado'
      })
    }

    return res.status(200).json({
      code: 'success',
      message: 'Autor encontrado',
      author
    })
  } catch (error: Error | any) {
    return res.status(400).json({
      code: 'error',
      message: error.message,
      data: error.data || []
    })
  }
}
