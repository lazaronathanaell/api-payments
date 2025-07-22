export interface CreatePaymentDTO {
  method: 'pix' | 'credit_card'
  amount: number
  buyerName: string
  buyerEmail: string
  cardEncryptedData?: string
  status: 'paid' | 'partially_refunded' | 'refunded'
}

export interface PaymentDTO {
  id: number
  method: 'pix' | 'credit_card'
  amount: number
  buyerName: string
  buyerEmail: string
  cardEncryptedData?: string
  status: 'paid' | 'partially_refunded' | 'refunded'
}