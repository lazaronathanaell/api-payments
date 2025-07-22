import { db } from '../../db/db-connection'
import { RefundDTO } from './refund-dto'

export async function insertRefunds(refunds: RefundDTO){
  const sql = ` 
    INSERT INTO refunds (payment_id, refund_type, amount) 
    VALUES (?, ?, ?)
  `
  const [result] = await db.execute(sql, [
    refunds.payment_id,
    refunds.refund_type,
    refunds.amount,
  ])
  // @ts-ignore
  return (result as any).insertId as number
}

export async function selectTotalRefundsByPaymentId(paymentId: number): Promise<number> {
  const sql = `
    SELECT SUM(amount) AS total
    FROM refunds
    WHERE payment_id = ?
  `
  const [rows] = await db.execute(sql, [paymentId]) as any[]
  const rawTotal = rows[0]?.total ?? 0
  return Number(rawTotal) // 👈 conversão explícita
}
