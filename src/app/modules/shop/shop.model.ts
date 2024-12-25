import mongoose, { Schema, model } from "mongoose";
import { IUser } from "../user/user.interface";
import { IProduct } from "../products/product.interface";
import { IOrder } from "../order/order.interface";
import { IShop } from "./shop.interface"; // Assuming you have a separate interface file for ShopFollower
import { User } from "../user/user.model"; // Import User model

// Define the ShopFollower schema

// Define the Shop schema
const ShopSchema = new Schema<IShop>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
    logo: {
      type: String,
      default: null,
    },
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isBlacklisted: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Middleware to update timestamps
ShopSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Post-save middleware to add the shop to the user's shops array
ShopSchema.post("save", async function (doc, next) {
  try {
    await User.findByIdAndUpdate(
      doc.vendorId,
      { $push: { shop: doc._id } }, // Add the shop's ID to the user's shops array
      { new: true }
    );
    next();
  } catch (err) {
    next();
  }
});

// Export the Shop model
export const Shop = model<IShop>("Shop", ShopSchema);
