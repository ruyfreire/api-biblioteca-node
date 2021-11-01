import express from 'express'
import cors from 'cors'
import { Routes } from './routes'

const app = express()

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  })
)

app.use(express.json())

app.use(Routes)

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000 🚀')
})
