import { IPayment } from "../Payment/payment.interface";
import { IProduct } from "../products/product.interface";
import { IUser } from "../user/user.interface";
import { IShop } from "../shop/shop.interface";
import { Types } from "mongoose";

export type IOrder = {
  id: string; // UUID for the order
  userId: Types.ObjectId; // Reference to the user who placed the order
  user?: IUser; // Populated user reference, optional
  shopId: Types.ObjectId; // Reference to the shop where the order was placed
  shop?: IShop; // Populated shop reference, optional
  totalAmount: number; // Total cost of the order
  status: "pending" | "completed" | "canceled"; // Order status options
  createdAt: Date; // Order creation timestamp
  updatedAt: Date; // Order last update timestamp
  items?: IOrderItem[]; // List of order items, optional
  payment?: IPayment; // Payment details, optional
};

export type IOrderItem = {
  id: string; // UUID for the order item
  productId: Types.ObjectId; // Reference to the product
  product?: IProduct; // Populated product reference, optional
  orderId: Types.ObjectId; // Reference to the parent order
  order?: IOrder; // Populated order reference, optional
  quantity: number; // Quantity of the product in the order
  price: number; // Price per product item
};
