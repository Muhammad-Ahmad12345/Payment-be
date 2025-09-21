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
     this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2025-08-27.basil", 
  });
  }

  async createPayment(data: PaymentRequestDto): Promise<PaymentResponseDto> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: data.amount,
      currency: data.currency,
      payment_method: data.paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never", 
      },
    });

     if (paymentIntent.status === "succeeded") {
      try {
        const repo = AppDataSource.getMongoRepository(Payment);

     const charge = paymentIntent.charges?.data?.[0];

const last4 = charge?.payment_method_details?.card?.last4 || undefined;
const billingName = charge?.billing_details?.name || undefined;

        const paymentRecord = repo.create({
          paymentIntentId: paymentIntent.id,
          amount: data.amount,
          currency: data.currency,
          status: paymentIntent.status,
          billingName,
          cardLast4: last4,
        });

         await repo.save(paymentRecord);
        console.log("✅ Payment saved to DB:", paymentIntent.id);
      } catch (dbErr) {
        console.error("❌ Failed to save payment record:", dbErr);
      }
    }

    return {
      clientSecret: paymentIntent.client_secret || "",
      status: paymentIntent.status,
    };
  }
}
