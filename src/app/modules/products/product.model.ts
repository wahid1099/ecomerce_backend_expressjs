import { Schema, model } from "mongoose";

import { IProduct, IVariant } from "./product.interface";

const VariantSchema = new Schema<IVariant>(
  {
    name: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
    },
    stock: {
      type: Map,
      of: Number,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    images: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
); // No need for a separate _id for variants

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
    },
    slug: {
      type: String,
      required: [true, "Product slug is required"],
      unique: true,
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
    discount: {
      type: Number,
      min: [0, "Discount cannot be less than 0"],
      max: [100, "Discount cannot be more than 100"],
      default: 0, // Optional field
    },
    // shopId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Shop",
    //   required: [true, "Shop ID is required"],
    // },
    shop: {
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
    visibility: {
      type: String,
      enum: ["active", "inactive", "archived"],
      default: "active",
    },
    variants: {
      type: [VariantSchema], // Variants are now optional
      default: [], // If no variants are provided, it defaults to an empty array
    },
  },
  { timestamps: true }
);
export const Product = model<IProduct>("Product", ProductSchema);
