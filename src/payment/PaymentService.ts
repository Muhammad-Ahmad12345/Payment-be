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

  async processPayment(
    card_number: string,
    card_exp_month: number,
    card_exp_year: number,
    card_cvv: string,
    amount: number,
    currency: string
  )
  {
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: "card",
      card: {
        number: card_number,
        exp_month: card_exp_month,
        exp_year: card_exp_year,
        cvc: card_cvv,
      },
    });
     const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency,
      payment_method: paymentMethod.id,
      confirmation_method: "manual",
      confirm: true,
    });
     await this.savePayment(
      paymentIntent.id,
      paymentMethod.id,
      amount,
      currency,
      paymentIntent.status
    );

    return paymentIntent;
  }

 async savePayment(
  paymentIntentId: string,
  paymentMethodId: string,
  amount: number,
  currency: string,
  status: string
) {
  const paymentRepo = AppDataSource.getMongoRepository(Payment);

  const newPayment = paymentRepo.create({
    paymentIntentId,  
    paymentMethodId,   
    amount,
    currency,
    status,
    createdAt: new Date(),
  });

    return await paymentRepo.save(newPayment);
  }

  async getTransactions(page: number, limit: number) {
    const paymentRepo = AppDataSource.getMongoRepository(Payment);

    const skip = (page - 1) * limit;

    const [records, total] = await paymentRepo.findAndCount({
      order: { createdAt: "DESC" }, 
      skip,
      take: limit,
    });

    return {
      data: records,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
