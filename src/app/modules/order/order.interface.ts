import { Types } from "mongoose";

export type IOrderItem = {
  product: Types.ObjectId; // Reference to the product
  quantity: number;
  // Quantity of the product in the order
};

export type IOrder = {
  id: string; // UUID for the order
  user?: Types.ObjectId; // Reference to the user, optional
  shop: Types.ObjectId; // Reference to the shop where the order was placed
  totalAmount: number; // Total cost of the order
  paymentType: "COD" | "ONLINE";
  status: "pending" | "completed" | "canceled"; // Order status options
  createdAt: Date; // Order creation timestamp
  updatedAt: Date; // Order last update timestamp
  items: IOrderItem[]; // Array of items in the order
};
