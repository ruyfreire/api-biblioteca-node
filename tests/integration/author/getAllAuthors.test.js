import request from 'supertest'
import Chance from 'chance'

import { Server } from '../../../src/server'
import { prismaClient } from '../../../src/prisma'
import { fixtures } from '../../utils'

let app
let agent
const chance = new Chance()

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
      const author = fixtures.author.create()

      await prismaClient.authors.create({
        data: {
          ...author,
          id: chance.guid({ version: 4 })
        }
      })

      const response = await agent.get('/author').expect(200)

      expect(response.body.data.length).toBeGreaterThan(0)
    })
  })

  describe('Error cases', () => {
    it('500, Should return internal error', async () => {
      jest
        .spyOn(prismaClient.authors, 'findMany')
        .mockImplementation(() => Promise.reject(new Error()))

      const response = await agent.get('/author').expect(500)

      expect(response.body.code).toBe('error.database.internal')
      expect(response.body.message).toBe(
        'Erro para buscar lista de autores no banco'
      )
    })
  })
})
