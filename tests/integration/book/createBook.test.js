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

describe('Test integration: Create Book', () => {
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
    it('201, Should create book success', async () => {
      const book = fixtures.book.create({ authors: [author.id] })

      const response = await agent.post('/book').send(book).expect(201)

      const bookResponse = {
        ...book,
        authors: [author]
      }

      expect(response.body.data).toMatchObject(bookResponse)
    })
  })

  describe('Error cases', () => {
    it('400, Should return validation error', async () => {
      const { summary, ...book } = fixtures.book.create({
        authors: [author.id]
      })

      const response = await agent.post('/book').send(book).expect(400)

      expect(response.body.message).toBe('Erro de validação dos campos')
      expect(response.body.data).toContain('Campo obrigatório: summary')
    })

    it('400, Should return already existing book', async () => {
      const book = fixtures.book.create({
        authors: [author.id]
      })

      await agent.post('/book').send(book)
      const response = await agent.post('/book').send(book).expect(400)

      expect(response.body.code).toBe('error.database.unique')
      expect(response.body.message).toBe('Dados já existem no banco')
      expect(response.body.data).toEqual({ duplicate_fields: ['name'] })
    })

    it('400, Should require authors list on validator schema', async () => {
      const book = fixtures.book.create({ authors: [] })

      const response = await agent.post('/book').send(book).expect(400)

      expect(response.body.code).toBe('error.validation')
      expect(response.body.message).toBe('Erro de validação dos campos')
      expect(response.body.data).toContain(
        'O array de autores precisa ter pelo menos um autor'
      )
    })

    it('400, Should return author not found', async () => {
      const book = fixtures.book.create()

      const response = await agent.post('/book').send(book).expect(400)

      expect(response.body.code).toBe('error.notFound')
      expect(response.body.message).toBe(
        'Um ou mais autores não foram encontrados'
      )
    })

    it('500, Should return internal error', async () => {
      const book = fixtures.book.create({ authors: [author.id] })

      jest
        .spyOn(prismaClient.books, 'create')
        .mockImplementation(() => Promise.reject(new Error()))

      const response = await agent.post('/book').send(book).expect(500)

      expect(response.body.code).toBe('error.database.internal')
      expect(response.body.message).toBe('Erro para criar novo livro')
    })

    it('Should require authors list on service', async () => {
      const book = fixtures.book.create({ authors: [] })

      await bookService.create(book).catch((error) => {
        expect(error.code).toBe('error.validation')
        expect(error.message).toBe('É necessário informar pelo menos um autor')
      })
    })
  })
})
