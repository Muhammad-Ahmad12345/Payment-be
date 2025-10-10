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

async createPaymentIntent(amount: number, currency: string) {
  return await this.stripe.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: { enabled: true },
  });
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
      order: { createdAt: "DESC" }, // latest first
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
