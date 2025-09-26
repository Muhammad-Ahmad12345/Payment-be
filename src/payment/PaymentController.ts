import { Request, Response } from "express";
import { Service } from "typedi";
import { PaymentService } from "./PaymentService";

@Service()
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  async makePayment(req: Request, res: Response) {
    try {
      const response = await this.paymentService.confirmPaymentIntent(req.body.paymentIntentId);

      res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }
}
