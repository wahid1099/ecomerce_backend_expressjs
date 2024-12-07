import { IOrder } from "../Orders/order.interface";
import { IUser } from "../user/user.interface";
export type IPayment = {
  id: string;
  orderId: string;
  order?: IOrder;
  userId: string;
  user?: IUser;
  amount: number;
  method: "card" | "bank_transfer" | "cash_on_delivery";
  status: "success" | "failed" | "pending";
  transactionId?: string;
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
