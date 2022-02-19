import request from 'supertest'
import { Server } from '../../../src/server'
import { prismaClient } from '../../../src/prisma'

let app
let agent

describe('Test integration: Create Book', () => {
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
    it('201, Should create book success', async () => {
      const authorCreated = await prismaClient.author.create({
        data: { name: 'Author name' }
      })

      const book = {
        name: 'Book name',
        summary: 'Summary book',
        authors: [authorCreated.id]
      }

      const response = await agent.post('/book').send(book).expect(201)

      const bookResponse = {
        ...book,
        authors: [authorCreated]
      }

      expect(response.body.data).toMatchObject(bookResponse)
    })
  })

  describe('Error cases', () => {
    it('400, Should return validation error', async () => {
      const book = {
        name: 'Book name'
      }

      const response = await agent.post('/book').send(book).expect(400)

      expect(response.body.message).toBe('Erro de validação dos campos')
      expect(response.body.data).toContain('Campo obrigatório: summary')
    })

    it('400, Should return already existing book', async () => {
      const book = {
        name: 'Repeat book name',
        summary: 'Summary book'
      }

      const createdBook = await prismaClient.book.create({
        data: {
          name: book.name,
          summary: book.summary,
          authors: {
            create: {
              author: {
                create: { name: 'Author Repeat name' }
              }
            }
          }
        },
        include: {
          authors: {
            select: {
              authorId: true
            }
          }
        }
      })

      const repeatBook = {
        ...book,
        authors: [createdBook.authors[0].authorId]
      }

      const response = await agent.post('/book').send(repeatBook).expect(400)

      expect(response.body.code).toBe('error.database.unique')
      expect(response.body.message).toBe('Dados já existem no banco')
      expect(response.body.data).toEqual({ duplicate_fields: ['name'] })
    })

    it('500, Should return internal error', async () => {
      const book = {
        name: 'Book name',
        summary: 'Summary book',
        authors: [1]
      }

      jest
        .spyOn(prismaClient.book, 'create')
        .mockImplementation(() => Promise.reject())

      const response = await agent.post('/book').send(book).expect(500)

      expect(response.body.code).toBe('error.internal')
    })
  })
})
