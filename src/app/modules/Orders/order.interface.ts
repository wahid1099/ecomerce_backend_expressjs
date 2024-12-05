import { IPayment } from "../Payment/payment.interface";
import { IProduct } from "../products/product.interface";
import { IUser } from "../user/user.interface";
import { IShop } from "../shop/shop.interface";
export type IOrder = {
  id: string; // UUID
  userId: string; // User ID
  user?: IUser; // Populated if needed
  shopId: string; // Shop ID
  shop?: IShop; // Populated if needed
  totalAmount: number;
  status: "pending" | "completed" | "canceled"; // Status options
  createdAt: Date;
  updatedAt: Date;
  items?: IOrderItem[]; // Optional
  payment?: IPayment; // Optional
};

export type IOrderItem = {
  id: string; // UUID
  productId: string; // Product ID
  product?: IProduct; // Populated if needed
  orderId: string; // Order ID
  order?: IOrder; // Populated if needed
  quantity: number;
  price: number; // Price per item
};
