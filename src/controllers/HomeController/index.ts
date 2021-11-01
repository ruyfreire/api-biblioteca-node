import { Request, Response } from 'express'
import { getEmojisGithub } from '../../services/HomeService'

export const HomeController = async (req: Request, res: Response) => {
  try {
    const emojis = await getEmojisGithub()

    res.status(200).json({
      code: 'success',
      message: 'Está é a rota principal da API da biblioteca',
      emojis_github: emojis
    })
  } catch (error: Error | any) {
    res.status(500).json({
      code: 'error',
      message: error.message || 'Internal server error'
    })
  }
}
