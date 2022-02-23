import express, { Express } from 'express'
import { Server as httpServer } from 'http'
import cors from 'cors'
import { Routes } from './routes'

export class Server {
  app: Express
  port: number | string

  constructor(port?: number | string | undefined) {
    this.app = express()
    this.middlewares()
    this.routes()
    this.port = port || process.env.PORT || 3000
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

  start(): Promise<httpServer> {
    return new Promise((resolve) => resolve(this.app.listen(this.port)))
  }
}
