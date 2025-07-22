// src/usecase/create-payment.ts
import { processPayment } from '../infra/gateway/fake-payment-gateway'
import { CreatePaymentDTO} from '../infra/repositories/payment/payment-dto'
import { insertPayment } from '../infra/repositories/payment/payment-repository'



export async function createPayment(input: CreatePaymentDTO) {
  const gatewayResult = await processPayment({
    method: input.method,
    amount: input.amount,
    encryptedCardData: input.cardEncryptedData, // ainda criptografado
  });

  const paymentId = await insertPayment({
    ...input,
  });

  return {
    id: paymentId,
    status: gatewayResult.status,
    transactionId: gatewayResult.transactionId,
  };
}

