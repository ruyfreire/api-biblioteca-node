import request from 'supertest'
import { Server } from '../../../src/server'
import { prismaClient } from '../../../src/prisma'
import { Prisma } from '@prisma/client'

let app
let agent

describe('Test integration: Get all Authors', () => {
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
    it('200, Should get all author success', async () => {
      const author = {
        name: 'Author name'
      }

      await prismaClient.author.create({ data: author })

      const response = await agent.get('/author').expect(200)

      expect(response.body.data[0]).toMatchObject(author)
    })
  })

  describe('Error cases', () => {
    it('500, Should return internal error database', async () => {
      const errorPrisma = new Prisma.PrismaClientValidationError()
      jest
        .spyOn(prismaClient.author, 'findMany')
        .mockImplementation(() => Promise.reject(errorPrisma))

      const response = await agent.get('/author').expect(500)

      expect(response.body.code).toBe('error.database.validation')
      expect(response.body.message).toBe(
        'Erro de validação dos campos ao comunicar com banco'
      )
    })

    it('500, Should return internal error', async () => {
      jest
        .spyOn(prismaClient.author, 'findMany')
        .mockImplementation(() => Promise.reject())

      const response = await agent.get('/author').expect(500)

      expect(response.body.code).toBe('error.internal')
    })
  })
})
