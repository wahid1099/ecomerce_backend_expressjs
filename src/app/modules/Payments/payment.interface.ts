import { Types } from "mongoose";

export type IPayment = {
  id: string;
  order?: Types.ObjectId;
  user?: Types.ObjectId;
  amount: number;
  method: "card" | "bank_transfer" | "cash_on_delivery";
  status: "success" | "failed" | "pending";
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
};

