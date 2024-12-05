import { IProduct } from "./../products/product.interface";
import { IOrder } from "../Orders/order.interface";
import { IUser } from "../user/user.interface";
export type IShop = {
  id: string; // UUID
  name: string;
  description?: string;
  logo?: string;
  vendorId: string; // User ID
  vendor?: IUser; // Populated if needed
  isBlacklisted: boolean;
  createdAt: Date;
  updatedAt: Date;
  products?: IProduct[]; // Optional
  orders?: IOrder[]; // Optional
  followers?: IUser[]; // Optional
  shopFollowers?: IShopFollower[]; // Optional
};

export type IShopFollower = {
  id: string; // UUID
  userId: string; // User ID
  shopId: string; // Shop ID
  user?: IUser; // Populated if needed
  shop?: IShop; // Populated if needed
  isBlacklisted?: boolean;
  createdAt: Date;
};
