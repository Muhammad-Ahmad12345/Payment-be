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
      apiVersion: "2025-08-27.basil", 
    });
  }

  async confirmPaymentIntent(paymentIntentId: string) {
    const paymentIntent = await this.stripe.paymentIntents.confirm(
      paymentIntentId,
      {
        payment_method: "pm_card_visa",
      }
    );
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
    const pi = paymentIntent as Stripe.PaymentIntent & {
      charges?: { data?: Stripe.Charge[] };
    };

    const charge = pi.charges?.data?.[0];

    return {
      status: paymentIntent.status,
      chargeId: charge?.id,
      receiptUrl: charge?.receipt_url,
    };
  }
}
