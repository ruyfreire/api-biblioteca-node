import { NextFunction, Request, Response } from 'express'
import { validate as validateUuidv4 } from 'uuid'

import { logger } from '../Logger'
import { ResponseBuilder } from '../ResponseBuilder'

export const validatorId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!validateUuidv4(req.params.id)) {
    const error = new ResponseBuilder({
      status: 400,
      code: 'error.validation',
      message: 'ID precisa ser um uuid válido'
    })

    logger.error(`route validator id | route: ${req.path} | error:`, { error })

    return res.status(error.status).json(error)
  }

  next()
}
