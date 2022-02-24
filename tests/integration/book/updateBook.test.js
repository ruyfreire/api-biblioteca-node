import request from 'supertest'
import { Server } from '../../../src/server'
import { prismaClient } from '../../../src/prisma'

let app
let agent

describe('Test integration: Update Book', () => {
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
    it('200, Should update book success', async () => {
      const createdBook = await prismaClient.book.create({
        data: {
          name: 'Book name',
          summary: 'Book summary',
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
              author: true
            }
          }
        }
      })

      const updateBook = {
        name: 'Book updated name',
        summary: 'Book updated summary',
        authors: [createdBook.authors[0].author.id]
      }

      const updatedResponse = {
        ...updateBook,
        authors: [createdBook.authors[0].author]
      }

      const response = await agent
        .put(`/book/${createdBook.id}`)
        .send(updateBook)
        .expect(200)

      expect(response.body.message).toBe('Livro atualizado com sucesso')
      expect(response.body.data).toMatchObject(updatedResponse)
    })
  })

  describe('Error cases', () => {
    it('400, Should return validation error path param', async () => {
      const response = await agent.put('/book/id').expect(400)

      expect(response.body.message).toBe('ID inválido')
    })

    it('400, Should return validation error property', async () => {
      const book = {
        name: 'Book name'
      }

      const response = await agent.put('/book/1').send(book).expect(400)

      expect(response.body.message).toBe('Erro de validação dos campos')
      expect(response.body.data).toContain('Campo obrigatório: summary')
    })

    it('400, Should return book not found', async () => {
      const authorCreated = await prismaClient.author.create({
        data: { name: 'Author name' }
      })

      const book = {
        name: 'Book name',
        summary: 'Summary book',
        authors: [authorCreated.id]
      }

      const response = await agent.put('/book/99').send(book).expect(404)

      expect(response.body.code).toBe('error.database.notFound')
      expect(response.body.message).toBe(
        'Um ou mais registros nao foram encontrados no banco'
      )
    })

    it('500, Should return internal error', async () => {
      const authorCreated = await prismaClient.author.create({
        data: { name: 'Author name' }
      })

      const book = {
        name: 'Book name',
        summary: 'Summary book',
        authors: [authorCreated.id]
      }

      jest
        .spyOn(prismaClient.book, 'update')
        .mockImplementation(() => Promise.reject(new Error('Internal error')))

      const response = await agent.put('/book/99').send(book).expect(500)

      expect(response.body.code).toBe('error.internal')
      expect(response.body.message).toBe('Internal error')
    })
  })
})
