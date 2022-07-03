import request from 'supertest'

import { Server } from '../../../src/server'
import { prismaClient } from '../../../src/prisma'
import { fixtures } from '../../utils'
import { createAuthorService } from '../../../src/services/AuthorService'
import { BookService } from '../../../src/services/BookService'

let app
let agent
let author
const bookService = new BookService()

describe('Test integration: Delete book', () => {
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
    it('200, Should delete book', async () => {
      const book = fixtures.book.createOnDatabase({ authors: [author.id] })

      const bookCreated = await bookService.create(book)

      const response = await agent.delete(`/book/${bookCreated.id}`).expect(200)

      expect(response.body.message).toBe('Livro deletado com sucesso')
    })
  })

  describe('Error cases', () => {
    it('400, Should return validation error', async () => {
      const response = await agent.delete('/book/id').expect(400)

      expect(response.body.message).toBe('ID precisa ser um uuid válido')
    })

    it('400, Should return book not found', async () => {
      const { id } = fixtures.book.createOnDatabase()

      const response = await agent.delete(`/book/${id}`).expect(404)

      expect(response.body.code).toBe('error.database.notFound')
      expect(response.body.message).toBe(
        'Um ou mais registros nao foram encontrados no banco'
      )
    })

    it('500, Should return internal error', async () => {
      const { id } = fixtures.book.createOnDatabase()

      jest
        .spyOn(prismaClient.books, 'delete')
        .mockImplementation(() => Promise.reject(new Error()))

      const response = await agent.delete(`/book/${id}`).expect(500)

      expect(response.body.code).toBe('error.database.internal')
      expect(response.body.message).toBe('Erro para deletar livro no banco')
    })
  })
})
