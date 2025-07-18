// src/app/routes/payment.ts
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { createPayment } from '../../usecases/create-payment'
import { fakeDecrypt } from '../../infra/gateway/fake-payment-gateway'

export default async function paymentRoutes(app: FastifyInstance) {
  const createPaymentBodySchema = z.object({
    method: z.enum(['pix', 'credit_card']),
    amount: z.number().positive(),
    buyer: z.object({
      name: z.string(),
      email: z.string().email(),
    }),
    card: z.object({
      encryptedData: z.string().optional(),
    }).optional(),
  })

  app.post('/', async (request, reply) => {
    const parsed = createPaymentBodySchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.issues })
    }

    const { method, amount, buyer, card } = parsed.data

    // Se for cartão, obrigue encryptedData
    if (method === 'credit_card' && (!card || !card.encryptedData)) {
      return reply.status(400).send({ error: 'Card encryptedData is required for credit_card payments' })
    }

    // Simula descriptografia (mesmo que fake)
    let decryptedCardData: string | undefined
    if (method === 'credit_card') {
      if (!card || !card.encryptedData) {
        return reply.status(400).send({ error: 'Card encryptedData is required for credit_card payments' })
      }
      decryptedCardData = fakeDecrypt(card.encryptedData) // garante que card.encryptedData é string
    }


    // Cria pagamento chamando usecase
    const payment = await createPayment({
      method,
      amount,
      buyerName: buyer.name,
      buyerEmail: buyer.email,
      cardEncryptedData: decryptedCardData,
    })

    reply.status(201).send(payment)
  })
}
