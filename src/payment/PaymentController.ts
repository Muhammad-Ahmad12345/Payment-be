import { Request, Response } from "express";
import { Service } from "typedi";
import { PaymentService } from "./PaymentService";

@Service()
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

 async makePayment(req: Request, res: Response) {
    try {
      const { amount, currency,} = req.body;

      const paymentIntent = await this.paymentService.createPaymentIntent(
        amount,
        currency,
      );

      await this.paymentService.savePayment(
  paymentIntent.id,     
  "", 
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

    async getTransactions(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const transactions = await this.paymentService.getTransactions(page, limit);

    res.status(200).json(transactions);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
  }
}

  }

