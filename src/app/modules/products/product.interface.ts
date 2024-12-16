import { IOrderItem } from "../order/order.interface";
import { IReview } from "../reviews/review.interface";
import { IShop } from "../shop/shop.interface";
import { Types } from "mongoose";

export type IProduct = {
  _id: Types.ObjectId;
  name: string;
  slug: string; // SEO-friendly slug
  description: string;
  price: number;
  category: string;
  inventory: number;
  discount: number;
  // shopId: Types.ObjectId;
  shop: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  images?: string[];
  reviews?: Types.ObjectId[] | IReview[];
  orderItems?: Types.ObjectId[] | IOrderItem[];
  visibility: "active" | "inactive" | "archived"; // Product status
  variants?: IVariant[]; // Array of variants for the product
};

export type IVariant = {
  name: string; // e.g., "Size", "Color"
  options: string[]; // e.g., ["Small", "Medium", "Large"]
  stock: { [key: string]: number }; // Stock for each option, e.g., { "Small": 10, "Large": 5 }
  price?: number; // Optional price adjustment for the variant (e.g., for a special color)
  images?: string[]; // Variant-specific images, if applicable
};
