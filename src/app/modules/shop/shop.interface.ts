import { IProduct } from "./../products/product.interface";
import { IOrder } from "../order/order.interface";
import { IUser } from "../user/user.interface";
import { Types } from "mongoose";

export type IShop = {
  id: string; // UUID
  name: string;
  description?: string;
  logo?: string;
  vendorId: Types.ObjectId;
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
  userId: Types.ObjectId;
  shopId: Types.ObjectId;
  user?: IUser; // Populated if needed
  shop?: IShop; // Populated if needed
  isBlacklisted?: boolean;
  createdAt: Date;
};
