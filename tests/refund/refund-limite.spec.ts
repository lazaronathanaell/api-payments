import { app } from '../../src/app/server'
import { createPayment } from '../../src/usecases/create-payment'

describe('Reembolso com valor acima do permitido e reembolso total', () => {
  let paymentId: number

  beforeAll(async () => {
    await app.ready()

    const result = await createPayment({
      method: 'pix',
      amount: 100,
      buyerName: 'Maria Exemplo',
      buyerEmail: 'maria@example.com',
      cardEncryptedData: undefined,
      status: 'paid',
    })

    paymentId = result.id
  })

  afterAll(async () => {
    await app.close()
  })

  it('deve recusar reembolso maior que o valor do pagamento', async () => {
    const response = await app.inject({
      method: 'POST',
      url: `/payments/${paymentId}/refund-partial`,
      payload: { amount: 150 }
    })

    const body = response.json()

    expect(response.statusCode).toBe(400)
    expect(body).toHaveProperty('error')
    expect(body.error).toMatch(/excede o restante disponível/i)
  })

  it('deve permitir reembolso total do valor pago (R$ 100)', async () => {
    const response = await app.inject({
      method: 'POST',
      url: `/payments/${paymentId}/refund-partial`,
      payload: { amount: 100 }
    })

    const body = response.json()

    expect(response.statusCode).toBe(200)
    expect(body).toHaveProperty('refundId')
  })

  it('deve recusar novo reembolso após reembolso total', async () => {
    const response = await app.inject({
      method: 'POST',
      url: `/payments/${paymentId}/refund`,
    })

    const body = response.json()

    expect(response.statusCode).toBe(400)
    expect(body).toHaveProperty('error')
    expect(body.error).toMatch(/já realizado/i)
  })
})
