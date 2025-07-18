// src/infra/gateway/fake-payments-gateway.ts
export function fakeEncrypt(data: string): string {
  // simples base64 só pra simular
  return Buffer.from(data).toString('base64')
}

export function fakeDecrypt(encrypted: string): string {
  return Buffer.from(encrypted, 'base64').toString('utf-8')
}

// Simula processamento de pagamento e retorna um status
export async function processPayment(method: 'pix' | 'credit_card', amount: number) {
  // Só pra simular, aceita tudo e retorna 'paid'
  return {
    status: 'paid',
    transactionId: 'tx_' + Math.random().toString(36).slice(2),
  }
}
