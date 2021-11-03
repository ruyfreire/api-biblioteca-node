import { Request, Response } from 'express'
import {
  createAuthorService,
  getAllAuthorsService,
  ICreateAuthor
} from '../../services/AuthorService'
import { schemaCreateAuthor } from '../../utils/Validators/authorValidator'
import { handlerValidationError } from '../../utils/Validators/handlerValidation'

export const createAuthorController = async (req: Request, res: Response) => {
  const author = req.body as ICreateAuthor

  if (!author) {
    return res.status(400).json({
      code: 'error',
      message: 'author não foi enviado'
    })
  }

  try {
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
      data: error.data
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
      data: error.data
    })
  }
}
