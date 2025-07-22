import { insertRefunds } from '../infra/repositories/refund/refund-repository'
import { selectPaymentById, updatePaymentStatus } from '../infra/repositories/payment/payment-repository'
import { selectTotalRefundsByPaymentId } from '../infra/repositories/refund/refund-repository'
import { RefundDTO } from '../infra/repositories/refund/refund-dto'

export async function createRefund(input: RefundDTO) {
  console.log('📥 Iniciando createRefund com input:', input)

  const payment = await selectPaymentById(input.payment_id)
  console.log('📄 Pagamento encontrado:', payment)

  if (!payment) {
    console.log('❌ Pagamento não encontrado')
    throw new Error('Pagamento não encontrado')
  }

  if (payment.status === 'refunded') {
    console.log('⚠️ Pagamento já está com status refunded')
    throw new Error('Reembolso Total já realizado')
  }

  const totalAlreadyRefunded = await selectTotalRefundsByPaymentId(input.payment_id)
  const valorRestante = payment.amount - totalAlreadyRefunded

  console.log('💰 Total já reembolsado:', totalAlreadyRefunded)
  console.log('💸 Valor restante para reembolso:', valorRestante)
  console.log('➡️ Valor solicitado:', input.amount)

  if (input.amount > valorRestante) {
    console.log('❌ Valor do reembolso excede o restante disponível')
    throw new Error(`Valor do reembolso excede o restante disponível. Disponível: ${valorRestante.toFixed(2)}`)
  }

  const isTotal = Math.abs(input.amount - valorRestante) < 0.01
  console.log('✅ É reembolso total?', isTotal)

  await updatePaymentStatus(
    input.payment_id,
    isTotal ? 'refunded' : 'partially_refunded'
  )
  console.log('🔄 Status do pagamento atualizado')

  const refundId = await insertRefunds({
    payment_id: input.payment_id,
    refund_type: input.refund_type,
    amount: input.amount,
  })

  console.log('✅ Reembolso registrado com ID:', refundId)

  return { refundId }
}
