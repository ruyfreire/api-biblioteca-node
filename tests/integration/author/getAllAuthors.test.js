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
    it('500, Should return internal error', async () => {
      jest
        .spyOn(prismaClient.author, 'findMany')
        .mockImplementation(() => Promise.reject(new Error()))

      const response = await agent.get('/author').expect(500)

      expect(response.body.code).toBe('error.database.internal')
      expect(response.body.message).toBe(
        'Erro para buscar lista de autores no banco'
      )
    })
  })
})
