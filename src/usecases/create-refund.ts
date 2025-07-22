import { insertRefunds } from '../infra/repositories/refund/refund-repository'
import { selectPaymentById, updatePaymentStatus } from '../infra/repositories/payment/payment-repository'
import { selectTotalRefundsByPaymentId } from '../infra/repositories/refund/refund-repository'
import { RefundDTO } from '../infra/repositories/refund/refund-dto'

/**
 * Cria um reembolso (total ou parcial) para um pagamento existente.
 * Não há limite de solicitações, desde que o valor total reembolsado
 * não ultrapasse o valor do pagamento original.
 */
export async function createRefund(input: RefundDTO) {
  const payment = await selectPaymentById(input.payment_id)

  if (!payment) {
    throw new Error('Pagamento não encontrado')
  }

  if (payment.status === 'refunded') {
    throw new Error('Reembolso total já realizado')
  }

  const totalAlreadyRefunded = await selectTotalRefundsByPaymentId(input.payment_id)
  const valorRestante = payment.amount - totalAlreadyRefunded

  if (input.amount > valorRestante) {
    throw new Error(`Valor do reembolso excede o restante disponível. Disponível: ${valorRestante.toFixed(2)}`)
  }

  // Considera reembolso total se a diferença for menor que R$0,01 (evita problemas com ponto flutuante)
  const isTotal = Math.abs(input.amount - valorRestante) < 0.01

  // Atualiza o status do pagamento conforme o valor reembolsado
  await updatePaymentStatus(
    input.payment_id,
    isTotal ? 'refunded' : 'partially_refunded'
  )

  // Registra o reembolso
  const refundId = await insertRefunds({
    payment_id: input.payment_id,
    refund_type: input.refund_type,
    amount: input.amount,
  })

  return { refundId }
}
