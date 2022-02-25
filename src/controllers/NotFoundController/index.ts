import { Request, Response } from 'express'
import { ResponseBuilder } from '../../utils/ResponseBuilder'

export const notFoundController = async (req: Request, res: Response) => {
  const errorBuilder = new ResponseBuilder({
    status: 404,
    code: 'error.notFound',
    message: 'Rota não encontrada'
  })

  res.status(errorBuilder.status).json(errorBuilder)
}
