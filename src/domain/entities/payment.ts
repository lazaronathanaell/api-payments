export type PaymentMethod = 'pix' | 'credit_card';

export interface Buyer {
  name: string;
  email: string;
}

export interface Payment {
  id: number;
  method: PaymentMethod;
  amount: number;
  buyer: Buyer;
  cardEncryptedData?: string;
  status: 'paid' | 'partially_refunded' | 'refunded'
  createdAt: Date;
}