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
  products?: Types.ObjectId[]; // Optional
  orders?: Types.ObjectId[]; // shop orders
  followers?: Types.ObjectId[]; // Optional
  shopFollowers?: Types.ObjectId[]; // Optional
};

export type IShopFollower = {
  user?: Types.ObjectId; // Populated if needed
  shop?: Types.ObjectId; // Populated if needed
  isBlacklisted?: boolean;
  createdAt: Date;
};
