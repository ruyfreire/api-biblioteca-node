const request = require('supertest')

const { Server } = require('../../../src/server')
const { prismaClient } = require('../../../src/prisma')
import { BookService } from '../../../src/services/BookService'
import { createAuthorService } from '../../../src/services/AuthorService'
import { fixtures } from '../../utils'

let app
let agent
let author
const bookService = new BookService()

describe('Test integration: Get by id Book', () => {
  beforeAll(async () => {
    app = await new Server().start()
    agent = request.agent(app)

    author = await createAuthorService(fixtures.author.create())
  })

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  afterAll(() => {
    app.close()
  })

  describe('Success cases', () => {
    it('200, Should return found book', async () => {
      const book = fixtures.book.create({ authors: [author.id] })
      const createdBook = await bookService.create(book)

      const response = await agent.get(`/book/${createdBook.id}`).expect(200)

      expect(response.body.data).toMatchObject(createdBook)
    })
  })

  describe('Error cases', () => {
    it('400, Should return validation error', async () => {
      const response = await agent.get('/book/id').expect(400)

      expect(response.body.message).toBe('ID precisa ser um uuid válido')
    })

    it('400, Should return book not found', async () => {
      const { id } = fixtures.book.createOnDatabase({ authors: [author.id] })
      const response = await agent.get(`/book/${id}`).expect(404)

      expect(response.body.code).toBe('error.notFound')
      expect(response.body.message).toBe('Livro não encontrado')
    })

    it('500, Should return internal error', async () => {
      const { id } = fixtures.book.createOnDatabase({ authors: [author.id] })

      jest
        .spyOn(prismaClient.books, 'findFirst')
        .mockImplementation(() => Promise.reject(new Error()))

      const response = await agent.get(`/book/${id}`).expect(500)

      expect(response.body.code).toBe('error.database.internal')
      expect(response.body.message).toBe('Erro para buscar livro no banco')
    })
  })
})
