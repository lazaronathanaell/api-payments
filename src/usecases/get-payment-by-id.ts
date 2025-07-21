import { selectPaymentById } from '../infra/repositories/payment/payment-repository'
import { PaymentDTO } from '../infra/repositories/payment/payment-dto'

export async function getPaymentById(id: number): Promise<PaymentDTO> {
  const payment = await selectPaymentById(id)

  if (!payment) {
    throw new Error('Pagamento não encontrado')
  }

  return payment
}
