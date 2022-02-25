import request from 'supertest'
import { Server } from '../../../src/server'
import { prismaClient } from '../../../src/prisma'

let app
let agent

describe('Test integration: Delete author', () => {
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
    it('200, Should delete author', async () => {
      const author = {
        name: 'Author name'
      }

      const createdAuthor = await prismaClient.author.create({ data: author })

      const response = await agent
        .delete(`/author/${createdAuthor.id}`)
        .expect(200)

      expect(response.body.message).toBe('Autor deletado com sucesso')
    })
  })

  describe('Error cases', () => {
    it('400, Should return validation error', async () => {
      const response = await agent.delete('/author/id').expect(400)

      expect(response.body.code).toBe('error.validation')
      expect(response.body.message).toBe('ID inválido')
    })

    it('400, Should return author not found', async () => {
      const response = await agent.delete('/author/99').expect(404)

      expect(response.body.code).toBe('error.database.notFound')
      expect(response.body.message).toBe(
        'Um ou mais registros nao foram encontrados no banco'
      )
    })

    it('500, Should return internal error', async () => {
      jest
        .spyOn(prismaClient.author, 'delete')
        .mockImplementation(() => Promise.reject(new Error()))

      const response = await agent.delete('/author/99').expect(500)

      expect(response.body.code).toBe('error.database.internal')
      expect(response.body.message).toBe('Erro para deletar autor no banco')
    })
  })
})
