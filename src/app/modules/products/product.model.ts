import { Schema, model } from "mongoose";

import { IProduct, IProductImage } from "./product.interface";
// Define the ProductImage schema
const ProductImageSchema = new Schema<IProductImage>(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false, // No automatic timestamps
    _id: true, // Each image has its own ID
  }
);

export const ProductImage = model<IProductImage>(
  "ProductImage",
  ProductImageSchema
);

// Define the Product schema
const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    inventory: {
      type: Number,
      required: true,
    },
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    images: [
      {
        type: Schema.Types.ObjectId,
        ref: "ProductImage",
      },
    ],
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
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

export const Product = model<IProduct>("Product", ProductSchema);
