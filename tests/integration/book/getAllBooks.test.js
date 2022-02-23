import request from 'supertest'
import { Server } from '../../../src/server'
import { prismaClient } from '../../../src/prisma'
import { Prisma } from '@prisma/client'

let app
let agent

describe('Test integration: Get all Books', () => {
  beforeAll(async () => {
    app = await new Server().start()
    agent = request.agent(app)
  })

  beforeEach(() => {
    jest.restoreAllMocks()
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

      await prismaClient.book.create({ data: book })

      const response = await agent.get('/book').expect(200)

      expect(response.body.data[0]).toMatchObject(book)
    })
  })

  describe('Error cases', () => {
    it('500, Should return internal error database', async () => {
      const errorPrisma = new Prisma.PrismaClientKnownRequestError()
      jest
        .spyOn(prismaClient.book, 'findMany')
        .mockImplementation(() => Promise.reject(errorPrisma))

      const response = await agent.get('/book').expect(500)

      expect(response.body.code).toBe('error.database.internal')
      expect(response.body.message).toBe('Erro na comunicação com banco')
    })

    it('500, Should return internal error', async () => {
      jest
        .spyOn(prismaClient.book, 'findMany')
        .mockImplementation(() => Promise.reject())

      const response = await agent.get('/book').expect(500)

      expect(response.body.code).toBe('error.internal')
    })
  })
})
