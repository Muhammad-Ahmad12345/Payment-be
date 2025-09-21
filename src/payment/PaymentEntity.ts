import { Entity, ObjectIdColumn, Column, CreateDateColumn, PrimaryColumn } from "typeorm";
import { ObjectId } from "mongodb";
import { v4 as uuidv4 } from "uuid";

@Entity("payments")
export class Payment {
  // MongoDB ka primary column
  @ObjectIdColumn()
  _id!: ObjectId;

  // Apna custom unique id (secondary primary bhi bana sakte ho)
  @PrimaryColumn()
  id: string = uuidv4();

  @Column()
  paymentIntentId!: string;

  @Column()
  amount!: number;

  @Column()
  currency!: string;

  @Column()
  status!: string;

  @Column({ nullable: true })
  billingName?: string;

  @Column({ nullable: true })
  cardLast4?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
