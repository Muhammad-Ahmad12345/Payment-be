import "reflect-metadata";
import express, { Request, Response } from "express";
import cors from "cors";
import { Container } from "typedi";
import dotenv from "dotenv";

import { PaymentController } from "./payment/PaymentController";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const paymentController = Container.get(PaymentController);

app.post("/pay", (req: Request, res: Response) => paymentController.makePayment(req, res));
app.listen(port, () => {
  console.log(`🚀 Payment service running on port ${port}`);
});
