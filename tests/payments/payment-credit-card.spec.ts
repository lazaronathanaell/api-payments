import { app } from '../../src/app/server'
import { createPayment } from '../../src/usecases/create-payment'

describe('Reembolso com valor inválido e reembolso total válido', () => {
  let paymentId: number

  beforeAll(async () => {
    await app.ready()

    const result = await createPayment({
      method: 'credit_card',
      amount: 100,
      buyerName: 'Cartão Teste',
      buyerEmail: 'cartao@exemplo.com',
      cardEncryptedData: 'fake_encrypted_data',
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
      payload: { amount: 150 },
    })

    const body = response.json()

    expect(response.statusCode).toBe(400)
    expect(body).toHaveProperty('error')
  })

  it('deve permitir reembolso total válido de R$ 100', async () => {
    const response = await app.inject({
      method: 'POST',
      url: `/payments/${paymentId}/refund`,
    })

    const body = response.json()

    expect(response.statusCode).toBe(200)
    expect(body).toHaveProperty('refundId')
  })
})
