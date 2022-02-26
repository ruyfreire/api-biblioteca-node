const request = require('supertest')
import { v4 as uuidv4 } from 'uuid'

const { Server } = require('../../../src/server')
const { prismaClient } = require('../../../src/prisma')

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

      expect(response.body.message).toBe('ID precisa ser um uuid válido')
    })

    it('400, Should return book not found', async () => {
      const uuid = uuidv4()
      const response = await agent.get(`/book/${uuid}`).expect(404)

      expect(response.body.code).toBe('error.notFound')
      expect(response.body.message).toBe('Livro não encontrado')
    })

    it('500, Should return internal error', async () => {
      const uuid = uuidv4()

      jest
        .spyOn(prismaClient.book, 'findFirst')
        .mockImplementation(() => Promise.reject(new Error()))

      const response = await agent.get(`/book/${uuid}`).expect(500)

      expect(response.body.code).toBe('error.database.internal')
      expect(response.body.message).toBe('Erro para buscar livro no banco')
    })
  })
})
