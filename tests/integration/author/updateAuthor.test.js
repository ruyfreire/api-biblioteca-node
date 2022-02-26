import request from 'supertest'
import { v4 as uuidv4 } from 'uuid'

import { Server } from '../../../src/server'
import { prismaClient } from '../../../src/prisma'

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
      const author = {
        name: 'Author name'
      }
      const updateAuthor = {
        name: 'Author updated'
      }

      const createdAuthor = await prismaClient.author.create({ data: author })
      const response = await agent
        .put(`/author/${createdAuthor.id}`)
        .send(updateAuthor)
        .expect(200)

      expect(response.body.message).toBe('Autor atualizado com sucesso')
      expect(response.body.data).toMatchObject(updateAuthor)
    })
  })

  describe('Error cases', () => {
    it('400, Should return validation error path param', async () => {
      const response = await agent.put('/author/id').expect(400)

      expect(response.body.code).toBe('error.validation')
      expect(response.body.message).toBe('ID inválido')
    })

    it('400, Should return validation error property', async () => {
      const uuid = uuidv4()
      const author = {}

      const response = await agent
        .put(`/author/${uuid}`)
        .send(author)
        .expect(400)

      expect(response.body.message).toBe('Erro de validação dos campos')
      expect(response.body.data).toContain('Campo obrigatório: name')
    })

    it('400, Should return author not found', async () => {
      const uuid = uuidv4()
      const author = {
        name: 'Author name'
      }

      const response = await agent
        .put(`/author/${uuid}`)
        .send(author)
        .expect(404)

      expect(response.body.code).toBe('error.database.notFound')
      expect(response.body.message).toBe(
        'Um ou mais registros nao foram encontrados no banco'
      )
    })

    it('500, Should return internal error', async () => {
      const uuid = uuidv4()
      const author = {
        name: 'Author name'
      }

      jest
        .spyOn(prismaClient.author, 'update')
        .mockImplementation(() => Promise.reject(new Error()))

      const response = await agent
        .put(`/author/${uuid}`)
        .send(author)
        .expect(500)

      expect(response.body.code).toBe('error.database.internal')
      expect(response.body.message).toBe('Erro para atualizar autor no banco')
    })
  })
})
