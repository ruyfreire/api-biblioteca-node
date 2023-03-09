import express, { Express } from 'express'
import { Server as httpServer } from 'http'
import cors from 'cors'
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')

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

    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  }

  routes() {
    this.app.use(Routes)
  }

  start(): Promise<httpServer> {
    return new Promise((resolve) => resolve(this.app.listen(this.port)))
  }
}
