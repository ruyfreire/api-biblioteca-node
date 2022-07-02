import request from 'supertest'
import Chance from 'chance'

import { Server } from '../../../src/server'
import { prismaClient } from '../../../src/prisma'
import { fixtures } from '../../utils'

let app
let agent
const chance = new Chance()

describe('Test integration: Delete author', () => {
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
    it('200, Should delete author', async () => {
      const author = fixtures.author.create()

      const createdAuthor = await prismaClient.authors.create({
        data: {
          ...author,
          id: chance.guid({ version: 4 })
        }
      })

      const response = await agent
        .delete(`/author/${createdAuthor.id}`)
        .expect(200)

      expect(response.body.message).toBe('Autor deletado com sucesso')
    })
  })

  describe('Error cases', () => {
    it('400, Should return validation error', async () => {
      const response = await agent.delete('/author/id').expect(400)

      expect(response.body.code).toBe('error.validation')
      expect(response.body.message).toBe('ID precisa ser um uuid válido')
    })

    it('400, Should return author not found', async () => {
      const uuid = chance.guid({ version: 4 })
      const response = await agent.delete(`/author/${uuid}`).expect(404)

      expect(response.body.code).toBe('error.database.notFound')
      expect(response.body.message).toBe(
        'Um ou mais registros nao foram encontrados no banco'
      )
    })

    it('500, Should return internal error', async () => {
      const uuid = chance.guid({ version: 4 })

      jest
        .spyOn(prismaClient.authors, 'delete')
        .mockImplementation(() => Promise.reject(new Error()))

      const response = await agent.delete(`/author/${uuid}`).expect(500)

      expect(response.body.code).toBe('error.database.internal')
      expect(response.body.message).toBe('Erro para deletar autor no banco')
    })
  })
})
