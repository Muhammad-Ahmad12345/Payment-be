import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Payment } from "./payment/PaymentEntity";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mongodb",
  url: process.env.MONGO_URI,
  database: "Paymentsdb",
  synchronize: true,
  logging: true,
  entities: [Payment],
});

export const connectDB = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log("🚀 Database connected successfully");
  }
};
