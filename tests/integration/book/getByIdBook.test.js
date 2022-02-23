const request = require('supertest')
const { Server } = require('../../../src/server')
const { prismaClient } = require('../../../src/prisma')
const { Prisma } = require('@prisma/client')

let app
let agent

describe('Test integration: Get by id Book', () => {
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
    it('200, Should return found book', async () => {
      const mockedBook = {
        name: 'Book name',
        summary: 'Summary book'
      }

      const createdBook = await prismaClient.book.create({
        data: mockedBook
      })

      const response = await agent.get(`/book/${createdBook.id}`).expect(200)

      expect(response.body.data).toMatchObject(mockedBook)
    })
  })

  describe('Error cases', () => {
    it('400, Should return validation error', async () => {
      const response = await agent.get('/book/id').expect(400)

      expect(response.body.message).toBe('ID inválido')
    })

    it('400, Should return book not found', async () => {
      const response = await agent.get('/book/99').expect(404)

      expect(response.body.code).toBe('error.notFound')
      expect(response.body.message).toBe('Livro não encontrado')
    })

    it('500, Should return internal error database', async () => {
      const errorPrisma = new Prisma.PrismaClientKnownRequestError()
      jest
        .spyOn(prismaClient.book, 'findFirst')
        .mockImplementation(() => Promise.reject(errorPrisma))

      const response = await agent.get('/book/99').expect(500)

      expect(response.body.code).toBe('error.database.internal')
      expect(response.body.message).toBe('Erro na comunicação com banco')
    })

    it('500, Should return internal error', async () => {
      jest
        .spyOn(prismaClient.book, 'findFirst')
        .mockImplementation(() => Promise.reject())

      const response = await agent.get('/book/99').expect(500)

      expect(response.body.code).toBe('error.internal')
    })
  })
})
