import { Request, Response } from 'express'

export const notFoundController = async (req: Request, res: Response) => {
  res.status(404).json({
    code: 'error',
    message: 'Rota não encontrada'
  })
}
