import request from 'supertest'
import { Server } from '../../../src/server'

let app
let agent

describe('Test integration: Route not found', () => {
  beforeAll(() => {
    app = new Server().start()
    agent = request.agent(app)
  })

  afterAll(() => {
    app.close()
  })

  describe('Error cases', () => {
    it('404, Should return route not found', async () => {
      const response = await agent.get('/not-found').expect(404)

      expect(response.body.code).toBe('error.notFound')
      expect(response.body.message).toBe('Rota não encontrada')
    })
  })
})
