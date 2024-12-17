import { Types } from "mongoose";

export type IOrder = {
  id: string; // UUID for the order
  user?: Types.ObjectId; // Populated user reference, optional
  shop: Types.ObjectId; // Reference to the shop where the order was placed
  totalAmount: number; // Total cost of the order
  status: "pending" | "completed" | "canceled"; // Order status options
  createdAt: Date; // Order creation timestamp
  updatedAt: Date; // Order last update timestamp
  items?: IOrderItem[]; // List of order items, optional
  payment?: Types.ObjectId; // Payment details, optional
};

export type IOrderItem = {
  id: string; // UUID for the order item
  product?: Types.ObjectId; // Populated product reference, optional
  order?: Types.ObjectId; // Populated order reference, optional
  quantity: number; // Quantity of the product in the order
  price: number; // Price per product item
};
