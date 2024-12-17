import { IOrder } from "../order/order.interface";
import { IUser } from "../user/user.interface";
import { Types } from "mongoose";

export type IPayment = {
  id: string;
  order?: Types.ObjectId;
  user?: Types.ObjectId;
  amount: number;
  method: "card" | "bank_transfer" | "cash_on_delivery";
  status: "success" | "failed" | "pending";
  transactionId: { type: String; required: true };
  createdAt: Date;
  updatedAt: Date;
};

export type ICoupon = {
  id: string;
  code: string;
  discount: number;
  validFrom: Date;
  validUntil: Date;
  createdAt: Date;
  updatedAt: Date;
};
