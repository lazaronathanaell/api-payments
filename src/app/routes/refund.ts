import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { createRefund } from '../../usecases/create-refund'

export default async function refundRoutes(app: FastifyInstance) {
  // ROTA: Reembolso Total
  app.post(
    '/payments/:id/refund',
    {
      schema: {
        tags: ['Reembolsos'],
        summary: 'Solicita reembolso total',
        params: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
          },
          required: ['id'],
        },
        response: {
          200: {
            description: 'Reembolso total realizado',
            type: 'object',
            properties: {
              refundId: { type: 'number' },
            },
          },
          400: {
            description: 'Erro de validação ou lógica de negócio',
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const paymentId = Number((request.params as any).id)

      try {
        const { refundId } = await createRefund({
          payment_id: paymentId, 
          amount: Number.POSITIVE_INFINITY, // o usecase calcula o valor restante
          refund_type: 'total',
        })

        return reply.send({ refundId })
      } catch (error) {
        return reply.status(400).send({ error: (error as Error).message })
      }
    }
  )

  // ROTA: Reembolso Parcial
  app.post(
    '/payments/:id/refund-partial',
    {
      schema: {
        tags: ['Reembolsos'],
        summary: 'Solicita reembolso parcial',
        params: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
          },
          required: ['id'],
        },
        body: {
          type: 'object',
          required: ['amount'],
          properties: {
            amount: { type: 'number' },
          },
        },
        response: {
          200: {
            description: 'Reembolso parcial realizado',
            type: 'object',
            properties: {
              refundId: { type: 'number' },
            },
          },
          400: {
            description: 'Erro de validação ou lógica de negócio',
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const paymentId = Number((request.params as any).id)
      const bodySchema = z.object({ amount: z.number().positive() })
      const parsed = bodySchema.safeParse(request.body)

      if (!parsed.success) {
        return reply.status(400).send({ error: 'Valor inválido para reembolso parcial' })
      }

      try {
        const { refundId } = await createRefund({
          payment_id: paymentId,
          amount: parsed.data.amount,
          refund_type: 'partial',
        })

        return reply.send({ refundId })
      } catch (error) {
        return reply.status(400).send({ error: (error as Error).message })
      }
    }
  )
}
