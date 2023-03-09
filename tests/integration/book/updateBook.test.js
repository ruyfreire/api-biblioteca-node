import request from 'supertest'

import { Server } from '../../../src/server'
import { prismaClient } from '../../../src/prisma'
import { BookService } from '../../../src/services/BookService'
import { createAuthorService } from '../../../src/services/AuthorService'
import { fixtures } from '../../utils'

let app
let agent
let author
const bookService = new BookService()

describe('Test integration: Update Book', () => {
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
    it('200, Should update book success', async () => {
      const book = fixtures.book.create({ authors: [author.id] })
      const createdBook = await bookService.create(book)

      const updateBook = {
        ...book,
        name: fixtures.book.create().name,
        summary: fixtures.book.create().summary
      }

      const bookResponse = {
        ...updateBook,
        authors: [author]
      }

      const response = await agent
        .put(`/book/${createdBook.id}`)
        .send(updateBook)
        .expect(200)

      expect(response.body.message).toBe('Livro atualizado com sucesso')
      expect(response.body.data).toMatchObject(bookResponse)
    })
  })

  describe('Error cases', () => {
    it('400, Should return validation error path param', async () => {
      const response = await agent.put('/book/id').expect(400)

      expect(response.body.message).toBe('ID precisa ser um uuid válido')
    })

    it('400, Should return validation error property', async () => {
      const { id, summary, ...book } = fixtures.book.createOnDatabase({
        authors: [author.id]
      })

      const response = await agent.put(`/book/${id}`).send(book).expect(400)

      expect(response.body.message).toBe('Erro de validação dos campos')
      expect(response.body.data).toContain('Campo obrigatório: summary')
    })

    it('400, Should return book not found', async () => {
      const { id, ...book } = fixtures.book.createOnDatabase({
        authors: [author.id]
      })

      const response = await agent.put(`/book/${id}`).send(book).expect(404)

      expect(response.body.code).toBe('error.database.notFound')
      expect(response.body.message).toBe(
        'Um ou mais registros nao foram encontrados no banco'
      )
    })

    it('400, Should require authors list', async () => {
      const { id, ...book } = fixtures.book.createOnDatabase({ authors: [] })

      const response = await agent.put(`/book/${id}`).send(book).expect(400)

      expect(response.body.code).toBe('error.validation')
      expect(response.body.message).toBe('Erro de validação dos campos')
      expect(response.body.data).toContain(
        'O array de autores precisa ter pelo menos um autor'
      )
    })

    it('400, Should return author not found', async () => {
      const { id, ...book } = fixtures.book.createOnDatabase({
        authors: [fixtures.author.createOnDatabase().id]
      })

      const response = await agent.put(`/book/${id}`).send(book).expect(400)

      expect(response.body.code).toBe('error.notFound')
      expect(response.body.message).toBe(
        'Um ou mais autores não foram encontrados'
      )
    })

    it('500, Should return internal error', async () => {
      const { id, ...book } = fixtures.book.createOnDatabase({
        authors: [author.id]
      })

      jest
        .spyOn(prismaClient.books, 'update')
        .mockImplementation(() => Promise.reject(new Error()))

      const response = await agent.put(`/book/${id}`).send(book).expect(500)

      expect(response.body.code).toBe('error.database.internal')
      expect(response.body.message).toBe('Erro para atualizar livro no banco')
    })

    it('Should require authors list on service', async () => {
      const book = fixtures.book.create({ authors: [] })

      await bookService.update(book).catch((error) => {
        expect(error.code).toBe('error.validation')
        expect(error.message).toBe('É necessário informar pelo menos um autor')
      })
    })
  })
})
