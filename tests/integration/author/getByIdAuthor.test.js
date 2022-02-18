const request = require('supertest')
const { Server } = require('../../../src/server')
const { prismaClient } = require('../../../src/prisma')
const { Prisma } = require('@prisma/client')

let app
let agent

describe('Test integration: Get by id Author', () => {
  beforeAll(() => {
    app = new Server().start()
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
        name: 'Author name',
      }

      const createdAuthor = await prismaClient.author.create({
        data: author
      })

      const response = await agent.get(`/author/${createdAuthor.id}`).expect(200)

      expect(response.body.data).toMatchObject(author)
    })
  })

  describe('Error cases', () => {
    it('400, Should return validation error', async () => {
      const response = await agent.get('/author/id').expect(400)

      expect(response.body.message).toBe('ID inválido')
    })

    it('400, Should return author not found', async () => {
      const response = await agent.get('/author/99').expect(404)

      expect(response.body.code).toBe('error.notFound')
      expect(response.body.message).toBe('Autor não encontrado')
    })

    it('500, Should return internal error database', async () => {
      const errorPrisma = new Prisma.PrismaClientKnownRequestError()
      jest.spyOn(prismaClient.author, 'findFirst').mockImplementation(() => Promise.reject(errorPrisma))
      
      const response = await agent.get('/author/99').expect(500)
      
      expect(response.body.code).toBe('error.database.internal')
      expect(response.body.message).toBe('Erro na comunicação com banco')
    })
    
    it('500, Should return internal error', async () => {
      jest.spyOn(prismaClient.author, 'findFirst').mockImplementation(() => Promise.reject())

      const response = await agent.get('/author/99').expect(500)

      expect(response.body.code).toBe('error.internal')
    })
  })
})
