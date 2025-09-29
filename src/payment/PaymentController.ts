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

      res.status(200).json(paymentIntent);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }
}
