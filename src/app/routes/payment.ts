
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { createPayment } from '../../usecases/create-payment'
import { getPaymentById } from '../../usecases/get-payment-by-id'

export default async function paymentRoutes(app: FastifyInstance) {
  const createPaymentBodySchema = z.object({
    method: z.enum(['pix', 'credit_card']),
    amount: z.number().positive(),
    buyer: z.object({
      name: z.string(),
      email: z.string().email(),
    }),
    card: z
      .object({
        encryptedData: z.string(),
      })
      .optional(),
  })

  app.post(
    '/payments',
    {
      schema: {
        tags: ['Pagamentos'],
        summary: 'Criação de pagamento',
        body: {
          type: 'object',
          required: ['method', 'amount', 'buyer'],
          properties: {
            method: { type: 'string', enum: ['pix', 'credit_card'] },
            amount: { type: 'number' },
            buyer: {
              type: 'object',
              required: ['name', 'email'],
              properties: {
                name: { type: 'string' },
                email: { type: 'string', format: 'email' },
              },
            },
            card: {
              type: 'object',
              properties: {
                encryptedData: { type: 'string' },
              },
            },
          },
        },
        response: {
          201: {
            description: 'Pagamento criado com sucesso',
            type: 'object',
            properties: {
              id: { type: 'number' },
              status: { type: 'string' },
              transactionId: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const parsed = createPaymentBodySchema.safeParse(request.body)

      if (!parsed.success) {
        return reply.status(400).send({ error: parsed.error.issues })
      }

      const { method, amount, buyer, card } = parsed.data

      if (method === 'credit_card' && (!card || !card.encryptedData)) {
        return reply.status(400).send({ error: 'encryptedData é obrigatório para pagamento com cartão' })
      }

      const payment = await createPayment({
        method,
        amount,
        buyerName: buyer.name,
        buyerEmail: buyer.email,
        cardEncryptedData: card?.encryptedData,
        status: "paid"
      })

      return reply.status(201).send(payment)
    }
  ),

    app.get('/payments/:id', {
      schema: {
        tags: ['Pagamentos'],
        summary: 'Busca pagamento por ID',
        params: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
          },
          required: ['id'],
        },
        response: {
          200: {
            description: 'Pagamento encontrado',
            type: 'object',
            properties: {
              id: { type: 'number' },
              method: { type: 'string' },
              amount: { type: 'number' },
              buyerName: { type: 'string' },
              buyerEmail: { type: 'string' },
              status: { type: 'string' },
            },
          },
          404: {
            description: 'Pagamento não encontrado',
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },

    async (request, reply) => {
      const { id } = request.params as { id: string }
      const paymentId = Number(id)

      if (isNaN(paymentId) || paymentId <= 0) {
        return reply.status(400).send({ error: 'ID inválido' })
      }

      try {
        const payment = await getPaymentById(paymentId)
        return reply.send(payment)
      } catch (error) {
        return reply.status(404).send({ error: (error as Error).message })
      }
    })
}


