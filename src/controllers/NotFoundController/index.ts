import { Request, Response } from 'express'

export const notFoundController = async (req: Request, res: Response) => {
  res.status(404).json({
    code: 'error.notFound',
    message: 'Rota não encontrada'
  })
}
