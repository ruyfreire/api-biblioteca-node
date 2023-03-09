import request from 'supertest'

import { Server } from '../../../src/server'
import { prismaClient } from '../../../src/prisma'

import { fixtures } from '../../utils'

let app
let agent

describe('Test integration: Create Author', () => {
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
    it('201, Should create author success', async () => {
      const author = fixtures.author.create()

      const response = await agent.post('/author').send(author).expect(201)

      expect(response.body.message).toBe('Autor criado com sucesso')
      expect(response.body.data).toMatchObject(author)
    })
  })

  describe('Error cases', () => {
    it('400, Should return validation error', async () => {
      const response = await agent.post('/author').expect(400)

      expect(response.body.code).toBe('error.validation')
      expect(response.body.message).toBe('Erro de validação dos campos')
      expect(response.body.data).toContain('Campo obrigatório: name')
    })

    it('400, Should return already existing author', async () => {
      const author = fixtures.author.create()

      await agent.post('/author').send(author)
      const response = await agent.post('/author').send(author).expect(400)

      expect(response.body.code).toBe('error.database.unique')
      expect(response.body.message).toBe('Dados já existem no banco')
      expect(response.body.data).toEqual({ duplicate_fields: ['name'] })
    })

    it('500, Should return internal error', async () => {
      const author = fixtures.author.create()

      jest
        .spyOn(prismaClient.authors, 'create')
        .mockImplementation(() => Promise.reject(new Error()))

      const response = await agent.post('/author').send(author).expect(500)

      expect(response.body.code).toBe('error.database.internal')
      expect(response.body.message).toBe('Erro para criar novo autor')
    })
  })
})
