// src/infra/repositories/payment-repository.ts
import { db } from '../db/db-connection'

export interface PaymentCreateDTO {
  method: 'pix' | 'credit_card'
  amount: number
  buyerName: string
  buyerEmail: string
  cardEncryptedData?: string
  status: 'pending' | 'paid' | 'refunded'
}

export async function insertPayment(payment: PaymentCreateDTO) {
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
