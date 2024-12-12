import { IProduct } from "./../products/product.interface";
import { IUser } from "../user/user.interface";
import { Types } from "mongoose";

export type IReview = {
  id: string; // UUID
  userId: Types.ObjectId; // User ID
  user?: IUser; // Populated if needed
  productId: Types.ObjectId; // Product ID
  product?: IProduct; // Populated if needed
  rating: number; // 1-5
  comment?: string;
  createdAt: Date;
};
