import { Schema, model } from "mongoose";

import { IProduct } from "./product.interface";

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Product price must be a positive number"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
    },
    inventory: {
      type: Number,
      required: [true, "Inventory count is required"],
      min: [0, "Inventory count must be a positive number"],
    },
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: [true, "Shop ID is required"],
    },
    images: {
      type: [String],
      default: [],
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    orderItems: [
      {
        type: Schema.Types.ObjectId,
        ref: "OrderItem",
      },
    ],
  },
  { timestamps: true }
);

export const Product = model<IProduct>("Product", ProductSchema);
