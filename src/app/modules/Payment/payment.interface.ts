import { IOrder } from "../order/order.interface";
import { IUser } from "../user/user.interface";
import { Types } from "mongoose";

export type IPayment = {
  id: string;
  orderId: Types.ObjectId;
  order?: IOrder;
  userId: Types.ObjectId;
  user?: IUser;
  amount: number;
  method: "card" | "bank_transfer" | "cash_on_delivery";
  status: "success" | "failed" | "pending";
  transactionId?: Types.ObjectId;
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
