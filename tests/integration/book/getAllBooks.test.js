import request from 'supertest'

import { Server } from '../../../src/server'
import { prismaClient } from '../../../src/prisma'
import { fixtures } from '../../utils'
import { BookService } from '../../../src/services/BookService'
import { createAuthorService } from '../../../src/services/AuthorService'

let app
let agent
let author
const bookService = new BookService()

describe('Test integration: Get all Books', () => {
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
    it('200, Should get all book success', async () => {
      const book = fixtures.book.createOnDatabase({ authors: [author.id] })

      const bookCreated = await bookService.create(book)

      const response = await agent.get('/book').expect(200)

      expect(response.body.data.length).toBeGreaterThan(0)
      expect(response.body.data).toContainEqual({
        ...bookCreated,
        authors: [author]
      })
    })
  })

  describe('Error cases', () => {
    it('500, Should return internal error', async () => {
      jest
        .spyOn(prismaClient.books, 'findMany')
        .mockImplementation(() => Promise.reject(new Error()))

      const response = await agent.get('/book').expect(500)

      expect(response.body.code).toBe('error.database.internal')
      expect(response.body.message).toBe(
        'Erro para buscar lista de livros no banco'
      )
    })
  })
})
