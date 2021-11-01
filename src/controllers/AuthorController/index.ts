import { Request, Response } from 'express'
import { createAuthorService } from '../../services/AuthorService'

export const createAuthorController = async (req: Request, res: Response) => {
  const author = req.body

  if (!author) {
    return res.status(400).json({
      code: 'error',
      message: 'author não foi enviado'
    })
  }

  try {
    const newAuthor = await createAuthorService(author)

    return res.status(201).json({
      code: 'success',
      message: 'Autor criado com sucesso',
      author: newAuthor
    })
  } catch (error: Error | any) {
    return res.status(400).json({
      code: 'error',
      message: error.message,
      data: error.data
    })
  }
}
