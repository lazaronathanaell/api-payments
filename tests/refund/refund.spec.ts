import { createPayment } from '../../src/usecases/create-payment'
import { app } from '../../src/app/server'

describe('Rotas de Reembolso', () => {
  let paymentId: number

  beforeAll(async () => {
    await app.ready()

    const result = await createPayment({
      method: 'pix',
      amount: 200,
      buyerName: 'Joe Teste',
      buyerEmail: 'Joe@example.com',
      cardEncryptedData: undefined,
      status: 'paid',
    })

    paymentId = result.id
  })

  afterAll(async () => {
    await app.close()
  })

  it('deve permitir reembolso parcial de R$ 80', async () => {
    const response = await app.inject({
      method: 'POST',
      url: `/payments/${paymentId}/refund-partial`,
      payload: { amount: 80 }
    })

    const body = response.json()

    expect(response.statusCode).toBe(200)
    expect(body).toHaveProperty('refundId')
  })

  it('deve permitir reembolso parcial adicional de R$ 70', async () => {
    const response = await app.inject({
      method: 'POST',
      url: `/payments/${paymentId}/refund-partial`,
      payload: { amount: 70 }
    })

    const body = response.json()

    expect(response.statusCode).toBe(200)
    expect(body).toHaveProperty('refundId')
  })

  it('deve permitir reembolso total do valor restante (R$ 50)', async () => {
    const response = await app.inject({
      method: 'POST',
      url: `/payments/${paymentId}/refund-partial`,
      payload: { amount: 50 }
    })

    const body = response.json()

    expect(response.statusCode).toBe(200)
    expect(body).toHaveProperty('refundId')
  })

  it('deve recusar novo reembolso após reembolso total', async () => {
    const response = await app.inject({
      method: 'POST',
      url: `/payments/${paymentId}/refund`
    })

    const body = response.json()

    expect(response.statusCode).toBe(400)
    expect(body).toHaveProperty('error')
  })
})
