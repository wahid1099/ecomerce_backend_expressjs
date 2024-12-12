import { IOrderItem } from "../order/order.interface";
import { IReview } from "../reviews/review.interface";
import { IShop } from "../shop/shop.interface";
import { Types } from "mongoose";

export type IProduct = {
  id: string; // UUID
  name: string;
  description: string;
  price: number;
  category: string;
  inventory: number;
  shopId: Types.ObjectId; // Shop ID
  shop?: IShop; // Populated if needed
  createdAt: Date;
  updatedAt: Date;
  images?: Types.ObjectId[] | IProductImage[];
  reviews?: Types.ObjectId[] | IReview[];
  orderItems?: Types.ObjectId[] | IOrderItem[];
};

export type IProductImage = {
  id: string; // UUID
  imageUrl: string;
  productId: Types.ObjectId;
  product?: IProduct; // Populated if needed
  createdAt: Date;
};
