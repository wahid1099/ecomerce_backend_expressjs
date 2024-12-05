import { IOrderItem } from "../Orders/order.interface";
import { IReview } from "../reviews/review.interface";
import { IShop } from "../shop/shop.interface";
export type IProduct = {
  id: string; // UUID
  name: string;
  description: string;
  price: number;
  category: string;
  inventory: number;
  shopId: string; // Shop ID
  shop?: IShop; // Populated if needed
  createdAt: Date;
  updatedAt: Date;
  images?: IProductImage[]; // Optional
  reviews?: IReview[]; // Optional
  orderItems?: IOrderItem[]; // Optional
};

export type IProductImage = {
  id: string; // UUID
  imageUrl: string;
  productId: string; // Product ID
  product?: IProduct; // Populated if needed
  createdAt: Date;
};
