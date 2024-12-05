import { IPayment } from "../Payment/payment.interface";
import { IShop, IShopFollower } from "../shop/shop.interface";
import { IOrder } from "../Orders/order.interface";
import { IReview } from "../reviews/review.interface";

export type IUser = {
  id: string; // UUID
  name?: string;
  email: string;
  username?: string; // Optional
  password: string;

  // Address details
  city?: string; // Optional
  state?: string; // Optional
  zip?: string; // Optional
  country?: string; // Optional
  phone?: string; // Optional

  role: "admin" | "vendor" | "customer"; // Restricted to specific roles
  isSuspended: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  shops?: IShop[];
  orders?: IOrder[];
  reviews?: IReview[];
  followedShops?: IShopFollower[];
  shopFollowers?: IShop[];
  payments?: IPayment[];
};

export type IUserUpdate = {
  name?: string;
  email?: string;
  username?: string; // Optional in updates
  password?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  phone?: string;
  isDeleted?: boolean;
  role?: "admin" | "vendor" | "customer";
  isSuspended?: boolean;
};
