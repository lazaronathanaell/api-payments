
import request from 'supertest'
import { app } from '../../src/app/server' // Verifique se está exportando o Fastify corretamente

describe('Pagamentos', () => {
  let paymentId: number

  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('deve criar um pagamento PIX com sucesso', async () => {
    const response = await request(app.server)
      .post('/payments')
      .send({
        method: 'pix',
        amount: 120.5,
        buyer: {
          name: 'Teste User',
          email: 'teste@exemplo.com'
        }
      })

    expect(response.statusCode).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.status).toBe('paid')
    expect(response.body).toHaveProperty('transactionId')

    paymentId = response.body.id
  })


  it('deve retornar erro ao criar pagamento sem dados obrigatórios', async () => {
    const response = await request(app.server)
      .post('/payments')
      .send({
        method: 'pix'
      })

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('error')
  })

  it('deve buscar um pagamento existente por ID', async () => {
    const response = await request(app.server).get(`/payments/${paymentId}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('id')
    expect(response.body.id).toBe(paymentId)
  })

  it('deve retornar erro ao buscar pagamento inexistente', async () => {
    const response = await request(app.server).get('/payments/9999999')

    expect(response.statusCode).toBe(404)
    expect(response.body).toHaveProperty('error')
  })
})
