export interface RefundDTO {
  payment_id: number
  refund_type: 'total' | 'partial'
  amount: number
}