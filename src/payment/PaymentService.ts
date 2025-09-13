import { Service } from "typedi";
import Stripe from "stripe";
import { PaymentRequestDto } from "./PaymentRequestDto";
import { PaymentResponseDto } from "./PaymentResponseDto";

@Service()
export class PaymentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2025-08-27.basil",
    });
  }

  async createPayment(data: PaymentRequestDto): Promise<PaymentResponseDto> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: data.amount,
      currency: data.currency,
      payment_method: data.paymentMethodId,
      confirm: true,
    });

    return {
      clientSecret: paymentIntent.client_secret || "",
      status: paymentIntent.status,
    };
  }
}
