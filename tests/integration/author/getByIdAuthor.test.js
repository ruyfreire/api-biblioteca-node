const request = require('supertest')
import { v4 as uuidv4 } from 'uuid'

const { Server } = require('../../../src/server')
const { prismaClient } = require('../../../src/prisma')

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
      const author = {
        name: 'Author name'
      }

      const createdAuthor = await prismaClient.author.create({
        data: author
      })

      const response = await agent
        .get(`/author/${createdAuthor.id}`)
        .expect(200)

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
      const uuid = uuidv4()
      const response = await agent.get(`/author/${uuid}`).expect(404)

      expect(response.body.code).toBe('error.notFound')
      expect(response.body.message).toBe('Autor não encontrado')
    })

    it('500, Should return internal error', async () => {
      const uuid = uuidv4()

      jest
        .spyOn(prismaClient.author, 'findFirst')
        .mockImplementation(() => Promise.reject(new Error()))

      const response = await agent.get(`/author/${uuid}`).expect(500)

      expect(response.body.code).toBe('error.database.internal')
      expect(response.body.message).toBe(
        'Erro para buscar ID do autor no banco'
      )
    })
  })
})
