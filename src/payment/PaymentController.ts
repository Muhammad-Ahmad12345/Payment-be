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
        amount,
        currency,
        paymentMethodId,
        paymentIntent.status
      );


      res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      status: paymentIntent.status,
      amount: paymentIntent.amount
    });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }
}
