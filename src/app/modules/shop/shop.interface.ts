import { IProduct } from "./../products/product.interface";
import { IOrder } from "../order/order.interface";
import { IUser } from "../user/user.interface";
import { Types } from "mongoose";

export type IShop = {
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
  user?: Types.ObjectId; // Populated if needed
  shop?: Types.ObjectId; // Populated if needed
  isBlacklisted?: boolean;
  createdAt: Date;
};
