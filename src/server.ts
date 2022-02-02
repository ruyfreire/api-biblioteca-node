import express from 'express'
import cors from 'cors'
import { Routes } from './routes'

export class Server {
  app: express.Application
  port: number | string

  constructor() {
    this.app = express()
    this.middlewares()
    this.routes()
    this.port = process.env.PORT || 3000
  }

  middlewares() {
    this.app.use(
      cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
      })
    )

    this.app.use(express.json())
  }

  routes() {
    this.app.use(Routes)
  }

  start() {
    return this.app.listen(this.port, () => {
      console.log(`Servidor rodando na porta ${this.port} 🚀`)
    })
  }
}
