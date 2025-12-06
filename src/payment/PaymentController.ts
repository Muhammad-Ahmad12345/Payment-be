import { Request, Response } from "express";
import { Service } from "typedi";
import { PaymentService } from "./PaymentService";

@Service()
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

 async makePayment(req: Request, res: Response) {
    try {
      const { amount, 
      currency,
      card_number,
      card_exp_month,
      card_exp_year,
      card_cvv} = req.body;
      if (!amount || !currency || !card_number || !card_exp_month || !card_exp_year || !card_cvv) {
        return res.status(400).json({
          error: true,
          message: "All payment fields are required (card details + amount + currency).",
        });
      }

      const paymentResult = await this.paymentService.processPayment(
        card_number,
        card_exp_month,
        card_exp_year,
        card_cvv,
        amount,
        currency,
      );
      res.status(200).json({
      success: true,
        transaction_id: paymentResult.id,
        status: paymentResult.status,
    });
    } catch (error) {
    console.error("❌ Payment Error:", error); 

    if (error instanceof Error) {
      return res.status(400).json({
       success: false,
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
    console.error("❌ Fetch Transactions Error:", error);
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
    return res.status(400).json({ message: "Unknown error occurred." });
  }
}
  }

