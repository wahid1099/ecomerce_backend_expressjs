import { IProduct } from "./../products/product.interface";
import { IUser } from "../user/user.interface";
export type IReview = {
  id: string; // UUID
  userId: string; // User ID
  user?: IUser; // Populated if needed
  productId: string; // Product ID
  product?: IProduct; // Populated if needed
  rating: number; // 1-5
  comment?: string;
  createdAt: Date;
};
