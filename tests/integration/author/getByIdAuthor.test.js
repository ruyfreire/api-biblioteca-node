const request = require('supertest')

const { Server } = require('../../../src/server')
const { prismaClient } = require('../../../src/prisma')
import { createAuthorService } from '../../../src/services/AuthorService'
import { fixtures } from '../../utils'

let app
let agent

describe('Test integration: Get by id Author', () => {
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
    it('200, Should return found author', async () => {
      const author = await createAuthorService(fixtures.author.create())

      const response = await agent.get(`/author/${author.id}`).expect(200)

      expect(response.body.data).toMatchObject(author)
    })
  })

  describe('Error cases', () => {
    it('400, Should return validation error', async () => {
      const response = await agent.get('/author/id').expect(400)

      expect(response.body.code).toBe('error.validation')
      expect(response.body.message).toBe('ID precisa ser um uuid válido')
    })

    it('400, Should return author not found', async () => {
      const { id } = fixtures.author.createOnDatabase()
      const response = await agent.get(`/author/${id}`).expect(404)

      expect(response.body.code).toBe('error.notFound')
      expect(response.body.message).toBe('Autor não encontrado')
    })

    it('500, Should return internal error', async () => {
      const { id } = fixtures.author.createOnDatabase()

      jest
        .spyOn(prismaClient.authors, 'findFirst')
        .mockImplementation(() => Promise.reject(new Error()))

      const response = await agent.get(`/author/${id}`).expect(500)

      expect(response.body.code).toBe('error.database.internal')
      expect(response.body.message).toBe(
        'Erro para buscar ID do autor no banco'
      )
    })
  })
})
