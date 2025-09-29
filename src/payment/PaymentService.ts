import { Service } from "typedi";
import Stripe from "stripe";
import { PaymentRequestDto } from "./PaymentRequestDto";
import { PaymentResponseDto } from "./PaymentResponseDto";
import { AppDataSource } from "../data-source";
import { Payment } from "./PaymentEntity";

@Service()
export class PaymentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2023-10-16", 
    });
  }

 async createPaymentIntent(amount: number, currency: string, paymentMethodId: string) {
    return await this.stripe.paymentIntents.create({
      amount,
      currency,
      payment_method: paymentMethodId,
      confirm: true, // confirm at the same time
    });
  }
}
