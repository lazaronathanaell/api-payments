import { db } from '../../db/db-connection'
import { CreatePaymentDTO, PaymentDTO} from './payment-dto'

export async function insertPayment(payment: CreatePaymentDTO) {
  const sql = `
    INSERT INTO payments (method, amount, buyer_name, buyer_email, card_encrypted_data, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `
  const [result] = await db.execute(sql, [
    payment.method,
    payment.amount,
    payment.buyerName,
    payment.buyerEmail,
    payment.cardEncryptedData || null,
    payment.status,
  ])
  // @ts-ignore
  return (result as any).insertId as number
}

export async function selectPaymentById(id: number) {
  const sql = `
    SELECT id, method, amount, buyer_name, buyer_email, card_encrypted_data, status
    FROM payments
    WHERE id = ?
  `

 const [rows] = await db.execute(sql, [id]) as any[]

  if (!rows || rows.length === 0) return null

  const row = rows[0]

  const payment: PaymentDTO = {
    id: row.id,
    method: row.method,
    amount: row.amount,
    buyerName: row.buyer_name,
    buyerEmail: row.buyer_email,
    cardEncryptedData: row.card_encrypted_data,
    status: row.status,
  }

  return payment
}
export async function updatePaymentStatus(paymentId: number, status: 'paid' | 'partially_refunded' | 'refunded') {
  const sql = `
    UPDATE payments
    SET status = ?
    WHERE id = ?
  `
  await db.execute(sql, [status, paymentId])
}


