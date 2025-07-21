export interface PaymentDTO {
  method: 'pix' | 'credit_card'
  amount: number
  buyerName: string
  buyerEmail: string
  cardEncryptedData?: string
  status: 'paid' | 'partially_refunded' | 'refunded'
}