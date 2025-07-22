export function fakeEncrypt(data: string): string {
  // simples base64 só pra simular
  return Buffer.from(data).toString('base64')
}

export function fakeDecrypt(encrypted: string): string {
  return Buffer.from(encrypted, 'base64').toString('utf-8')
}

// Simula processamento de pagamento e retorna um status
export function processPayment({
  method,
  amount,
  encryptedCardData,
}: {
  method: 'pix' | 'credit_card';
  amount: number;
  encryptedCardData?: string;
}) {
  if (method === 'credit_card') {
    const decrypted = fakeDecrypt(encryptedCardData!); // simula descriptografia interna
    console.log('Processando com cartão:', decrypted);
  }

  return Promise.resolve({
    status: 'paid',
    transactionId: 'fake_tx_' + Math.floor(Math.random() * 10000),
  });
}
