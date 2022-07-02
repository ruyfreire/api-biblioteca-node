import request from 'supertest'
import { v4 as uuidv4 } from 'uuid'

import { Server } from '../../../src/server'
import { prismaClient } from '../../../src/prisma'

let app
let agent

describe('Test integration: Delete book', () => {
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
    it('200, Should delete book', async () => {
      const book = {
        name: 'Book name',
        summary: 'Summary book'
      }

      const createdBook = await prismaClient.books.create({ data: book })

      const response = await agent.delete(`/book/${createdBook.id}`).expect(200)

      expect(response.body.message).toBe('Livro deletado com sucesso')
    })
  })

  describe('Error cases', () => {
    it('400, Should return validation error', async () => {
      const response = await agent.delete('/book/id').expect(400)

      expect(response.body.message).toBe('ID precisa ser um uuid válido')
    })

    it('400, Should return book not found', async () => {
      const uuid = uuidv4()

      const response = await agent.delete(`/book/${uuid}`).expect(404)

      expect(response.body.code).toBe('error.database.notFound')
      expect(response.body.message).toBe(
        'Um ou mais registros nao foram encontrados no banco'
      )
    })

    it('500, Should return internal error', async () => {
      const uuid = uuidv4()

      jest
        .spyOn(prismaClient.books, 'delete')
        .mockImplementation(() => Promise.reject(new Error()))

      const response = await agent.delete(`/book/${uuid}`).expect(500)

      expect(response.body.code).toBe('error.database.internal')
      expect(response.body.message).toBe('Erro para deletar livro no banco')
    })
  })
})
