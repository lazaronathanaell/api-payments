export type RefundType = 'total' | 'partial'

export interface Refund {
  id: number
  payment_id: number
  refund_type: RefundType
  amount: number
  created_at: Date
}
