import { Request, Response } from "express";
import { Service } from "typedi";
import { PaymentService } from "./PaymentService";

@Service()
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

 async makePayment(req: Request, res: Response) {
    try {
      const { amount, currency, paymentMethodId } = req.body;

      const paymentIntent = await this.paymentService.createPaymentIntent(
        amount,
        currency,
        paymentMethodId
      );

      await this.paymentService.savePayment(
  paymentIntent.id,     
  paymentMethodId,
  amount,
  currency,
  paymentIntent.status
);


      res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      status: paymentIntent.status,
      amount: paymentIntent.amount
    });
    } catch (error) {
    console.error("❌ Payment Error:", error); // log for debugging

    if (error instanceof Error) {
      return res.status(400).json({
        error: true,
        message: error.message
      });
    }

    res.status(400).json({
      error: true,
      message: "Unknown error occurred"
    });
      }
    }
  }

