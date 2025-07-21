// src/usecase/create-payment.ts
import { processPayment } from '../infra/gateway/fake-payment-gateway'
import { insertPayment } from '../infra/repositories/payment/payment-repository'

interface CreatePaymentInput {
  method: 'pix' | 'credit_card'
  amount: number
  buyerName: string
  buyerEmail: string
  cardEncryptedData?: string
}

export async function createPayment(input: CreatePaymentInput) {
  // Simula o pagamento no gateway
  const gatewayResult = await processPayment(input.method, input.amount)

  // Insere no banco com status retornado do gateway
  const paymentId = await insertPayment({
    method: input.method,
    amount: input.amount,
    buyerName: input.buyerName,
    buyerEmail: input.buyerEmail,
    cardEncryptedData: input.cardEncryptedData,
    status: gatewayResult.status as 'paid',
  })

  return {
    id: paymentId,
    status: gatewayResult.status,
    transactionId: gatewayResult.transactionId,
  }
}
