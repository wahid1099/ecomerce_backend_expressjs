import { IOrder, IOrderItem } from "./order.interface";
import { Schema, model } from "mongoose";

// OrderItem Schema
const OrderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
});

// Order Schema
const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    paymentType: { type: String, enum: ["COD", "ONLINE"], equired: true },
    totalAmount: { type: Number, required: true },
    isReviewed: { type: Boolean, default: false }, // Initialize as false

    status: {
      type: String,
      enum: ["pending", "completed", "canceled"],
      required: true,
    },
    items: { type: [OrderItemSchema], required: true }, // Embedded array of order items
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create models
export const Order = model<IOrder>("Order", OrderSchema);
