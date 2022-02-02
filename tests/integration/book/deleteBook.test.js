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
        delete: jest.fn()
      }
    }
  }
})

describe('Test integration: Delete book', () => {
  beforeAll(() => {
    app = new Server().start()
    agent = request.agent(app)
  })

  beforeEach(() => {
    jest.clearAllMocks()
    prismaClient.book.delete.mockClear()
  })

  afterAll(() => {
    app.close()
  })

  describe('Success cases', () => {
    it('200, Should delete book', async () => {
      const bookId = 1

      prismaClient.book.delete.mockImplementation(({ data }) =>
        Promise.resolve(data)
      )

      const response = await agent.delete(`/book/${bookId}`).expect(200)

      expect(response.body.message).toBe('Livro deletado com sucesso')
    })
  })

  describe('Error cases', () => {
    it('400, Should return validation error', async () => {
      const bookId = 'id'

      const response = await agent.delete(`/book/${bookId}`).expect(400)

      expect(response.body.message).toBe('ID inválido')
    })

    it('400, Should return book not found', async () => {
      const bookId = '99'

      const errorPrisma = new Prisma.PrismaClientKnownRequestError()
      errorPrisma.code = 'P2025'
      errorPrisma.meta = {
        cause: 'ID não encontrado'
      }

      prismaClient.book.delete.mockImplementation(() =>
        Promise.reject(errorPrisma)
      )

      const response = await agent.delete(`/book/${bookId}`).expect(404)

      expect(response.body.code).toBe('error.notFound')
      expect(response.body.message).toBe(
        'Um ou mais registros nao foram encontrados no banco'
      )
      expect(response.body.data).toBe('ID não encontrado')
    })

    it('500, Should return internal error', async () => {
      const bookId = 1

      prismaClient.book.delete.mockImplementation(() => Promise.reject())

      const response = await agent.delete(`/book/${bookId}`).expect(500)

      expect(response.body.code).toBe('error.internal')
    })
  })
})
