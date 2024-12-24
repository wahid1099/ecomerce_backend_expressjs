import { Types } from "mongoose";

export type IReview = {
  id?: string;
  user: Types.ObjectId; // Populated if needed
  product: Types.ObjectId; // Populated if needed
  order: Types.ObjectId;
  shop: Types.ObjectId; // Populated if needed
  rating: number;
  image: string;
  comment?: string;
  createdAt: Date;
};
