import request from 'supertest'

import { Server } from '../../../src/server'
import { prismaClient } from '../../../src/prisma'
import { fixtures } from '../../utils'
import { createAuthorService } from '../../../src/services/AuthorService'

let app
let agent

describe('Test integration: Update Author', () => {
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
    it('200, Should update author success', async () => {
      const { id, ...author } = await createAuthorService(
        fixtures.author.create()
      )
      author.name = fixtures.author.create().name

      const response = await agent.put(`/author/${id}`).send(author).expect(200)

      expect(response.body.message).toBe('Autor atualizado com sucesso')
      expect(response.body.data).toMatchObject(author)
    })
  })

  describe('Error cases', () => {
    it('400, Should return validation error path param', async () => {
      const response = await agent.put('/author/id').expect(400)

      expect(response.body.code).toBe('error.validation')
      expect(response.body.message).toBe('ID precisa ser um uuid válido')
    })

    it('400, Should return validation error property', async () => {
      const { id } = fixtures.author.createOnDatabase()
      const author = {}

      const response = await agent.put(`/author/${id}`).send(author).expect(400)

      expect(response.body.message).toBe('Erro de validação dos campos')
      expect(response.body.data).toContain('Campo obrigatório: name')
    })

    it('400, Should return author not found', async () => {
      const { id, ...author } = fixtures.author.createOnDatabase()

      const response = await agent.put(`/author/${id}`).send(author).expect(404)

      expect(response.body.code).toBe('error.database.notFound')
      expect(response.body.message).toBe(
        'Um ou mais registros nao foram encontrados no banco'
      )
    })

    it('500, Should return internal error', async () => {
      const { id, ...author } = fixtures.author.createOnDatabase()

      jest
        .spyOn(prismaClient.authors, 'update')
        .mockImplementation(() => Promise.reject(new Error()))

      const response = await agent.put(`/author/${id}`).send(author).expect(500)

      expect(response.body.code).toBe('error.database.internal')
      expect(response.body.message).toBe('Erro para atualizar autor no banco')
    })
  })
})
