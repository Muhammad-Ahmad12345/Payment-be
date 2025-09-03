export class PaymentRequestDto {
  amount!: number; // in cents
  currency!: string;
  paymentMethodId!: string;
}
