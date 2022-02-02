import request from 'supertest'
import { Server } from '../../../src/server'
import { prismaClient } from '../../../src/prisma'
import { Prisma } from '@prisma/client'

let app
let agent

jest.mock('../../../src/prisma', () => {
  return {
    prismaClient: {
      book: {
        create: jest.fn()
      }
    }
  }
})

describe('Test integration: Create Book', () => {
  beforeAll(() => {
    app = new Server().start()
    agent = request.agent(app)
  })

  beforeEach(() => {
    jest.clearAllMocks()
    prismaClient.book.create.mockClear()
  })

  afterAll(() => {
    app.close()
  })

  describe('Success cases', () => {
    it('201, Should create book success', async () => {
      const book = {
        name: 'Book name',
        summary: 'Summary book'
      }

      prismaClient.book.create.mockImplementation(({ data }) =>
        Promise.resolve(data)
      )

      const response = await agent.post('/book').send(book).expect(201)

      expect(response.body.data).toEqual(book)
    })
  })

  describe('Error cases', () => {
    it('400, Should return validation error', async () => {
      const book = {
        name: 'Book name'
      }

      const response = await agent.post('/book').send(book).expect(400)

      expect(response.body.message).toBe('Erro de validação dos campos')
      expect(response.body.data).toEqual(['O campo [summary] é obrigatório'])
    })

    it('400, Should return already existing book', async () => {
      const book = {
        name: 'Repeat book name',
        summary: 'Summary book'
      }

      const errorPrisma = new Prisma.PrismaClientKnownRequestError()
      errorPrisma.code = 'P2002'
      errorPrisma.meta = {
        target: ['name']
      }

      prismaClient.book.create.mockImplementation(() =>
        Promise.reject(errorPrisma)
      )

      const response = await agent.post('/book').send(book).expect(400)

      expect(response.body.code).toBe('error.validation')
      expect(response.body.message).toBe('Dados já existem no banco')
      expect(response.body.data).toEqual({ duplicate_fields: ['name'] })
    })

    it('500, Should return internal error', async () => {
      const book = {
        name: 'Book name',
        summary: 'Summary book'
      }

      prismaClient.book.create.mockImplementation(() => Promise.reject())

      const response = await agent.post('/book').send(book).expect(500)

      expect(response.body.code).toBe('error.internal')
    })
  })
})
