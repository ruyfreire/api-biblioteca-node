import request from 'supertest'
import { Server } from '../../../src/server'
import { prismaClient } from '../../../src/prisma'
import { Prisma } from '@prisma/client'

let app
let agent

jest.mock('../../../src/prisma', () => {
  const original = jest.requireActual('../../../src/prisma')

  return {
    prismaClient: {
      book: {
        ...original.prismaClient.book,
        findMany: jest.fn()
      }
    }
  }
})

describe('Test integration: Get all Books', () => {
  beforeAll(() => {
    app = new Server().start()
    agent = request.agent(app)
  })

  beforeEach(() => {
    jest.clearAllMocks()
    prismaClient.book.findMany.mockClear()
  })

  afterAll(() => {
    app.close()
  })

  describe('Success cases', () => {
    it('200, Should get all book success', async () => {
      const book = {
        name: 'Book name',
        summary: 'Summary book'
      }

      await prismaClient.book.create({
        data: book
      })

      prismaClient.book.findMany.mockImplementation((args) => {
        const original = jest.requireActual('../../../src/prisma')

        return original.prismaClient.book.findMany(args)
      })

      const response = await agent.get('/book').expect(200)

      expect(response.body.data.toString()).toContain(String(book))
    })
  })

  describe('Error cases', () => {
    it('500, Should return internal error database', async () => {
      const errorPrisma = new Prisma.PrismaClientKnownRequestError()

      prismaClient.book.findMany.mockImplementation(() =>
        Promise.reject(errorPrisma)
      )

      const response = await agent.get('/book').expect(500)

      expect(response.body.code).toBe('error.internal')
      expect(response.body.message).toBe('Erro na comunicação com banco')
    })

    it('500, Should return internal error', async () => {
      prismaClient.book.findMany.mockImplementation(() => Promise.reject())

      const response = await agent.get('/book').expect(500)

      expect(response.body.code).toBe('error.internal')
    })
  })
})
